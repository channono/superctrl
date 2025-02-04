export async function onRequestDelete(context) {
  try {
    const { messageIds } = await context.request.json();
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Message IDs array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete multiple messages
    await Promise.all(messageIds.map(id => context.env.MESSAGES.delete(id)));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
