import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Flame, Droplets, Car, HeartPulse, Maximize, Minimize } from "lucide-react";

export const Route = createFileRoute("/map")({
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
  { id: "CE-48211", type: "Fire", severity: "high", title: "Warehouse fire", area: "Tema Industrial Area", lat: 5.6698, lng: -0.0166, time: "12 min ago" },
  { id: "CE-48198", type: "Flood", severity: "moderate", title: "Street flooding", area: "Circle, Accra", lat: 5.5715, lng: -0.2074, time: "34 min ago" },
  { id: "CE-48184", type: "Road Accident", severity: "moderate", title: "Multi-vehicle collision", area: "N1 Highway, Achimota", lat: 5.6244, lng: -0.2298, time: "1 hr ago" },
  { id: "CE-48173", type: "Medical Emergency", severity: "high", title: "Casualties at stadium", area: "Baba Yara Stadium, Kumasi", lat: 6.6796, lng: -1.6244, time: "1 hr ago" },
  { id: "CE-48160", type: "Fire", severity: "low", title: "Bush fire (contained)", area: "Tamale outskirts", lat: 9.4008, lng: -0.8393, time: "2 hr ago" },
  { id: "CE-48152", type: "Flood", severity: "critical", title: "Coastal flooding", area: "Keta, Volta Region", lat: 5.9173, lng: 0.9885, time: "3 hr ago" },
  { id: "CE-48140", type: "Road Accident", severity: "high", title: "Tanker overturned", area: "Cape Coast – Takoradi Rd", lat: 5.0855, lng: -1.4499, time: "4 hr ago" },
  { id: "CE-48131", type: "Medical Emergency", severity: "moderate", title: "Cholera cluster reported", area: "Sekondi-Takoradi", lat: 4.9344, lng: -1.7133, time: "5 hr ago" },
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [filter, setFilter] = useState<IncidentType | "All">("All");
  const [selected, setSelected] = useState<Incident | null>(null);
  const [ready, setReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapRef.current?.invalidateSize(), 100);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Initialize the map once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      const map = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView(
        [7.9465, -1.0232], // Ghana
        7,
      );
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      // Ensure tiles render once layout settles
      setTimeout(() => map.invalidateSize(), 50);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Render / refresh markers when filter changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      markersRef.current.forEach((m) => mapRef.current.removeLayer(m));
      markersRef.current = [];
      const data = filter === "All" ? sample : sample.filter((i) => i.type === filter);
      data.forEach((i) => {
        const color = typeColor[i.type];
        
        // Add localized incident footprint overlay (small city block area)
        const offsetMap: Record<Severity, number> = {
          low: 0.001,       // Very small local footprint
          moderate: 0.0015,
          high: 0.0025,
          critical: 0.004,  // Max ~400m block
        };
        const offset = offsetMap[i.severity];
        const bounds: [[number, number], [number, number]] = [
          [i.lat - offset, i.lng - offset],
          [i.lat + offset, i.lng + offset]
        ];
        
        const zone = L.rectangle(bounds, {
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 2,
          opacity: 0.9,
        }).addTo(mapRef.current);
        markersRef.current.push(zone);

        const icon = L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};color:#fff;border:3px solid #0B1120;box-shadow:0 0 0 2px ${color}55, 0 2px 6px rgba(0,0,0,.5);font-size:11px;font-weight:700;">${i.type[0]}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const m = L.marker([i.lat, i.lng], { icon })
          .addTo(mapRef.current)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;min-width:180px"><div style="font-weight:700;font-size:13px;margin-bottom:2px">${i.title}</div><div style="font-size:12px;color:#475569">${i.type} · ${i.area}</div><div style="font-size:11px;color:#64748b;margin-top:6px">${i.id} · ${i.time}</div></div>`,
          )
          .on("click", () => setSelected(i));
        markersRef.current.push(m);
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, ready]);

  const visible = filter === "All" ? sample : sample.filter((i) => i.type === filter);

  return (
    <PageShell>
      <section className="bg-gradient-to-b from-secondary/70 to-background">
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
                className={`btn-lift inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium ${
                  active
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border bg-card text-foreground hover:bg-secondary"
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
            <div ref={wrapperRef} className={`relative w-full bg-[#0B1120] ${isFullscreen ? "h-screen" : "h-[520px]"}`}>
              <div ref={mapEl} className="h-full w-full" />
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-[1000] flex h-8 w-8 items-center justify-center rounded bg-background/90 text-foreground shadow-md hover:bg-secondary/90 border border-border/50 transition-colors opacity-80 hover:opacity-100"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
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
                      className={`w-full rounded-lg border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                        active ? "border-primary/60" : "border-border hover:border-primary/40"
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
    low: "bg-white/5 text-slate-300",
    moderate: "bg-amber-500/15 text-amber-300",
    high: "bg-orange-500/15 text-orange-300",
    critical: "bg-destructive/20 text-red-300",
  };
  return (
    <span className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${map[severity]}`}>
      {severity}
    </span>
  );
}
