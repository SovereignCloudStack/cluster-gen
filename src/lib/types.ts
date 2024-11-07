import { Session } from "next-auth";

export interface DexSession extends Session {
  user?: {
    username?: string;
    name?: string;
    groups?: string[];
  };
  profile?: {
    preferred_username?: string;
    groups?: string[];
  };
}
