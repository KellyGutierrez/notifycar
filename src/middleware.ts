import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = request.nextUrl

    // Verificar modo mantenimiento
    const maintenanceMode = await checkMaintenanceMode()

    // Si está en modo mantenimiento y NO es admin, redirigir a página de mantenimiento
    if (maintenanceMode && token?.role !== 'ADMIN') {
        // Permitir acceso a la página de mantenimiento y recursos estáticos
        if (!pathname.startsWith('/maintenance') && !pathname.startsWith('/_next') && !pathname.startsWith('/api/auth')) {
            return NextResponse.redirect(new URL('/maintenance', request.url))
        }
    }

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

    return NextResponse.next()
}

async function checkMaintenanceMode(): Promise<boolean> {
    // DESACTIVADO TEMPORALMENTE: Causa bucle infinito en Docker al llamarse a sí mismo
    /*
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/settings/maintenance`, {
            cache: 'no-store'
        })
        if (response.ok) {
            const data = await response.json()
            return data.maintenanceMode === true
        }
    } catch (error) {
        console.error('Error checking maintenance mode:', error)
    }
    */
    return false
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
