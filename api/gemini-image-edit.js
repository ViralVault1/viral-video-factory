export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData, tool, prompt } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const cleanImageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

  let editPrompt = '';
  switch (tool) {
    case 'background':
      editPrompt = `Change the background of this image to: ${prompt}. Keep the main subject unchanged.`;
      break;
    case 'style':
      editPrompt = `Apply this style to the image: ${prompt}. Transform the entire image with this style.`;
      break;
    case 'enhance':
      editPrompt = `Enhance this image: ${prompt}. Improve the quality, lighting, and details.`;
      break;
    case 'objects':
      editPrompt = `Modify objects in this image: ${prompt}. Make the requested changes to objects while preserving the overall scene.`;
      break;
    default:
      editPrompt = prompt;
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': geminiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: editPrompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: cleanImageData
                }
              }
            ]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
