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
  - Only output the JSON — no extra commentary or formatting outside of it.
  - The data returned adheres to the EXACT FORMAT of the above and only that format. There should be no other text in the output.
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
    const result: ResponseBody = JSON.parse(res);
    return NextResponse.json({ result });

  } catch (error: unknown) {
    console.error('[AI/SUMMARIZE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
