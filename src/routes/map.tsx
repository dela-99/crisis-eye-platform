import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Flame, Droplets, Car, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Incident Map — CrisisEye" },
      {
        name: "description",
        content:
          "An interactive live map of fires, floods, road accidents, and medical emergencies reported through CrisisEye.",
      },
      { property: "og:title", content: "Live Incident Map — CrisisEye" },
      {
        property: "og:description",
        content: "Track verified emergency incidents on a real interactive map in real time.",
      },
    ],
  }),
  component: MapPage,
});

type IncidentType = "Fire" | "Flood" | "Road Accident" | "Medical Emergency";
type Severity = "low" | "moderate" | "high" | "critical";

interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  title: string;
  area: string;
  lat: number;
  lng: number;
  time: string;
}

const sample: Incident[] = [
  { id: "CE-48211", type: "Fire", severity: "high", title: "Warehouse fire", area: "Industrial District", lat: 40.7411, lng: -74.0048, time: "12 min ago" },
  { id: "CE-48198", type: "Flood", severity: "moderate", title: "Street flooding", area: "Riverside Ave", lat: 40.7282, lng: -73.9942, time: "34 min ago" },
  { id: "CE-48184", type: "Road Accident", severity: "moderate", title: "Multi-vehicle collision", area: "Highway 9, exit 14", lat: 40.7549, lng: -73.984, time: "1 hr ago" },
  { id: "CE-48173", type: "Medical Emergency", severity: "high", title: "Casualties at marathon route", area: "Central Park South", lat: 40.7681, lng: -73.9819, time: "1 hr ago" },
  { id: "CE-48160", type: "Fire", severity: "low", title: "Vegetation fire (contained)", area: "Northpoint Hills", lat: 40.7831, lng: -73.9712, time: "2 hr ago" },
  { id: "CE-48152", type: "Flood", severity: "critical", title: "Subway tunnel flooding", area: "Lower East Side", lat: 40.7156, lng: -73.9842, time: "3 hr ago" },
];

const typeColor: Record<IncidentType, string> = {
  Fire: "#DC2626",
  Flood: "#1E40AF",
  "Road Accident": "#D97706",
  "Medical Emergency": "#059669",
};

const typeIcon = {
  Fire: Flame,
  Flood: Droplets,
  "Road Accident": Car,
  "Medical Emergency": HeartPulse,
} as const;

function MapPage() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [filter, setFilter] = useState<IncidentType | "All">("All");
  const [selected, setSelected] = useState<Incident | null>(null);

  useEffect(() => {
    let cancelled = false;
    let markers: any[] = [];

    async function init() {
      // @ts-expect-error - dynamic ESM import of Leaflet from CDN
      const L = (await import(/* @vite-ignore */ "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js")).default;
      if (cancelled || !mapEl.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView([40.745, -73.99], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapRef.current);
      }
      const data = filter === "All" ? sample : sample.filter((i) => i.type === filter);
      data.forEach((i) => {
        const color = typeColor[i.type];
        const icon = L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${color};color:#fff;border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.25);font-size:11px;font-weight:700;">${i.type[0]}</span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        const m = L.marker([i.lat, i.lng], { icon })
          .addTo(mapRef.current)
          .on("click", () => setSelected(i));
        markers.push(m);
      });
    }

    init();
    return () => {
      cancelled = true;
      markers.forEach((m) => mapRef.current?.removeLayer(m));
    };
  }, [filter]);

  const visible = filter === "All" ? sample : sample.filter((i) => i.type === filter);

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Live map</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Active incidents</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Verified emergency reports across the region. Filter by category and click a marker for details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["All", "Fire", "Flood", "Road Accident", "Medical Emergency"] as const).map((t) => {
            const active = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {t !== "All" && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: typeColor[t] }}
                  />
                )}
                {t}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden card-elevated">
            <div ref={mapEl} className="h-[520px] w-full" />
          </div>

          <aside className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
              <span className="text-sm font-semibold">{visible.length} incidents</span>
              <span className="text-xs text-muted-foreground">Updated just now</span>
            </div>
            <ul className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {visible.map((i) => {
                const Icon = typeIcon[i.type];
                const active = selected?.id === i.id;
                return (
                  <li key={i.id}>
                    <button
                      onClick={() => {
                        setSelected(i);
                        mapRef.current?.setView([i.lat, i.lng], 14, { animate: true });
                      }}
                      className={`w-full rounded-lg border bg-background p-4 text-left transition-colors ${
                        active ? "border-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white"
                          style={{ background: typeColor[i.type] }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-sm font-semibold">{i.title}</h3>
                            <SeverityBadge severity={i.severity} />
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{i.area}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-mono">{i.id}</span> · {i.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, string> = {
    low: "bg-secondary text-muted-foreground",
    moderate: "bg-amber-100 text-amber-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-destructive text-destructive-foreground",
  };
  return (
    <span className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${map[severity]}`}>
      {severity}
    </span>
  );
}
