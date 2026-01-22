import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { imageUrl, provider = 'anthropic' } = await req.json();
    console.log('AI Generation Request:', { imageUrl, provider });

    if (!imageUrl) {
      return new Response('Missing imageUrl', { status: 400 });
    }

    const model = provider === 'google' 
      ? google('gemini-1.5-flash') 
      : anthropic('claude-sonnet-4-5-20250929');

    const result = await generateObject({
      model: model as any,
      schema: z.object({
        tags: z.array(z.string()).describe('5-10 design terminology tags'),
        description: z.string().describe('A brief artistic description of the image style'),
      }),
      messages: [
          {
            role: 'system',
            content: `You are an expert design curator. Analyze the image and generate 4-6 highly specific visual design tags. 
            Avoid generic terms like "Design" or "Art". Focus on:
            1. Visual Aesthetic (e.g., "Glassmorphism", "Brutalism", "Y2K", "Swiss Style")
            2. Technical attributes (e.g., "Gaussian Blur", "Halftone Pattern", "Chromatic Aberration", "Grainy Texture")
            3. Typography (e.g., "Kinetic Typography", "Monospace", "Expanded Sans")
            4. Layout/Composition (e.g., "Grid System", "Asymmetry", "Negative Space")
            5. Color/Light (e.g., "Neon Gradient", "High Contrast", "Soft Lighting")
            
            Keep tags short (1-3 words max). Return the most prominent descriptors first.`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Generate specific design tags for this image.' },
              { type: 'image', image: imageUrl },
            ],
          },
      ],
    });

    return Response.json(result.object);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
