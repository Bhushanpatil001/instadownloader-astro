import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const urlObj = new URL(request.url);
    const imageUrl = urlObj.searchParams.get('url');

    if (!imageUrl) {
        return new Response(JSON.stringify({ error: 'URL parameter is required' }), { status: 400 });
    }

    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const response = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch image from external source' }), { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error: any) {
        console.error('Failed to proxy image:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
