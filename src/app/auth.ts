import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    profile?: any;
  }
}

const config = {
  providers: [
    {
      id: "dex",
      name: "SCS Dex",
      type: "oidc",
      authorization: {
        params: { scope: ["openid profile email groups"] },
      },
      issuer: process.env.DEX_URL,
      clientId: process.env.DEX_CLIENT_ID,
      client: {
        token_endpoint_auth_method: "none",
      },
    },
  ],
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, profile }) {
      if (user) token.user = user;
      if (profile) token.profile = profile;
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) session.profile = token.profile;
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
