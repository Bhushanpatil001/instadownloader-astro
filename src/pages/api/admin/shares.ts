import type { APIRoute } from 'astro';
import { getAllShares, saveShare, deleteShare } from '../../../services/shareService';
import { verifySessionToken } from '../../../utils/auth';

export const GET: APIRoute = async ({ cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const shares = await getAllShares();
    return new Response(JSON.stringify(shares), { status: 200 });
};

export const POST: APIRoute = async ({ request, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const shareData = await request.json();
        const savedShare = await saveShare(shareData);
        return new Response(JSON.stringify(savedShare), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to save share' }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const id = url.searchParams.get('id');
        if (id) {
            await deleteShare(id);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete share' }), { status: 500 });
    }
};
