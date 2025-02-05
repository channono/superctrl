// Handle CORS preflight and POST requests
export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Allow': 'POST'
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

    const formData = await request.json();
    console.log('Received form data:', formData);

    const { name, email, subject, topic, message } = formData;
    // Use either subject or topic field
    const messageSubject = subject || topic || '';

    // Log received data
    console.log('Processing message:', { name, email, subject: messageSubject });

    // Validate required fields
    if (!name || !email || !messageSubject || !message) {
      const missing = [];
      if (!name) missing.push('name');
      if (!email) missing.push('email');
      if (!messageSubject) missing.push('subject/topic');
      if (!message) missing.push('message');

      console.log('Missing fields:', missing);

      return new Response(JSON.stringify({ 
        error: 'All fields are required',
        missing 
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
      subject: messageSubject,
      message,
      timestamp: new Date().toISOString()
    };

    // Generate unique ID using timestamp and random string
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.json`;

    // Store in KV
    await env.MESSAGES.put(filename, JSON.stringify(messageData));
    console.log('Message stored successfully:', filename);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent successfully',
      id: filename
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save message',
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
