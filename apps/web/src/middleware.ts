import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import type { NextRequest } from 'next/server';
import { authPages, dashboardAdminPages, mainPages } from '@/utils/routes';
import { UserSession } from '@/features/types';

export const config = {
  // runtime: 'experimental-edge',
  unstable_allowDynamic: ['./**'],
};

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user as UserSession;
  const currentPath = req.nextUrl.pathname;
  const dashboardPath = '/dashboard';
  const dashboardAdminPath = '/dashboard/admin';
  const dashboardUserPath = '/dashboard/user';
  const singInSignUpPath = [authPages.login.path, authPages.register.path];
  const onlySuperAdminPath = [
    dashboardAdminPages.user.path,
    dashboardAdminPages.warehouse.path,
  ];
  const onlyUserIsVerified = ['/cart', '/checkout', '/wishlist'];

  if (!session && currentPath.startsWith(dashboardPath)) {
    return NextResponse.rewrite(new URL(authPages.login.path, req.url));
  } else if (session && singInSignUpPath.includes(currentPath)) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    (user?.role === 'USER' || !user?.isVerified) &&
    currentPath.startsWith(dashboardAdminPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    (user?.role !== 'USER' || !user?.isVerified) &&
    currentPath.startsWith(dashboardUserPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    (user?.role === 'ADMIN' || !user?.isVerified) &&
    onlySuperAdminPath.includes(currentPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  } else if (
    (user?.role !== 'USER' || !user?.isVerified) &&
    onlyUserIsVerified.includes(currentPath)
  ) {
    return NextResponse.redirect(new URL(mainPages.home.path, req.url));
  }

  return NextResponse.next();
};
