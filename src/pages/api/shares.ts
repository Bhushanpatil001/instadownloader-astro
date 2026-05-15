import type { APIRoute } from 'astro';
import { saveShare } from '../../services/shareService';

export const POST: APIRoute = async ({ request }) => {
    try {
        const shareData = await request.json();
        
        // Basic validation
        if (!shareData.targetUrl || !shareData.title) {
            return new Response(JSON.stringify({ error: 'URL and Title required' }), { status: 400 });
        }

        const savedShare = await saveShare(shareData);
        return new Response(JSON.stringify(savedShare), { status: 201 });
    } catch (error) {
        console.error('Failed to create public share:', error);
        return new Response(JSON.stringify({ error: 'Failed to create share' }), { status: 500 });
    }
};
