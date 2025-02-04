export async function onRequestGet(context) {
  try {
    // Check if KV binding exists
    if (!context.env.MESSAGES) {
      console.error('KV binding MESSAGES not found');
      return new Response(JSON.stringify({ 
        error: 'KV binding not configured',
        env: Object.keys(context.env)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List all keys from KV
    const keys = await context.env.MESSAGES.list();
    
    // Get all messages
    const messages = await Promise.all(
      keys.keys.map(async (key) => {
        const value = await context.env.MESSAGES.get(key.name);
        const messageData = JSON.parse(value);
        return {
          ...messageData,
          id: key.name
        };
      })
    );

    // Sort by timestamp, newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify(messages), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to read messages:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to read messages',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
