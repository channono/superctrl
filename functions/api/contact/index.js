export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Check if KV namespace exists
    if (!env.MESSAGES) {
      console.error('MESSAGES KV namespace not found');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
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
          'Content-Type': 'application/json'
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
          'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
      }
    });
  }
}
