// API functions

import { ResponseBody } from "@/app/api/elaborate/elaborate.types";
import { RoadmapResponse } from "@/app/app.types";

import { Tables } from "@/utils/database.types";
type Node = Tables<"node">
type NodeData = Tables<"node_data">
type Roadmap = Tables<"roadmaps">

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

export const getElaboratedResponse = async (input: string, age: number, comfort_level: number, additional_subject_info: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/elaborate`, {
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

export const getNodeData = async (node: Node, roadmap: Roadmap) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/elaborate`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      title: node.title,
      description: node.description,
      difficulty: roadmap.difficulty,
    })
  });

  const { data }: { data: ResponseBody } = await response.json()
  return data;
}
