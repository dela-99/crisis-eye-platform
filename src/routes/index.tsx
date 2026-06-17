import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  Droplets,
  Car,
  HeartPulse,
  Wind,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import heroImage from "@/assets/hero-operations.jpg";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CrisisEye — Emergency Reporting Made Faster and Smarter" },
      {
        name: "description",
        content:
          "CrisisEye helps communities report, monitor, and track emergencies in real time. Trusted tooling for governments, responders, and NGOs.",
      },
      { property: "og:title", content: "CrisisEye — Emergency Reporting Made Faster and Smarter" },
      {
        property: "og:description",
        content:
          "Report, monitor, and respond to emergencies in real time. Built for governments, responders, and communities.",
      },
    ],
  }),
  component: HomePage,
});

const categories = [
  { icon: Flame, label: "Fire", description: "Structural, vegetation, and industrial fires." },
  { icon: Droplets, label: "Flood", description: "Flash floods, river overflow, and urban flooding." },
  { icon: Car, label: "Road accidents", description: "Vehicle collisions and roadside hazards." },
  { icon: HeartPulse, label: "Medical", description: "Casualties needing urgent medical response." },
  { icon: Wind, label: "Severe weather", description: "Storms, cyclones, and extreme conditions." },
  { icon: ShieldAlert, label: "Public safety", description: "Security threats and civil incidents." },
];

const stats = [
  { value: "12,400+", label: "Incidents reported" },
  { value: "98%", label: "Verified within 5 min" },
  { value: "240", label: "Partner agencies" },
  { value: "37", label: "Cities covered" },
];

const steps = [
  {
    title: "Report",
    body: "Any community member or responder can file an incident in under a minute, with location and severity.",
    icon: MapPin,
  },
  {
    title: "Verify",
    body: "Reports are triaged and cross-checked against nearby reports and official channels before broadcast.",
    icon: CheckCircle2,
  },
  {
    title: "Respond",
    body: "Verified incidents are routed to the right agency, with a live map and status updates for the public.",
    icon: Clock,
  },
];

function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              Live emergency monitoring
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Emergency reporting made faster and smarter.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">
              CrisisEye helps communities, governments, and first responders report, monitor, and
              track emergencies in real time — so the right help arrives sooner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/report"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Report an incident <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/map"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View live map
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              In a life-threatening emergency, always call your local emergency number first.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <img
              src={heroImage}
              alt="Emergency response coordinators monitoring incident maps in an operations centre"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The platform</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              A single source of truth during a crisis.
            </h2>
          </div>
          <div className="lg:col-span-2">
            <p className="text-base leading-7 text-muted-foreground">
              CrisisEye brings public reports, agency dispatches, and official advisories together
              in one trusted view. Built with public-sector standards in mind, it gives responders
              clarity and the public a calm, reliable place to turn to.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="border-l-2 border-primary pl-4">
                  <dt className="text-2xl font-semibold tracking-tight text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Emergency categories</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Report and track the situations that matter most to your community.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li
                key={c.label}
                className="flex gap-4 rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              From the first report to the right responder.
            </h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Community impact */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Community impact
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              Built for the people who keep our cities safe.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              CrisisEye is used by municipal emergency offices, volunteer responder networks, and
              NGOs to coordinate during floods, fires, and large public events. Information stays
              accurate because the people closest to the situation can update it directly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Explore the dashboard
              </Link>
              <Link
                to="/report"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Submit a test report
              </Link>
            </div>
          </div>
          <figure className="rounded-xl border border-border bg-background p-8">
            <blockquote className="text-lg leading-8 text-foreground">
              “Within the first month, our flood response time dropped by 31%. The map gave our
              field teams a single picture of what was happening across the district.”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                AK
              </span>
              <span>
                <span className="block font-semibold text-foreground">Aïcha Kemal</span>
                <span className="block text-muted-foreground">District Emergency Coordinator</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
    </PageShell>
  );
}
