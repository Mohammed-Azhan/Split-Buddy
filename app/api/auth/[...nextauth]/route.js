import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Connect } from "../../../../lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        CredentialsProvider({
            async authorize(credentials) {
                if (credentials.email === "" || credentials.password === "") {
                    throw new Error("Please fill all the fields !");
                }
                await Connect();

                const user = await User.findOne({ email: credentials.email });

                if (!user) throw new Error("Invalid email entered");
                if (!user.password) {
                    throw new Error("This account was created using Google. Please sign in with Google.");
                }
                if (!(await bcrypt.compare(credentials.password, user.password)))
                    throw new Error("Invalid password entered");
                if (!user.isVerified)
                    throw new Error("Please verify your account");

                return {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email
                };
            }
        })
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                await Connect();

                let existing = await User.findOne({ email: user.email });

                if (existing && !existing.googleId) {
                    throw new Error("userExists");
                }

                if (!existing) {
                    const newUser = await User.create({
                        email: user.email,
                        googleId: user.id,
                        username: user.name,
                        profileImg: user.image,
                        isVerified: true
                    });

                    user.id = newUser._id.toString();
                    user.username = newUser.username;
                } else {
                    user.id = existing._id.toString();
                    user.username = existing.username;
                }
            }

            return user;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username || user.name;
                token.email = user.email;
                token.image = user.image;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.username = token.username;
            session.user.email = token.email;
            session.user.image = token.image;
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
