exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        body: 'Supabase credentials not configured'
      };
    }

    const response = await fetch(
      supabaseUrl + '/rest/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, subject, message })
      }
    );

    if (!response.ok) {
      return {
        statusCode: 500,
        body: 'Failed to save message'
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
