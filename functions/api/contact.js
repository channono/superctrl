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

    // Check for recent duplicate messages (within last 10 seconds)
    const recentKey = `recent_${email}_${message.substring(0, 50)}`;
    const recentMessage = await context.env.MESSAGES.get(recentKey);
    
    if (recentMessage) {
      return new Response(JSON.stringify({ error: 'Please wait before sending another similar message' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store the message
    const key = `message_${Date.now()}_${name.replace(/[^a-z0-9]/gi, '_')}`;
    await context.env.MESSAGES.put(key, JSON.stringify(messageData));

    // Store recent message key with 10-second expiration
    await context.env.MESSAGES.put(recentKey, 'true', { expirationTtl: 10 });

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
