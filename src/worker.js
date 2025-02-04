export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API endpoints
    if (url.pathname.startsWith('/api/')) {
      // Contact form submission
      if (url.pathname === '/api/contact' && request.method === 'POST') {
        try {
          const data = await request.json();
          const { name, email, subject, message } = data;
          
          const messageData = {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
          };
          
          const key = `message_${Date.now()}_${name.replace(/[^a-z0-9]/gi, '_')}`;
          await env.MESSAGES.put(key, JSON.stringify(messageData));
          
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
      
      // Get all messages
      if (url.pathname === '/api/messages' && request.method === 'GET') {
        try {
          const keys = await env.MESSAGES.list();
          const messages = await Promise.all(
            keys.keys.map(async (key) => {
              const value = await env.MESSAGES.get(key.name);
              return JSON.parse(value);
            })
          );
          
          messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          return new Response(JSON.stringify(messages), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Failed to read messages' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    // Serve static files
    return env.ASSETS.fetch(request);
  }
}
