import { addUser, getUserByEmail } from "@/lib/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#444", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(`callback `, user);
      const isAllowedToSignIn = true;
      try {
        const userExists = await getUserByEmail(user.email);
        if (!userExists) {
          // save user to db
          console.log(`adding user ${user.email} to db.`);
          const result = await addUser(user.email);
        }
      } catch (error) {
        console.log(`error while signing in, ${error}`);
      }
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
};

export default NextAuth(authOptions);
