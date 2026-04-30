import type { APIRoute } from 'astro';
import { getAllBlogs, saveBlog, deleteBlog } from '../../../services/blogService';
import { verifySessionToken } from '../../../utils/auth';

export const GET: APIRoute = async ({ cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const blogs = await getAllBlogs();
    return new Response(JSON.stringify(blogs), { status: 200 });
};

export const POST: APIRoute = async ({ request, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const blog = await request.json();
        await saveBlog(blog);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to save blog' }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
    const session = cookies.get('admin_session')?.value;
    if (!session || !verifySessionToken(session)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const blog = await request.json();
        await saveBlog(blog);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update blog' }), { status: 500 });
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
            await deleteBlog(id);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete blog' }), { status: 500 });
    }
};


