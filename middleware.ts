export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/protected/:path*"],
};

export function middleware() {
  // Middleware logic can be added here if needed
}
