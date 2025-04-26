import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
  You are a curriculum design assistant that specializes in generating math learning roadmaps for high school students (grades 9–12).

  You will receive the following input:
	•	Concept (e.g. “trigonometry”, “logarithms”)
	•	Age (typically 14–18)
	•	Grade (9 to 12)
	•	Math Comfort Level (1–5)
	•	Additional Subject Information

  Your job is to return:
	1.	A roadmap object:
	•	title: The name of the roadmap. It should not exceed 20 characters. It must be relevant
	•	difficulty: A number from 1–5, estimating the roadmap’s challenge level
	•	description: A short, clear summary of what the student will learn and achieve
	2.	A list of nodes, where each node is a single, digestible concept. Each node includes:
	•	data:
	•	title: Concept title (e.g. “Unit Circle”, “Laws of Logarithms”)
	•	description: A 1–2 sentence explanation or goal of the step
	•	node_order: Step number in the roadmap (starting from 1)
	•	is_completed: false
	•	next_node: null

  Guidelines:
	•	Each roadmap should contain 4 to 7 nodes
	•	Ensure content is age-appropriate, focused on depth and application
	•	Use plain English, but don’t shy away from introducing proper terminology
	•	Your tone should be clear, motivating, and precise

  Output format:
	•	Return the roadmap and nodes as a single JSON object
	•	Do not include any additional text or explanation—only the JSON

	Example Input:
	{
  "input": "logarithms",
  "age": 16,
  "grade": 11,
  "comfort_level": 2,
  "additional_subject_info": "Calculus"
  }
  Example Output:
  {
    "roadmap": {
      "title": "Understanding Logarithms",
      "difficulty": 3,
      "description": "A high school-level journey through the core ideas behind logarithms, their rules, and real-world applications."
    },
    "nodes": [
      {
        "data": {
          "title": "What Is a Logarithm?",
          "description": "Explore the inverse relationship between logarithms and exponents."
        },
        "node_order": 1,
        "is_completed": false,
        "next_node": null
      },
      {
        "data": {
          "title": "Common Logarithmic Functions",
          "description": "Understand base-10 and natural logarithms and how to evaluate them."
        },
        "node_order": 2,
        "is_completed": false,
        "next_node": null
      },
      {
        "data": {
          "title": "Logarithmic Rules",
          "description": "Master the product, quotient, and power rules of logarithms."
        },
        "node_order": 3,
        "is_completed": false,
        "next_node": null
      },
      {
        "data": {
          "title": "Solving Logarithmic Equations",
          "description": "Learn techniques to solve equations involving logs, including change of base."
        },
        "node_order": 4,
        "is_completed": false,
        "next_node": null
      },
      {
        "data": {
          "title": "Real-World Applications",
          "description": "Apply logarithms to real problems like measuring earthquakes and sound intensity."
        },
        "node_order": 5,
        "is_completed": false,
        "next_node": null
      }
    ]
  }
`;

type RequestBody = {
  input: string;
  age: number;
  comfort_level: number;
  additional_subject_info: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();

    if (!body.input) {
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
