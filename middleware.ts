import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"  ],
};
