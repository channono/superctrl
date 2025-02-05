export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
    const { name, email, subject, message } = formData;

    // Log received data
    console.log('Received form data:', { name, email, subject });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
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

    // Generate unique ID using timestamp and random string
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.json`;

    try {
      // Store in KV
      await env.MESSAGES.put(filename, JSON.stringify(messageData));
      console.log('Message stored successfully:', filename);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message sent successfully',
        id: filename
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (kvError) {
      console.error('KV storage error:', kvError);
      throw new Error('Failed to store message in KV');
    }
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
