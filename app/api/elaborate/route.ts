import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
  You are an expert math content generator.

  You will be given four inputs:
  1. A title representing a base math topic.
  2. A short description explaining the concept.
  3. Additional semantic context stored in a variable called "vector_embedding_context".
  4. A difficulty level (from 1 to 5), which determines the complexity of the explanation and questions.

  Your task is to combine these inputs to generate a single educational node in structured JSON format with the following structure:

  {
    "node_title": string,                      // A clear, student-friendly title
    "node_desc": string,                       // A short paragraph introducing the topic at the specified difficulty level
    "node_data": [
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
  - Only output the JSON — no extra commentary or formatting outside of it.
  `
type RequestBody = {
  title: string;                    // Title of the math topic
  description: string;              // Short explanation of the topic
  difficulty: number;               // Difficulty level (1–5)
  vector_embedding_context: string; // Additional semantic context (from embedding retrieval)
};

type ResponseBody = {
  node_title: string;
  node_desc: string;
  node_data: {
    header: string;
    markdown_formatted_content: string;
  }[];
  node_quiz: {
    question: string;
    answer: string;
  }[];
};

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

    const result = completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error('[AI/SUMMARIZE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
