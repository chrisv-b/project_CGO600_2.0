const { db, admin } = require('./firebase-config');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Activation code is required' });
  }

  // Validate code format (UUID v4 format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(code)) {
    return res.status(400).json({ error: 'Invalid activation code format' });
  }

  try {
    // Check if code exists and is valid
    const tokenRef = db.collection('tokens').doc(code);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return res.status(404).json({ error: 'Invalid activation code' });
    }

    const tokenData = tokenDoc.data();
    
    if (tokenData.status !== 'nieuw') {
      return res.status(403).json({ 
        error: tokenData.status === 'gebruikt' ? 'Code already used' : 'Code is currently in use' 
      });
    }

    // Update status to "in-gebruik"
    await tokenRef.update({
      status: 'in-gebruik',
      gebruikt_op: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log the usage with IP address
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    console.log(`Code ${code} validated and set to in-gebruik at ${new Date().toISOString()} from IP: ${clientIP}`);

    res.status(200).json({ status: 'valid' });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 