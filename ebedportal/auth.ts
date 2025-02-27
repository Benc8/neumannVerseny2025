import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { random } from "nanoid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()));

        if (!user) return null;

        const isValidPassword = await compare(
          credentials.password.toString(),
          user.password,
        );

        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          status: user.status,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check for existing user
          let [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!));

          if (!dbUser) {
            // Generate random password placeholder
            const randomPassword = random(4).toString();

            // Insert new user and get inserted ID
            [dbUser] = await db
              .insert(users)
              .values({
                email: user.email!,
                fullName: user.name!,
                password: randomPassword,
                status: "PENDING",
                role: "USER",
                emailVerified: new Date(),
              })
              .returning(); // Return the inserted record
          }

          // Update the user object with database ID
          user.id = dbUser.id;

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Merge user info into token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Assign token data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
