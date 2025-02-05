export async function onRequestGet(context) {
  const { request, env } = context;

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // Log request info
    console.log('Request method:', request.method);
    console.log('Request URL:', request.url);
    console.log('Available env bindings:', Object.keys(env));

    // Get data from URL parameters
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const email = url.searchParams.get('email');
    const subject = url.searchParams.get('subject');
    const message = url.searchParams.get('message');
    const timestamp = url.searchParams.get('timestamp') || new Date().toISOString();

    console.log('Received parameters:', { name, email, subject, message, timestamp });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing fields:', { name, email, subject, message });
      return new Response(JSON.stringify({ 
        error: 'All fields are required'
      }), {
        status: 400,
        headers
      });
    }

    // Create message object
    const messageData = {
      name,
      email,
      subject,
      message,
      timestamp
    };

    console.log('Message data to save:', messageData);

    // Check if KV namespace exists
    if (!env.MESSAGES) {
      console.error('MESSAGES KV namespace not found - please bind it in Cloudflare Pages settings');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error - KV not bound',
        message: 'Please bind the MESSAGES KV namespace in Cloudflare Pages settings'
      }), {
        status: 500,
        headers
      });
    }

    // Generate unique ID using timestamp and email
    const filename = `message_${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}.json`;
    console.log('Generated filename:', filename);

    // Store in KV
    try {
      await env.MESSAGES.put(filename, JSON.stringify(messageData));
      console.log('Message saved successfully to KV');
    } catch (kvError) {
      console.error('Error saving to KV:', kvError);
      throw kvError;
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent successfully',
      filename
    }), {
      headers
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save message',
      details: error.message
    }), {
      status: 500,
      headers
    });
  }
}
