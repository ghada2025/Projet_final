import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  console.log("[Middleware] Running for: ", req.nextUrl.pathname)

  const studentCookie = req.cookies.get('student')?.value;
  const teacherCookie = req.cookies.get('teacher')?.value;

  console.log("studentCookie: ", studentCookie);
  console.log("teacherCookie: ", teacherCookie);

  // If no user is authenticated, force login
  if (!studentCookie && !teacherCookie) {
    if (url.pathname !== '/login') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If student tries to access teacher-dashboard ➔ unauthorized
  if (studentCookie && url.pathname.startsWith('/teacher-dashboard')) {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  // If teacher tries to access student-dashboard ➔ unauthorized
  if (teacherCookie && url.pathname.startsWith('/student-dashboard')) {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student-dashboard',
    '/student-dashboard/:path*',
    '/teacher-dashboard/:path*',
  ],
};