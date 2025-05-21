export type NodeContent = {
  data: {
    header: string;
    markdown_formatted_content: string;
  }[];
  node_quiz: {
    question: string;
    answer: string;
  }[];
};


export type RoadmapResponse = {
  roadmap: {
    title: string;
    difficulty: number;
    description: string;
  };
  nodes: {
    title: string;
    description: string;
    node_order: number;
    is_completed: boolean;
    next_node: number | null;
  }[];
};
