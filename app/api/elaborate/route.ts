import { NextResponse } from "next/server";
import type { ResponseBody, RequestBody } from "./elaborate.types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
  You are an expert math content generator.

  You will be given four inputs:
  1. A title representing a base math topic.
  2. A short description explaining the concept.
  3. A difficulty level (from 1 to 5), which determines the complexity of the explanation and questions.

  Your task is to combine these inputs to generate a single educational node, STRICTLY structured in JSON format with the following structure:

  {
    "data": [
      {
        "header": string,                      // A section heading breaking down part of the concept
        "markdown_formatted_content": string   // Well-formatted explanation using markdown (including bold, lists, and LaTeX-style math notation)
      }
    ],
    "node_quiz": [
      {
        "question": string,                    // A quiz question relevant to the content
        "answer": string                       // The correct answer with a short explanation, if needed
      }
    ]
  }

  Ensure that:
  - The explanation and quiz match the specified difficulty level.
  - Markdown formatting is clear and includes math notation (e.g., f(x) = x^2, **bold**, etc.).
  - Content is conceptually accurate, concise, and well-structured for student learning.
  - Content is in-depth and covers all aspects of the topic.
  - ONLY OUTPUT VALID JSON - NO TEXT BEFORE OR AFTER THE JSON.
  - DO NOT include any commentary, explanations, or backticks outside the JSON.
  - DO NOT include \`\`\`json or any markdown formatting outside the JSON object.
  - The response should begin with { and end with } with nothing else outside.
  - IMPORTANT: For math notation, use standard LaTeX syntax like $x^2$ or $$\frac{a}{b}$$.
  - Make sure to preserve newlines in your markdown content by using proper line breaks.
  - Keep your JSON valid by escaping special characters properly.
  `


export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Missing input' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(body) }
      ]
    });

    let res = completion.choices[0].message.content;
    if (!res) {
      return NextResponse.json(
        { error: 'Could not generate the required content' },
        { status: 500 }
      );
    }
    
    try {
      // Clean the response to handle potential formatting issues
      res = res.trim();
      
      // Remove any markdown code block indicators if present
      res = res.replace(/^```json\s*/, '');
      res = res.replace(/^```\s*/, '');
      res = res.replace(/\s*```$/, '');
      
      // Try to parse the response as JSON
      const result = JSON.parse(res);
      
      // Ensure newlines are preserved in markdown content
      if (result.data && Array.isArray(result.data)) {
        result.data.forEach(item => {
          if (item.markdown_formatted_content) {
            // No additional processing needed as JSON.parse preserves \n characters
          }
        });
      }
      
      return NextResponse.json({ ...result });
    } catch (parseError) {
      console.error('[JSON_PARSE_ERROR]', parseError);
      console.log('Raw response content:', res);
      
      // Try to extract valid JSON - simplify to just extract the JSON content
      try {
        // Find content between outermost curly braces
        const jsonMatch = res.match(/{[\s\S]*}/);
        if (jsonMatch) {
          const jsonContent = jsonMatch[0];
          const result = JSON.parse(jsonContent);
          return NextResponse.json({ ...result });
        }
      } catch (innerError) {
        console.error('[JSON_EXTRACTION_ERROR]', innerError);
      }
      
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON', raw_response: res.substring(0, 500) },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('[AI/SUMMARIZE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
