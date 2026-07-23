import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/adminAuth";
import { listLeads } from "@/lib/db";
import LeadsTable from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifySession(token)) redirect("/admin/login");

  const leads = listLeads();

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="dot" />
          ApexGold Admin
        </div>
        <div className="admin-topbar-actions">
          <span>admin.apexgold.cz</span>
          <form action="/api/admin/logout" method="post">
            <button className="btn btn-ghost" type="submit" formNoValidate>
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Applications</h1>
            <p className="admin-subtitle">
              Every request submitted through the website form.
            </p>
          </div>
        </div>
        <LeadsTable initialLeads={leads} />
      </main>
    </>
  );
}
