import type { APIRoute } from 'astro';
import { validateAdminCredentials, createSessionToken } from '../../../utils/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { username, password, secretKey } = await request.json();

        if (validateAdminCredentials(username, password, secretKey)) {
            const token = createSessionToken();

            cookies.set('admin_session', token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
};
