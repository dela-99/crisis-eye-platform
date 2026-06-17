import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Incident — CrisisEye" },
      {
        name: "description",
        content:
          "Submit an emergency report with type, location, severity, and a short description. Verified reports reach the right responders.",
      },
      { property: "og:title", content: "Report an Incident — CrisisEye" },
      {
        property: "og:description",
        content: "File an emergency report in under a minute and help responders act sooner.",
      },
    ],
  }),
  component: ReportPage,
});

const incidentTypes = [
  "Fire",
  "Flood",
  "Road accident",
  "Medical emergency",
  "Severe weather",
  "Public safety",
  "Other",
] as const;

const severities = [
  { value: "low", label: "Low", description: "Minor impact, no immediate danger." },
  { value: "moderate", label: "Moderate", description: "People affected, response needed soon." },
  { value: "high", label: "High", description: "Serious risk to life, property, or services." },
  { value: "critical", label: "Critical", description: "Active threat to life — escalate now." },
] as const;

function ReportPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [severity, setSeverity] = useState<(typeof severities)[number]["value"]>("moderate");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="rounded-xl border border-border bg-background p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">Report submitted</h1>
            <p className="mt-3 text-muted-foreground">
              Reference <span className="font-mono text-foreground">#CE-{Math.floor(Math.random() * 90000 + 10000)}</span>.
              A verifier will review your report shortly. You can track it on the live map.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/map"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Open live map
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Submit another
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Report</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Report an incident</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Share what you’re seeing. We’ll verify the report and route it to the right responder.
            Only share information you’ve observed yourself.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex gap-3 rounded-md border border-border bg-secondary p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            If lives are at immediate risk, call your local emergency number now. Use this form for
            documentation, awareness, and coordination.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8 rounded-xl border border-border bg-background p-6 sm:p-8">
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-semibold">
              Incident type <span className="text-destructive">*</span>
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue=""
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Select a category
              </option>
              {incidentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold">
                Location <span className="text-destructive">*</span>
              </label>
              <input
                id="location"
                name="location"
                required
                placeholder="Street, neighborhood, or landmark"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">We’ll use this to plot the incident on the map.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-semibold">
                Contact (optional)
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                placeholder="Phone or email for follow-up"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">Only used by responders if they need details.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Describe what you’re seeing — what happened, how many people, any visible hazards."
              className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Severity</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {severities.map((s) => {
                const active = severity === s.value;
                return (
                  <label
                    key={s.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-sm transition-colors ${
                      active ? "border-primary bg-secondary" : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={s.value}
                      checked={active}
                      onChange={() => setSeverity(s.value)}
                      className="mt-0.5 h-4 w-4 accent-[color:var(--color-primary)]"
                    />
                    <span>
                      <span className="block font-semibold text-foreground">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-input accent-[color:var(--color-primary)]"
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground">
              I confirm this report is accurate to the best of my knowledge and may be shared with
              relevant responders.
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit report"}
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
