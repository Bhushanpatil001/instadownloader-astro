import { defineMiddleware } from "astro:middleware";
import { verifySessionToken, verifySecretKey } from "./utils/auth";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const onRequest = defineMiddleware(async (context, next) => {
    const adminRoute = import.meta.env.ADMIN_ROUTE || process.env.ADMIN_ROUTE || "/hidden-admin";
    const url = new URL(context.request.url);

    // Only protect routes starting with the admin route, but NOT the login page itself
    // Wait, the requirement says "All admin APIs and pages must validate session/token AND secret key"

    if (url.pathname.startsWith(adminRoute) || url.pathname.startsWith('/api/admin')) {
        console.log(`[Middleware] Admin Access: ${url.pathname}, Route: ${adminRoute}`);

        // Check if it's the login page or login API
        const isLoginPage = url.pathname === adminRoute || url.pathname === `${adminRoute}/`;
        const isLoginApi = url.pathname === `/api/admin/login`;

        if (isLoginPage || isLoginApi) {
            return next();
        }

        // For all other admin pages/APIs, verify session
        const sessionToken = context.cookies.get("admin_session")?.value;
        const isValid = sessionToken ? verifySessionToken(sessionToken) : false;

        if (!isValid) {
            console.log(`[Middleware] Unauthorized, Redirecting to ${adminRoute}`);
            if (url.pathname.startsWith('/api/')) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
            // Only redirect if we are not already at the login page to avoid loops
            if (!isLoginPage) {
                return context.redirect(adminRoute);
            }
        }
    }

    return next();
});
