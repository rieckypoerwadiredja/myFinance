import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

function parseAuthorizedEmails() {
  return (process.env.AUTHORIZED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID ?? "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    // }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = String(user.email ?? "")
        .trim()
        .toLowerCase();
      if (!email) return false;
      const allowed = parseAuthorizedEmails();
      return allowed.includes(email);
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
