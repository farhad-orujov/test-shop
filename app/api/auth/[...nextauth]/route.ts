import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { JWT } from 'next-auth/jwt';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
  }
}

interface IUserWithAdmin {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();
          
          // Allow login by email OR by username (name) to support brute-force lab
          const user = await User.findOne({ $or: [{ email: credentials.email }, { name: credentials.email }] });
          
          if (!user) {
            return null;
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            return null;
          }

          console.log('User from DB:', { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name, 
            isAdmin: user.isAdmin 
          });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as IUserWithAdmin).isAdmin;
        console.log('JWT callback - setting token:', { id: token.id, isAdmin: token.isAdmin });
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        console.log('Session callback - setting session:', { 
          userId: session.user.id, 
          userIsAdmin: session.user.isAdmin 
        });
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };