import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import type { NextRequest } from 'next/server';
import { authPages, dashboardUserPages, mainPages } from '@/utils/routes';
import { UserSession } from '@/features/types';

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user as UserSession;
  const currentPath = req.nextUrl.pathname;
  const dashboardPath = '/dashboard';
  const dashboardAdminPath = '/dashboard/admin';
  const dashboardUserPath = '/dashboard/user';
  const singInSignUpPath = [authPages.login.path, authPages.register.path];

  if (!session && currentPath.startsWith(dashboardPath)) {
    if (currentPath === dashboardUserPages.profile.path) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(authPages.login.path, req.url));
  } else if (session && singInSignUpPath.includes(currentPath)) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    user?.role === 'USER' &&
    currentPath.startsWith(dashboardAdminPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    user?.role !== 'USER' &&
    currentPath.startsWith(dashboardUserPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  }

  return NextResponse.next();
};
