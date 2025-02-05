export async function onRequest(context) {
  const { request, env } = context;

  try {
    // Check if KV namespace exists
    if (!env.MESSAGES) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const formData = await request.json();
    const { name, email, subject, message } = formData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ 
        error: 'All fields are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
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

    // Generate unique ID
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.json`;

    // Store in KV
    await env.MESSAGES.put(filename, JSON.stringify(messageData));

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to save message'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
