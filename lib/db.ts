"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import type { Tables } from "@/utils/database.types";
import type { ResponseBody } from "@/app/api/elaborate/elaborate.types";
import { getAiResponse, getNodeData } from "./api";

type User = Tables<"users">
type Roadmap = Tables<"roadmaps">
type Node = Tables<"node">
type NodeData = Tables<"node_data">


export const fetchRoadmaps = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) {
    console.log("User not found");
    return Promise.reject(user.error);
  }

  const currentUser = user.data.user;
  const { data, error } = await supabase
    .from("roadmaps")
    .select("*")
    .filter("user_id", "eq", currentUser.id)

  if (error) {
    console.log("Roadmaps fetch failed");
    return Promise.reject(error);
  }
  else {
    return Promise.resolve(data);
  }
};

// does not work. need to fundamentally rework the way embeddings are generated and used.

export const createNewRoadmap = async (input: string, age: number, comfort_level: number, additional_subject_info: string) => {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    if (!user_id) {
      throw new Error("User not authenticated");
    }

    const data = await getAiResponse(input, age, comfort_level, additional_subject_info);
    const roadmap_id = uuidv4();

    console.log(data);

    const { data: roadmapData, error: roadmapError } = await supabase.from("roadmaps")
      .insert<Partial<Roadmap>>({
        id: roadmap_id,
        user_id: user_id,
        title: data.roadmap.title,
        difficulty: data.roadmap.difficulty,
        description: data.roadmap.description,
        total_nodes: data.nodes.length,
      })
      .select();

    if (roadmapError) {
      throw new Error(`Error creating roadmap: ${roadmapError.message}`);
    }
    const nodePromises = data.nodes.map(async (node: any) => {
      return supabase.from("node")
        .insert<Partial<Node>>({
          id: uuidv4(),
          roadmap_id: roadmap_id,
          is_completed: false,
          node_order: node.node_order,
          title: node.title,
          description: node.description
        });
    });

    const nodeResults = await Promise.all(nodePromises);

    const nodeErrors = nodeResults.filter(result => result.error);
    if (nodeErrors.length > 0) {
      console.error("Some nodes failed to insert:", nodeErrors);
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      roadmap_id,
      roadmap: data.roadmap,
      nodes_inserted: data.nodes.length - nodeErrors.length
    };
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    return {
      success: false,
      //@ts-ignore
      error: error.message
    };
  }
}

export const fetchRoadmapFromUser = async (roadmapId: string): Promise<Roadmap> => {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then((user) => user.data?.user ? user.data.user.id : null);
  const { data, error } = await supabase
    .from("roadmaps")
    .select("*")
    .filter("user_id", "eq", user_id)
    .filter("id", "eq", roadmapId)
    .limit(1)

  if (error || !data || data.length === 0) {
    console.log("Roadmap fetch failed");
    return Promise.reject(error);
  }
  else {
    const roadmap: Roadmap = data[0];
    return Promise.resolve(roadmap);
  }
}

export const fetchNodesFromRoadmap = async (roadmapId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node")
    .select("*")
    .filter("roadmap_id", "eq", roadmapId)
    .order("node_order", { ascending: true })

  if (error) {
    console.log("Nodes fetch failed");
    return Promise.reject(error);
  }
  else {
    const nodeData: Node[] = data;
    return Promise.resolve(nodeData);
  }
}

export const fetchNodeData = async (roadmapId: string, nodeId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_data")
    .select("*")
    .filter("id", "eq", nodeId)

  if (error) {
    console.log("Node data fetch failed");
    return Promise.reject(error);
  }
  else {
    const result: NodeData = data[0];
    return Promise.resolve(result);
  }
}

export const createNodeDataIfNotExists = async (node: Node, roadmap: Roadmap) => {
  try {
    const supabase = await createClient();
    
    // First check if node_data exists for this node
    const { data, error } = await supabase
      .from("node_data")
      .select("*")
      .eq("id", node.id)
      .single();
    
    // If there's data and it's initialized, return it
    if (data && data.initialized) {
      return data;
    }
    
    // Get new data from the API
    const newNodeData = await getNodeData(node, roadmap);
    
    // If no existing record, insert one
    if (error && error.code === 'PGRST116') { // Record not found
      const { data: insertData, error: insertError } = await supabase
        .from("node_data")
        .insert<Partial<NodeData>>({
          id: node.id,
          initialized: true,
          data: newNodeData
        })
        .select()
        .single();
        
      if (insertError) {
        throw insertError;
      }
      
      return insertData || { id: node.id, initialized: true, data: newNodeData };
    } else {
      // Update existing record
      const { data: updateData, error: updateError } = await supabase
        .from("node_data")
        .update<Partial<NodeData>>({
          initialized: true,
          data: newNodeData
        })
        .eq("id", node.id)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      return updateData || { id: node.id, initialized: true, data: newNodeData };
    }
  } catch (error) {
    console.error("Error in createNodeDataIfNotExists:", error);
    throw error;
  }
}
