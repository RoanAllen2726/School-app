import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import { clerkClient } from '@clerk/nextjs';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization');
  const user = token ? await clerkClient.users.getUser(token) : null;

  if (!user || !['teacher', 'student'].includes(user.publicMetadata.role)) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  return NextResponse.next();
}

