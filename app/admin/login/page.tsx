import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  isAdminConfigured,
  verifySession,
} from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (verifySession(token)) redirect("/admin");

  const configured = isAdminConfigured();

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <span className="dot" />
          ApexGold Admin
        </div>
        {configured ? (
          <>
            <p className="login-hint">
              Sign in with your login and password, then confirm with your
              authenticator code.
            </p>
            <LoginForm />
          </>
        ) : (
          <p className="login-hint">
            Admin is not configured yet. Run{" "}
            <code>node scripts/setup-admin.mjs</code> and restart the server.
          </p>
        )}
      </div>
    </div>
  );
}
