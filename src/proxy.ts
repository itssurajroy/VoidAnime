import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isStaticFile = request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);
  
  if (isMaintenanceMode && !isAdminRoute && !isApiRoute && !isStaticFile) {
    return NextResponse.json(
      { 
        error: 'Maintenance Mode', 
        message: process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || 'The site is currently under maintenance. Please try again later.' 
      },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)',
  ],
};
