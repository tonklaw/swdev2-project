import { userLogin } from "@/libs/auth"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        if (!credentials) return null

        const user = await userLogin(
          credentials.email,
          credentials.password
        )
        
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }