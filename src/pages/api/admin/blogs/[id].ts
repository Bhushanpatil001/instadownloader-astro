import type { APIRoute } from 'astro';
import { getAllBlogs, saveBlog, deleteBlog } from '../../../../services/blogService';
import { verifySessionToken } from '../../../../utils/auth';

export const GET: APIRoute = async ({ params, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = params;
    const blogs = await getAllBlogs();
    const blog = blogs.find(b => b.id === id);

    if (!blog) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    return new Response(JSON.stringify(blog), { status: 200 });
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const blog = await request.json();
        await saveBlog(blog);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update' }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { id } = params;
        console.log(`[API DELETE] Request received for ID: ${id}`);
        
        if (id) {
            await deleteBlog(id);
            console.log(`[API DELETE] Successfully deleted ID: ${id}`);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
    } catch (error) {
        console.error(`[API DELETE] Error:`, error);
        return new Response(JSON.stringify({ error: 'Failed to delete' }), { status: 500 });
    }
};
