import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Custom logic can be added here
    // For example, logging user info:
    console.log("User token in middleware:", req.nextauth.token);
  },
  // {
  //   callbacks: {
  //     authorized: ({ token }) => token?.role === "admin", // Example: restrict access to admin users
  //   },
  //   pages: {
  //     signIn: "/login", // Redirect unauthenticated users to a custom login page
  //   },
  // },
);

export const config = {
  matcher: ["/protected/:path*", "/inventory/new", "/requests/new"],
};
