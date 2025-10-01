// api/videostatus.js - For Replicate
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jobId = req.query.jobId;

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  try {
    const REPLICATE_API_KEY = process.env.REPLICATE_API_TOKEN;

    if (!REPLICATE_API_KEY) {
      throw new Error('Replicate API key not configured');
    }

    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Replicate API error: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    console.log('Replicate status:', statusData.status);

    let status = 'processing';
    let videoUrl = null;
    let progress = 50;

    if (statusData.status === 'succeeded') {
      status = 'completed';
      videoUrl = statusData.output;
      progress = 100;
    } else if (statusData.status === 'failed' || statusData.status === 'canceled') {
      status = 'failed';
      progress = 0;
    } else if (statusData.status === 'processing' || statusData.status === 'starting') {
      status = 'processing';
      progress = 50;
    }

    return res.status(200).json({
      jobId,
      status,
      progress,
      videoUrl,
      error: status === 'failed' ? statusData.error : null
    });

  } catch (error) {
    console.error('Error checking video status:', error);
    
    return res.status(500).json({ 
      error: 'Failed to check video status',
      details: error.message,
      jobId
    });
  }
}
