import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import Credentials from 'next-auth/providers/credentials';
import { login, oauth } from '@/features/auth/login/loginFetchers';
import { authPages } from '@/utils/routes';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await login({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        return res.result;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
    async signIn({ account, user }: any) {
      if (['google', 'github', 'discord'].includes(account.provider)) {
        const newUser = await oauth({
          email: user.email,
          image: user.image,
          provider: account.provider,
        });

        delete user.name;
        user.username = newUser.result.username;
        user.email = newUser.result.email;
        user.isVerified = newUser.result.isVerified;
        user.role = newUser.result.role;
        user.image = newUser.result.image;
        user.token = newUser.result.token;
      }
      return true;
    },
  },
  pages: {
    signIn: authPages.login.path,
  },
});
