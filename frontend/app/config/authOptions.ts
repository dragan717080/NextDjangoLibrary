import bcrypt from "bcrypt";
import type { AuthOptions, RequestInternal, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "@/app/interfaces";
import type { AdapterUser } from "next-auth/adapters";

let authUser: User | null = null;

// Overriding default session to include avatars
type UpdatedAdapterUser = AdapterUser & { avatar: File, avatar_url: string }

export const authOptions: AuthOptions = {
  // Expose user so that after credentials sign in it can be possible to add new fields
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "name", type: "text" },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: Record<"name" | "email" | "password", string> | undefined,
        // eslint-disable-next-line
        req: Pick<RequestInternal, "headers" | "body" | "query" | "method">
      ): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;
        const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?email=${email}`;

        const response = await fetch(userUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status >= 400) {
          throw new Error("Couldn't retrieve user data");
        }

        const userData = await response.json() as User[] | null;

        const user = userData ? userData[0] : null;

        if (!user) {
          return null;
        }

        const { password_hash } = user;
        const isCorrectPassword = await bcrypt.compare(password, password_hash);

        if (!isCorrectPassword) {
          throw new Error("Passwords don't match");
        }

        // @ts-expect-error disable id required
        return {
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn(user) {
      if (user.account!.provider === "credentials") {
        const { email } = user.user;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?email=${email}`
        );

        if (!response?.ok) {
          throw new Error((response as unknown as { message: string }).message);
          return false;
        }

        const users = await response.json() as User[];
        if (!users.length) {
          throw new Error("User does not exist");
        }

        // Update next auth session with the authenticated user that was fetched from Django
        authUser = users[0];

        return true;
      }

      // Handling sign in with social providers

      const { name: username, email, image: avatar_url } = user.user;
      // Send the user data to the Django backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, avatar_url }),
        }
      );

      const data = (await response.json()) as User[] | { message: string };

      // For social providers it is fine if user already exists
      if (
        response.status === 201 ||
        ((data as { message: string }).message && (data as { message: string }).message.includes("duplicate key"))
      ) {
        return true;
      } else {
        return false;
      }
    },
    // @ts-expect-error adding custom properties from the app
    async session(session) {
      // Was signed in via social providers
      const signedInWithSocialProviders = Object.keys(session.token).includes(
        "picture"
      );

      if (signedInWithSocialProviders && session.token.picture) {
        if (authUser) {
          authUser.avatar_url = session.token.picture;
        }

        return session;
      }

      if (authUser) {
        session.session.user = {
          ...(session.session.user || {}), // Preserve existing session user properties
          avatar: authUser.avatar,
          avatar_url: authUser.avatar_url
        } as UpdatedAdapterUser;
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
