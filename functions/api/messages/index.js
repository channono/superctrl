// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Handle GET requests
export async function onRequestGet(context) {
  const { env } = context;

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
  } catch (error) {
    console.error('Error listing messages:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list messages',
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

// Handle DELETE requests
export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
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
  } catch (error) {
    console.error('Error deleting messages:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete messages',
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
