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
  Clock,
  MapPin,
  Phone,
  Shield,
  Ambulance,
  Siren,
} from "lucide-react";
import heroImage from "@/assets/hero-earth.jpg";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
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

const ghanaContacts = [
  {
    name: "National Emergency (112)",
    phone: "112",
    description: "Unified toll-free line for police, ambulance, and fire — works from any phone, even without credit.",
    icon: Siren,
    color: "#EF4444",
  },
  {
    name: "Ghana Police Service",
    phone: "191",
    description: "Crime in progress, public safety threats, and civil incidents requiring police response.",
    icon: Shield,
    color: "#3B82F6",
  },
  {
    name: "National Ambulance Service",
    phone: "193",
    description: "Medical emergencies, casualties, and patient transport across all 16 regions.",
    icon: Ambulance,
    color: "#10B981",
  },
  {
    name: "Ghana National Fire Service",
    phone: "192",
    description: "Structural and vehicle fires, rescues, and hazardous material incidents.",
    icon: Flame,
    color: "#F59E0B",
  },
  {
    name: "NADMO",
    phone: "0299 311 035",
    description: "National Disaster Management Organisation — floods, storms, and large-scale community emergencies.",
    icon: ShieldAlert,
    color: "#8B5CF6",
  },
  {
    name: "Domestic Violence Unit",
    phone: "0800 111 222",
    description: "DOVVSU support line for domestic violence and victim assistance, 24 hours.",
    icon: HeartPulse,
    color: "#EC4899",
  },
  {
    name: "Electricity Emergencies",
    phone: "0302 611 611",
    description: "ECG fault line for downed power lines, exposed cables, and major outages.",
    icon: Wind,
    color: "#F97316",
  },
  {
    name: "Motor Traffic & Transport",
    phone: "0302 684 714",
    description: "MTTD hotline for road accidents, traffic obstructions, and highway incidents.",
    icon: Car,
    color: "#06B6D4",
  },
];

function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[1.30]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_30%_40%,rgba(11,17,32,0.35),rgba(11,17,32,0.72)_70%,#0B1120)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              Live emergency monitoring
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Emergency reporting<br className="hidden sm:block" /> made faster and smarter.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              CrisisEye helps communities, governments, and first responders report, monitor, and
              track emergencies in real time — so the right help arrives sooner.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/report"
                className="btn-lift inline-flex h-12 items-center justify-center gap-2 rounded-full bg-destructive px-6 text-sm font-semibold text-destructive-foreground"
              >
                Report an incident <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/map"
                className="btn-lift inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                View live map
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              In a life-threatening emergency, always call your local emergency number first.
            </p>
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
                className="card-elevated card-elevated-hover flex gap-4 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
              <li key={s.title} className="card-elevated card-elevated-hover p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ghana Emergency Contacts */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-red-300">
                <Siren className="h-3.5 w-3.5" /> Need immediate help?
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                Ghana emergency response contacts
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Save these numbers. In a life-threatening emergency, call first — then file a CrisisEye report so responders have full situational awareness.
              </p>
            </div>
            <Link
              to="/report"
              className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-destructive px-5 text-sm font-semibold text-destructive-foreground"
            >
              File a report
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ghanaContacts.map((c) => (
              <li key={c.name} className="card-elevated card-elevated-hover p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: `${c.color}1f`, color: c.color }}
                  >
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="mt-4 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {c.phone}
                </a>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{c.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            112 is Ghana's unified national emergency line and routes to police, ambulance, and fire services.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
