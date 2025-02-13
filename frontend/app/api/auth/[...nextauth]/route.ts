import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account }) {
      // Persist the access_token to the token after sign in
      if (account) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google/`, // Your Django endpoint
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token, // Pass the Google ID token
              }),
            }
          );

          if (!response.ok) {
            console.error("Error from backend:", response.statusText);
            throw new Error("Failed to fetch tokens from backend");
          }

          const data = await response.json();
          token.accessToken = data.access_token;
          token.refreshToken = data.refresh_token;
        } catch (error) {
          console.error("Error fetching tokens:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken; // Optionally pass refresh token
      return session;
    },
  },
});

export { handler as GET, handler as POST };