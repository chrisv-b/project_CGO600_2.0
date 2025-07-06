const { db } = require('./firebase-config');
const fs = require('fs');
const path = require('path');

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
    // Check if code exists and is in "in-gebruik" status
    const tokenRef = db.collection('tokens').doc(code);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return res.status(404).json({ error: 'Invalid activation code' });
    }

    const tokenData = tokenDoc.data();
    
    if (tokenData.status !== 'in-gebruik') {
      return res.status(403).json({ 
        error: tokenData.status === 'gebruikt' ? 'Code already used' : 'Code not validated' 
      });
    }

    // Serve the hack.bin file
    const firmwarePath = path.join(process.cwd(), 'private_firmware', 'hack.bin');
    
    if (!fs.existsSync(firmwarePath)) {
      console.error('Firmware file not found:', firmwarePath);
      return res.status(500).json({ error: 'Firmware file not available' });
    }

    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="hack.bin"');

    // Stream the file with error handling
    const fileStream = fs.createReadStream(firmwarePath);
    
    fileStream.on('error', (err) => {
      console.error('Firmware streaming error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Firmware streaming error' });
      }
    });

    fileStream.pipe(res);

    // Log the usage with IP address
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    console.log(`Firmware served for code ${code} at ${new Date().toISOString()} from IP: ${clientIP}`);

  } catch (error) {
    console.error('Get firmware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 