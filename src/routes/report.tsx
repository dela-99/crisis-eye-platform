import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Info, Loader2, MapPin, AlertCircle, Camera } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/report")({
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
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [locStatus, setLocStatus] = useState<{ kind: "idle" | "ok" | "error"; msg: string }>({
    kind: "idle",
    msg: "",
  });

  const detectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocStatus({ kind: "error", msg: "Geolocation isn't supported on this device." });
      return;
    }
    setLocating(true);
    setLocStatus({ kind: "idle", msg: "" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        let label = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=0`,
            { headers: { Accept: "application/json" } },
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name) label = `${data.display_name} (${coords})`;
          }
        } catch {
          // keep coords-only label
        }
        setLocation(label);
        setLocStatus({ kind: "ok", msg: "Location captured — responders will see your exact position." });
        setLocating(false);
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can still enter your location manually."
            : err.code === err.POSITION_UNAVAILABLE
              ? "We couldn't determine your position. Try again or enter it manually."
              : "Location request timed out. Try again or enter it manually.";
        setLocStatus({ kind: "error", msg });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

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
          <div className="card-elevated p-10 text-center">
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
      <section className="bg-gradient-to-b from-secondary/70 to-background">
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

        <form onSubmit={onSubmit} className="space-y-8 card-elevated p-6 sm:p-8">
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
            <div className="space-y-2 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="location" className="text-sm font-semibold">
                  Location <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 disabled:opacity-60"
                >
                  {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                  {locating ? "Detecting…" : "Use my current location"}
                </button>
              </div>
              <input
                id="location"
                name="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street, neighborhood, or landmark"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {locStatus.kind === "ok" && (
                <p className="flex items-start gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {locStatus.msg}
                </p>
              )}
              {locStatus.kind === "error" && (
                <p className="flex items-start gap-2 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {locStatus.msg}
                </p>
              )}
              {locStatus.kind === "idle" && (
                <p className="text-xs text-muted-foreground">
                  Enabling location helps responders reach you faster. You can also type a street, neighborhood, or landmark.
                </p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
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

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Photo Evidence <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div className="flex justify-center rounded-md border border-dashed border-border bg-background px-6 py-8 text-center transition-colors hover:bg-secondary/50 opacity-80">
              <div>
                <Camera className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                  <span className="relative rounded-md font-semibold text-primary">
                    Upload a photo
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-muted-foreground/70">PNG, JPG up to 10MB (coming soon)</p>
              </div>
            </div>
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
