// api/video-status.js - For Runway ML
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
    const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

    if (!RUNWAY_API_KEY) {
      throw new Error('Runway API key not configured');
    }

    const statusResponse = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-09-13'
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Runway API error: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    console.log('Runway status:', statusData);

    let status = 'processing';
    let videoUrl = null;
    let progress = 50;

    if (statusData.status === 'SUCCEEDED') {
      status = 'completed';
      videoUrl = statusData.output?.[0];
      progress = 100;
    } else if (statusData.status === 'FAILED') {
      status = 'failed';
      progress = 0;
    } else if (statusData.status === 'RUNNING') {
      status = 'processing';
      progress = statusData.progress ? statusData.progress * 100 : 50;
    }

    return res.status(200).json({
      jobId,
      status,
      progress,
      videoUrl,
      error: status === 'failed' ? statusData.failure_reason : null
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
