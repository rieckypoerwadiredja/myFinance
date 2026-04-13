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
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  providers: (() => {
    const providers = [];

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (googleClientId && googleClientSecret) {
      providers.push(
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      );
    }

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (githubClientId && githubClientSecret) {
      providers.push(
        GitHubProvider({
          clientId: githubClientId,
          clientSecret: githubClientSecret,
        }),
      );
    }

    return providers;
  })(),
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
