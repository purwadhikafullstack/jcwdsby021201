import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import type { NextRequest } from 'next/server';
import { authPages, dashboardPages, mainPages } from '@/utils/routes';

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  const currentPath = req.nextUrl.pathname;
  const dashboardPath = '/dashboard';
  const singInSignUpPath = [authPages.login.path, authPages.register.path];

  if (!session && currentPath.startsWith(dashboardPath)) {
    if (currentPath === dashboardPages.profile.path) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(authPages.login.path, req.url));
  } else if (session && singInSignUpPath.includes(currentPath)) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  }

  return NextResponse.next();
};
