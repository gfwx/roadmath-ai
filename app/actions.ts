"use server";

import { encodedRedirect } from "@/utils/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Tables } from "@/utils/database.types";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

type User = Tables<"users">
type Roadmap = Tables<"roadmaps">
type Node = Tables<"node">

const createUserInDatabase = async (id: string, username: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('users')
    .insert({
      id: id,
      username: username,
      display_name: username,
      is_onboarded: false,
    })
    .select()

  if (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(data);
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  if (!username) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Username is required",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (!data.user) {
    return encodedRedirect("error", "/sign-up", "User not found");
  }

  await createUserInDatabase(data.user.id, username)
    .catch((error) => {
      console.error(error);
      return encodedRedirect("error", "/sign-up", "Failed to create user");
    });

  return redirect(
    "/"
  );
};

export const signInAction = async (formData: FormData) => {

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

const validateIfUserExists = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.auth.getUser();
  return error || !data.user ? false : true;
};

export const finishOnboarding = async (
  formData: {
    username: string;
    display_name: string;
    age: string;
    gender: string;
    nationality: string;
    m_comfort_level: string;
    m_grade_equiv: string;
  }
) => {
  const supabase = await createClient();

  if (!validateIfUserExists) {
    console.log("Something went wrong.");
    return redirect("/error");
  }

  const authUser = (await supabase.auth.getUser()).data.user;
  if (authUser) {
    const { data, error } = await supabase.from("users")
      .upsert<Partial<User>>({
        id: authUser.id,
        display_name: formData.display_name ?? formData.username,
        age: parseInt(formData.age),
        gender: formData.gender,
        nationality: formData.nationality,
        m_comfort_level: parseInt(formData.m_comfort_level),
        m_grade_equiv: parseInt(formData.m_grade_equiv),
        is_onboarded: true
      })

    if (error) {
      console.log("User update failed");
      return Promise.reject(error);
    }
    else {
      return Promise.resolve(data);
    }
  }
  else {
    return Promise.reject("Somehow, despite all the checks, the user is not found. Must be supernatural causes.")
  }
};

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

  const data = await response.json();
  return data.result;
}

export const createNewRoadmap = async (input: string, age: number, comfort_level: number, additional_subject_info: string) => {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    if (!user_id) {
      throw new Error("User not authenticated");
    }

    const data = await getAiResponse(input, age, comfort_level, additional_subject_info);
    const jsonData = JSON.parse(data);

    const roadmap_id = uuidv4();

    const { data: roadmapData, error: roadmapError } = await supabase.from("roadmaps")
      .insert<Partial<Roadmap>>({
        id: roadmap_id,
        user_id: user_id,
        title: jsonData.roadmap.title,
        difficulty: jsonData.roadmap.difficulty,
        description: jsonData.roadmap.description,
        total_nodes: jsonData.nodes.length,
      })
      .select();

    if (roadmapError) {
      throw new Error(`Error creating roadmap: ${roadmapError.message}`);
    }
    const nodePromises = jsonData.nodes.map(async (node: any) => {
      return supabase.from("node")
        .insert<Partial<Node>>({
          id: uuidv4(),
          roadmap_id: roadmap_id,
          is_completed: false,
          node_order: node.node_order,
          data: node.data
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
      roadmap: jsonData.roadmap,
      nodes_inserted: jsonData.nodes.length - nodeErrors.length
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

export const fetchRoadmapFromUser = async (roadmapId: string) => {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then((user) => user.data?.user ? user.data.user.id : null);
  const { data, error } = await supabase
    .from("roadmaps")
    .select("*")
    .filter("user_id", "eq", user_id)
    .filter("id", "eq", roadmapId)

  if (error) {
    console.log("Roadmap fetch failed");
    return Promise.reject(error);
  }
  else {
    return Promise.resolve(data);
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
    return Promise.resolve(data);
  }
}

export const fetchNodeData = async (roadmapId: string, nodeId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_data")
    .select("*")
    .filter("roadmap_id", "eq", roadmapId)
    .filter("node_id", "eq", nodeId)

  if (error) {
    console.log("Node data fetch failed");
    return Promise.reject(error);
  }
  else {
    return Promise.resolve(data);
  }
}

export const createNodeData = async (roadmapId: string, nodeId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/elaborate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title:
        roadmapId, nodeId
    })
  });
}
