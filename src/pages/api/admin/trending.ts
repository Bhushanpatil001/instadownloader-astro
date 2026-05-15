import type { APIRoute } from 'astro';
import { getTrendingData, updateTrendingData } from '../../../services/trendingService';
import { verifySessionToken } from '../../../utils/auth';

export const GET: APIRoute = async ({ cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const data = await getTrendingData();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch trending data' }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { trending } = await request.json();
        await updateTrendingData(trending);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update trending data' }), { status: 500 });
    }
};
