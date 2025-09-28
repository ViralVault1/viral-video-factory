// Simple Gemini 2.5 Flash Image integration - replaces all the complex Replicate code

const processImageWithGemini = async (imageData: string, tool: string, prompt: string): Promise<string> => {
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
  }

  // Convert base64 to clean format (remove data:image/jpeg;base64, prefix if present)
  const cleanImageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

  // Create the appropriate prompt based on the tool selected
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': geminiApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: editPrompt
            },
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Extract the generated image from the response
    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No image generated in response');
    }

    // Find the image part in the response
    const imagePart = candidate.content.parts.find((part: any) => part.inline_data);
    if (!imagePart?.inline_data?.data) {
      throw new Error('No image data found in response');
    }

    // Return the image as a data URL
    return `data:image/jpeg;base64,${imagePart.inline_data.data}`;

  } catch (error) {
    console.error('Gemini processing error:', error);
    throw new Error(`Failed to process image with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Updated generateEdit function - much simpler!
const generateEdit = async () => {
  if (!originalImage || !prompt.trim()) {
    alert('Please upload an image and enter a prompt.');
    return;
  }

  if (!user) {
    alert('Please sign in to use AI features.');
    return;
  }

  if (credits < 5) {
    alert('Insufficient credits. You need at least 5 credits to generate an edit.');
    return;
  }

  setIsGenerating(true);
  setEditedImage(null);

  try {
    // Consume credits first
    await consumeCredits('imageGeneration');
    
    // Process with Gemini - simple and reliable!
    const resultUrl = await processImageWithGemini(originalImage, selectedTool, prompt);
    setEditedImage(resultUrl);
    
    // Show success message
    alert('🎉 Image edited successfully! Your snow mountain background has been applied.');
    
  } catch (error) {
    console.error('Error generating edit:', error);
    alert(`Error: ${error instanceof Error ? error.message : 'Failed to generate edit'}`);
  } finally {
    setIsGenerating(false);
  }
};
