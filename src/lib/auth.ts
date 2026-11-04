import { cookies } from "next/headers";
import { db } from "./db";
import { UserRole } from "./types";

export interface AuthContext {
  isAuthenticated: boolean;
  isGateUnlocked: boolean;
  user?: {
    email: string;
    name: string;
    role: UserRole;
  };
}

export async function getInkRoomSession(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("ink_gate_token")?.value;
  const sessionToken = cookieStore.get("ink_session_token")?.value;

  const isGateUnlocked = !!gateToken && gateToken === "unlocked_verified";

  if (!isGateUnlocked || !sessionToken) {
    return {
      isAuthenticated: false,
      isGateUnlocked,
    };
  }

  const session = db.validateSession(sessionToken);
  if (!session) {
    return {
      isAuthenticated: false,
      isGateUnlocked,
    };
  }

  const user = db.getUserByEmail(session.email);
  if (!user) {
    return {
      isAuthenticated: false,
      isGateUnlocked,
    };
  }

  return {
    isAuthenticated: true,
    isGateUnlocked: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export function hasPermission(
  userRole: UserRole,
  action: "read_drafts" | "create" | "edit" | "publish" | "delete" | "manage_security" | "view_analytics"
): boolean {
  if (userRole === "Owner") return true;

  switch (action) {
    case "read_drafts":
    case "create":
    case "edit":
      return ["Publisher", "Editor", "Contributor"].includes(userRole);
    case "publish":
      return ["Publisher"].includes(userRole);
    case "delete":
      return ["Publisher"].includes(userRole);
    case "view_analytics":
      return ["Publisher", "Editor"].includes(userRole);
    case "manage_security":
      return false; // Owner only
    default:
      return false;
  }
}
