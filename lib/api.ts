// API functions

import { RoadmapResponse } from "@/app/app.types";

export const getRoadmapEmbeddings = async (query: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    console.log("Embeddings fetch failed");
    return Promise.reject(response.statusText);
  }

  const embeddings = await response.json();
  console.log("Received embeddings:", embeddings); // Log the received data
  return embeddings;
}

export const getAiResponse = async (input: string, age: number, comfort_level: number, additional_subject_info: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/summarise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input, age, comfort_level, additional_subject_info })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: RoadmapResponse = await response.json();
  return data;
}
