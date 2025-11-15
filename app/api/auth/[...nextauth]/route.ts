import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: เชื่อม backend login API
        if (credentials?.email === "test@example.com" && credentials.password === "1234") {
          return { id: "1", name: "Nattakrit" }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST }
