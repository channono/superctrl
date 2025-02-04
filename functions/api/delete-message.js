export async function onRequestDelete(context) {
  try {
    const { messageIds } = await context.request.json();
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Message IDs array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get list of all messages first
    const list = await context.env.MESSAGES.list();
    const keys = list.keys.map(k => k.name);

    // Filter valid keys to delete
    const keysToDelete = messageIds.filter(id => keys.includes(id));

    if (keysToDelete.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid messages found to delete' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete messages
    await Promise.all(keysToDelete.map(key => context.env.MESSAGES.delete(key)));
    
    return new Response(JSON.stringify({ 
      success: true,
      deletedCount: keysToDelete.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
