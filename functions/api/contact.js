export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create message object
    const messageData = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    };

    // Store in KV
    const key = `message_${Date.now()}_${name.replace(/[^a-z0-9]/gi, '_')}`;
    await context.env.MESSAGES.put(key, JSON.stringify(messageData));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
