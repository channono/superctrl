export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    // Check if KV namespace exists
    if (!env.MESSAGES) {
      console.error('MESSAGES KV namespace not found');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (request.method === 'GET') {
      // List all messages
      const messages = [];
      const keys = await env.MESSAGES.list();
      
      for (const key of keys.keys) {
        const message = await env.MESSAGES.get(key.name, { type: 'json' });
        if (message) {
          messages.push({
            ...message,
            filename: key.name
          });
        }
      }

      return new Response(JSON.stringify(messages), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else if (request.method === 'DELETE') {
      const { filenames } = await request.json();
      
      if (!Array.isArray(filenames)) {
        return new Response(JSON.stringify({ error: 'Invalid request: filenames must be an array' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Delete messages from KV
      const deletions = filenames.map(filename => env.MESSAGES.delete(filename));
      await Promise.all(deletions);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Messages deleted successfully',
        deleted: filenames
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Request failed',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
