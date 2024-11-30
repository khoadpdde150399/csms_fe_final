// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.ACCESSTOKEN_SECRET_KEY,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const randomPassword = "randomGeneratedPassword123";
      try {
        const response = await axios.post('https://www.backend.csms.io.vn/api/customer/googleLogin', {
          email: user.email,
          password: randomPassword,
          username: profile.name,
          phone: profile.phone || "",
        });

        if (response.status === 200) {
          const customerInfor = {
            access_token: response.data.access_token,
            access_token_expires: response.data.access_token_expires,
          };

          user.access_token = customerInfor.access_token;
          user.access_token_expires = customerInfor.access_token_expires;
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error logging in with Google:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.access_token_expires = user.access_token_expires;
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.access_token_expires = token.access_token_expires;
      session.user.id = token.sub;
      return session;
    },
  },
});

