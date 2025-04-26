import { createClient } from "@/utils/supabase/server";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const supabase = await createClient();

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        input: query,
        model: 'text-embedding-3-small',
        dimensions: 384
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', error);
      return new Response(JSON.stringify({ error: 'Embedding API error', details: error }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseData = await response.json();
    console.log('API response:', responseData);

    if (!responseData.data || !responseData.data[0]) {
      return new Response(JSON.stringify({ error: 'Unexpected API response format' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const embedding = responseData.data[0].embedding;

    const { data } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 100
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in embeddings API:', error);
    //@ts-ignore
    return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
