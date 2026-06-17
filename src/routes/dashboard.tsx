import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Activity, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — CrisisEye" },
      {
        name: "description",
        content:
          "Track active incidents, resolved cases, response times, and category breakdowns across your region.",
      },
      { property: "og:title", content: "Operations Dashboard — CrisisEye" },
      {
        property: "og:description",
        content: "A clean operations dashboard for emergency monitoring and reporting.",
      },
    ],
  }),
  component: DashboardPage,
});

const weekly = [
  { day: "Mon", reports: 42, resolved: 36 },
  { day: "Tue", reports: 51, resolved: 44 },
  { day: "Wed", reports: 38, resolved: 35 },
  { day: "Thu", reports: 64, resolved: 52 },
  { day: "Fri", reports: 71, resolved: 60 },
  { day: "Sat", reports: 58, resolved: 49 },
  { day: "Sun", reports: 46, resolved: 41 },
];

const responseTrend = [
  { hour: "00", min: 9.2 },
  { hour: "04", min: 8.1 },
  { hour: "08", min: 6.7 },
  { hour: "12", min: 5.8 },
  { hour: "16", min: 6.4 },
  { hour: "20", min: 7.5 },
];

const types = [
  { name: "Fire", value: 28, color: "#DC2626" },
  { name: "Flood", value: 22, color: "#1E40AF" },
  { name: "Road Accident", value: 31, color: "#D97706" },
  { name: "Medical", value: 14, color: "#059669" },
  { name: "Other", value: 5, color: "#64748B" },
];

const recent = [
  { id: "CE-48211", type: "Fire", area: "Industrial District", status: "Active", severity: "High", time: "12 min ago" },
  { id: "CE-48198", type: "Flood", area: "Riverside Ave", status: "Responding", severity: "Moderate", time: "34 min ago" },
  { id: "CE-48184", type: "Road Accident", area: "Highway 9", status: "Resolved", severity: "Moderate", time: "1 hr ago" },
  { id: "CE-48173", type: "Medical", area: "Central Park S.", status: "Resolved", severity: "High", time: "1 hr ago" },
  { id: "CE-48160", type: "Fire", area: "Northpoint Hills", status: "Resolved", severity: "Low", time: "2 hr ago" },
];

function DashboardPage() {
  return (
    <PageShell>
      <section className="bg-gradient-to-b from-secondary/70 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Operations overview</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            A snapshot of incidents and response performance over the last 7 days.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Active incidents" value="24" delta="+3" trend="up" tone="alert" icon={Activity} />
          <KpiCard label="Resolved this week" value="317" delta="+12%" trend="up" tone="ok" icon={CheckCircle2} />
          <KpiCard label="Avg. response time" value="6.4 min" delta="-0.8" trend="down" tone="ok" icon={Clock} />
          <KpiCard label="Critical alerts" value="4" delta="+1" trend="up" tone="alert" icon={AlertTriangle} />
        </div>

        {/* Charts grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card-elevated p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Reports vs resolved</h2>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Legend color="var(--color-primary)" label="Reports" />
                <Legend color="var(--color-chart-4)" label="Resolved" />
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} barCategoryGap={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip cursor={{ fill: "var(--color-secondary)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="reports" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-elevated p-5">
            <h2 className="text-sm font-semibold text-foreground">Incidents by type</h2>
            <p className="text-xs text-muted-foreground">Current week</p>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={types} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} strokeWidth={2} stroke="var(--color-background)">
                    {types.map((t) => (
                      <Cell key={t.name} fill={t.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {types.map((t) => (
                <li key={t.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: t.color }} />
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{t.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated p-5 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Average response time</h2>
                <p className="text-xs text-muted-foreground">Minutes from report to first responder dispatch</p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">Today</span>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" fontSize={12} unit="m" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="min" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent table */}
        <div className="card-elevated">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent incidents</h2>
            <span className="text-xs text-muted-foreground">5 most recent</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">ID</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Area</th>
                  <th className="px-5 py-3 text-left font-medium">Severity</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Reported</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="px-5 py-3 font-medium">{r.type}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.area}</td>
                    <td className="px-5 py-3">{r.severity}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const tooltipStyle = {
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function KpiCard({
  label,
  value,
  delta,
  trend,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "ok" | "alert";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const goodUp = tone === "ok" ? trend === "up" : trend === "down";
  return (
    <div className="card-elevated card-elevated-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${goodUp ? "text-emerald-700" : "text-destructive"}`}>
        {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {delta} <span className="font-normal text-muted-foreground">vs last week</span>
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-destructive/10 text-destructive",
    Responding: "bg-amber-100 text-amber-800",
    Resolved: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${map[status] ?? "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
}
