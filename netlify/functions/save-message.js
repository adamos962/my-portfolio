exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    const supabaseUrl = process.env.SUPABASE_URL;
    // prefer service role key for server-side writes, fallback to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        body: 'Supabase credentials not configured'
      };
    }

    const url = supabaseUrl + '/rest/v1/messages';
    const bodyPayload = { name, email, message };

    // Log request for easier debugging in function logs
    console.log('save-message: posting to', url, 'payload:', bodyPayload ? Object.keys(bodyPayload) : null);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => 'unable to read response body');
      console.error('save-message: supabase error', response.status, text);
      return {
        statusCode: response.status || 500,
        body: `Failed to save message: ${text}`
      };
    }

    return {
      statusCode: 200,
      body: 'Message saved'
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: String(err.message || err)
    };
  }
};
