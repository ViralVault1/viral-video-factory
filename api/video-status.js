// api/video-status.js - For ModelsLab
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
    const MODELSLAB_API_KEY = process.env.MODELSLAB_API_KEY;

    if (!MODELSLAB_API_KEY) {
      throw new Error('ModelsLab API key not configured');
    }

    // ModelsLab fetch endpoint (v6 for fetching, even though v7 for creation)
    const statusResponse = await fetch('https://modelslab.com/api/v6/video/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: MODELSLAB_API_KEY,
        request_id: jobId
      })
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('ModelsLab status check error:', errorText);
      throw new Error(`ModelsLab API error: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    console.log('ModelsLab status response:', JSON.stringify(statusData, null, 2));

    // Map ModelsLab status to standardized format
    let status = 'processing';
    let videoUrl = null;
    let progress = 50;

    if (statusData.status === 'success') {
      status = 'completed';
      // Get video URL from links or proxy_links array
      videoUrl = statusData.links?.[0] || statusData.proxy_links?.[0] || statusData.output?.[0];
      progress = 100;
    } else if (statusData.status === 'error' || statusData.status === 'failed') {
      status = 'failed';
      progress = 0;
    } else if (statusData.status === 'processing' || statusData.status === 'pending') {
      status = 'processing';
      progress = statusData.eta ? 75 : 50;
    }

    return res.status(200).json({
      jobId,
      status,
      progress,
      videoUrl,
      error: status === 'failed' ? (statusData.message || statusData.error) : null,
      eta: statusData.eta,
      generationTime: statusData.generationTime,
      metadata: {
        message: statusData.message || statusData.messege,
        generationTime: statusData.generationTime
      }
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
