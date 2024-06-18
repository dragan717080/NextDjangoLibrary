import type { ISODateString, Session } from "next-auth";

/**
 * Custom extended next auth session object for the needs of app
 */
export default interface CustomSession extends Session {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatar?: File | null;
      avatar_url?: string | null;
    };
    expires: ISODateString;
  };
}
