export type ResponseBody = {
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

export type RequestBody = {
  title: string;                    // Title of the math topic
  description: string;              // Short explanation of the topic
  difficulty: number;               // Difficulty level (1–5)
};

export type ResponseBody = {
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
