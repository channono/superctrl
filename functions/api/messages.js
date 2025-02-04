export async function onRequestGet(context) {
  try {
    // List all keys from KV
    const keys = await context.env.MESSAGES.list();
    
    // Get all messages
    const messages = await Promise.all(
      keys.keys.map(async (key) => {
        const value = await context.env.MESSAGES.get(key.name);
        return JSON.parse(value);
      })
    );

    // Sort by timestamp, newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify(messages), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
