import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

// Liste des routes protégées
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const token = request.cookies.get("access_token")?.value;
        console.log("[middleware] Path:", pathname);
        console.log("[middleware] Token:", token);
        let valid = false;
        if (token) {
            valid = await verifyToken(token);
        }
        if (!token) {
            console.log("[middleware] Pas de token, redirection.");
        }
        if (token && !valid) {
            console.log("[middleware] Token invalide, redirection.");
        }
        if (!token || !valid) {
            const url = request.nextUrl.clone();
            url.pathname = "/auth/signin";
            return NextResponse.redirect(url);
        }
        console.log("[middleware] Token valide, accès autorisé.");
    }
    return NextResponse.next();
}


export const config = {
    matcher: ["/dashboard/:path*"],
};
