"use client";

import { useMemo, useState } from "react";

type LeadStatus = "new" | "in_progress" | "done";

interface Lead {
  id: string;
  createdAt: string;
  status: LeadStatus;
  lang: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string[];
  area: string;
  city: string;
  objectType: string;
  address: string;
  visitDate: string;
  comment: string;
  consent: boolean;
  isTest: boolean;
  meta: Record<string, unknown>;
}

type TestSort = "none" | "realFirst" | "testFirst";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  in_progress: "In progress",
  done: "Done",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVisit(v: string): string {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [testSort, setTestSort] = useState<TestSort>("none");
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        l.id,
        l.company,
        l.name,
        l.phone,
        l.email,
        l.city,
        l.objectType,
        l.address,
        l.service.join(" "),
        l.comment,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    if (testSort !== "none") {
      // Stable sort grouping by the test flag; keeps newest-first within groups.
      // testFirst → test rows on top (descending); realFirst → real rows on top.
      const dir = testSort === "testFirst" ? -1 : 1;
      rows.sort((a, b) => (Number(a.isTest) - Number(b.isTest)) * dir);
    }
    return rows;
  }, [leads, query, statusFilter, testSort]);

  const testCount = useMemo(
    () => leads.filter((l) => l.isTest).length,
    [leads],
  );

  function cycleTestSort() {
    setTestSort((s) =>
      s === "none" ? "testFirst" : s === "testFirst" ? "realFirst" : "none",
    );
  }

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { leads: Lead[] };
        setLeads(data.leads);
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function patchLead(
    id: string,
    body: { status?: LeadStatus; isTest?: boolean },
    optimistic: (l: Lead) => Lead,
  ) {
    const prev = leads;
    setSavingId(id);
    setLeads((cur) => cur.map((l) => (l.id === id ? optimistic(l) : l)));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) setLeads(prev); // roll back on failure
    } catch {
      setLeads(prev);
    } finally {
      setSavingId(null);
    }
  }

  function changeStatus(id: string, status: LeadStatus) {
    // Test leads are locked: status can't change while the Test flag is on.
    const lead = leads.find((l) => l.id === id);
    if (lead?.isTest) return;
    patchLead(id, { status }, (l) => ({ ...l, status }));
  }

  function toggleTest(id: string, isTest: boolean) {
    patchLead(id, { isTest }, (l) => ({ ...l, isTest }));
  }

  return (
    <>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search company, name, phone, city, address…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="admin-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | LeadStatus)
          }
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button
          className="btn btn-subtle"
          onClick={refresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
        <span className="admin-count">
          {filtered.length} of {leads.length}
          {testCount > 0 && ` · ${testCount} test`}
        </span>
      </div>

      <div className="admin-card">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <h3>No applications</h3>
            <p>
              {leads.length === 0
                ? "New submissions from the website form will appear here."
                : "No results match your search."}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th
                    className={`th-sortable th-test${
                      testSort !== "none" ? " is-sorted" : ""
                    }`}
                    onClick={cycleTestSort}
                    title="Click to group test rows"
                  >
                    Test
                    <span className="th-sort-icon">
                      {testSort === "testFirst"
                        ? "▼"
                        : testSort === "realFirst"
                          ? "▲"
                          : "⇅"}
                    </span>
                  </th>
                  <th>ID</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Company</th>
                  <th>Full name</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Area</th>
                  <th>City</th>
                  <th>Property type</th>
                  <th>Address</th>
                  <th>Preferred date</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className={l.isTest ? "row-test" : undefined}>
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={l.isTest}
                        aria-label="Mark as test data"
                        disabled={savingId === l.id}
                        className={`switch${l.isTest ? " is-on" : ""}`}
                        onClick={() => toggleTest(l.id, !l.isTest)}
                      >
                        <span className="switch-knob" />
                      </button>
                    </td>
                    <td className="cell-id">{l.id}</td>
                    <td className="cell-date">{formatDate(l.createdAt)}</td>
                    <td>
                      <select
                        className={`status-select status-${l.status}`}
                        value={l.status}
                        disabled={savingId === l.id || l.isTest}
                        title={
                          l.isTest
                            ? "Turn off Test to edit this lead"
                            : undefined
                        }
                        onChange={(e) =>
                          changeStatus(l.id, e.target.value as LeadStatus)
                        }
                        aria-label="Status"
                      >
                        {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="cell-strong">{l.company || "—"}</td>
                    <td>{l.name || "—"}</td>
                    <td className="cell-contact">
                      {l.phone && <a href={`tel:${l.phone}`}>{l.phone}</a>}
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="cell-muted">
                          {l.email}
                        </a>
                      )}
                      {!l.phone && !l.email && "—"}
                    </td>
                    <td>
                      {l.service.length ? (
                        <div className="chips">
                          {l.service.map((s, i) => (
                            <span className="chip" key={i}>
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{l.area ? `${l.area} m²` : "—"}</td>
                    <td>{l.city || "—"}</td>
                    <td>{l.objectType || "—"}</td>
                    <td>{l.address || "—"}</td>
                    <td>{formatVisit(l.visitDate)}</td>
                    <td className="cell-comment">{l.comment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
