export async function onRequest(context) {
  const { request, env } = context;

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

    if (request.method === 'POST') {
      // Get data from request body as JSON
      const formData = await request.json();
      console.log('Received form data:', formData);

      const { name, email, subject, message, timestamp } = formData;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        console.log('Missing fields:', { name, email, subject, message });
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
        timestamp: timestamp || new Date().toISOString()
      };

      // Generate unique ID
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.json`;
      console.log('Saving message with filename:', filename);

      // Store in KV
      await env.MESSAGES.put(filename, JSON.stringify(messageData));
      console.log('Message saved successfully');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message sent successfully'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else if (request.method === 'GET') {
      // Get data from URL parameters
      const url = new URL(request.url);
      const name = url.searchParams.get('name');
      const email = url.searchParams.get('email');
      const subject = url.searchParams.get('subject');
      const message = url.searchParams.get('message');
      const timestamp = url.searchParams.get('timestamp');

      // Validate required fields
      if (!name || !email || !subject || !message) {
        console.log('Missing fields:', { name, email, subject, message });
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
        timestamp: timestamp || new Date().toISOString()
      };

      // Generate unique ID
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.json`;
      console.log('Saving message with filename:', filename);

      // Store in KV
      await env.MESSAGES.put(filename, JSON.stringify(messageData));
      console.log('Message saved successfully');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message sent successfully'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Error saving message:', error);
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
