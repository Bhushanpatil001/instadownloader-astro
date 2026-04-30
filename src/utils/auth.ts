import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const ADMIN_SECRET_KEY = import.meta.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY;

export function validateAdminCredentials(username: string, password: string, secretKey: string): boolean {
    return (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD &&
        secretKey === ADMIN_SECRET_KEY
    );
}

export function createSessionToken(): string {
    // Simple token generation: hash of some secret + timestamp
    const timestamp = Date.now().toString();
    const data = `${ADMIN_SECRET_KEY}-${timestamp}`;
    const hash = crypto.createHmac('sha256', ADMIN_SECRET_KEY || 'default_secret').update(data).digest('hex');
    return `${timestamp}.${hash}`;
}

export function verifySessionToken(token: string): boolean {
    if (!token) return false;

    const [timestamp, hash] = token.split('.');
    if (!timestamp || !hash) return false;

    // Check if token is older than 24 hours
    const tokenTime = parseInt(timestamp);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
        return false;
    }

    const expectedHash = crypto
        .createHmac('sha256', ADMIN_SECRET_KEY || 'default_secret')
        .update(`${ADMIN_SECRET_KEY}-${timestamp}`)
        .digest('hex');

    return hash === expectedHash;
}

export function verifySecretKey(secretKey: string): boolean {
    return secretKey === ADMIN_SECRET_KEY;
}
