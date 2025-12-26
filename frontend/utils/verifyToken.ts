import { jwtVerify } from "jose";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "dev-secret-key";

export async function verifyToken(token: string): Promise<boolean> {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[verifyToken] JWT error:', e);
        return false;
    }
}