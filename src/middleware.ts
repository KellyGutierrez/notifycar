import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = request.nextUrl

    // Proteger rutas de admin - solo ADMIN puede acceder
    if (pathname.startsWith('/admin')) {
        if (!token || token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/account/signin', request.url))
        }
    }

    // Proteger rutas corporativas - CORPORATE y ADMIN pueden acceder
    if (pathname.startsWith('/corporate')) {
        if (!token || (token.role !== 'CORPORATE' && token.role !== 'ADMIN')) {
            return NextResponse.redirect(new URL('/account/signin', request.url))
        }
    }

    // Proteger rutas institucionales
    if (pathname.startsWith('/institutional')) {
        if (!token || (token.role !== 'INSTITUTIONAL' && token.role !== 'ADMIN')) {
            return NextResponse.redirect(new URL('/account/signin', request.url))
        }
    }

    // 4. Forzar completar teléfono si falta (solo para usuarios autenticados)
    if (token && !token.phoneVerified && !pathname.startsWith('/account/complete-phone') && !pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/account/complete-phone', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)',
    ],
}
