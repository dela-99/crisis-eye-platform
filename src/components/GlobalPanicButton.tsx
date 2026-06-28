import { useState, useRef, useEffect } from "react";
import { AlertTriangle, MapPin, CheckCircle2, Clock, ShieldAlert, Navigation, X, Siren } from "lucide-react";

type PanicState = "idle" | "holding" | "activating" | "active";

type StatusStep = {
  label: string;
  status: "pending" | "current" | "complete";
};

export function GlobalPanicButton() {
  const [panicState, setPanicState] = useState<PanicState>("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [location, setLocation] = useState<string>("Detecting location...");
  
  const [timeline, setTimeline] = useState<StatusStep[]>([
    { label: "Report Received", status: "pending" },
    { label: "Dispatcher Reviewing", status: "pending" },
    { label: "Response Team Assigned", status: "pending" },
    { label: "Response Team En Route", status: "pending" },
    { label: "Incident Resolved", status: "pending" },
  ]);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds
  const PROGRESS_INTERVAL = 50;

  const startHold = () => {
    if (panicState === "active") return;
    setPanicState("holding");
    setHoldProgress(0);

    const startTime = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, PROGRESS_INTERVAL);

    holdTimerRef.current = setTimeout(() => {
      activatePanic();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    if (panicState === "active" || panicState === "activating") return;
    setPanicState("idle");
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const activatePanic = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setPanicState("activating");
    setHoldProgress(100);

    // Capture location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        () => {
          setLocation("Location unavailable. Network tracking active.");
        }
      );
    } else {
      setLocation("Location services disabled.");
    }

    // Simulate backend submission & timeline progression
    setTimeout(() => {
      setPanicState("active");
      updateTimelineState(0, "complete");
      updateTimelineState(1, "current");
      
      // Simulate dispatcher reviewing
      setTimeout(() => {
        updateTimelineState(1, "complete");
        updateTimelineState(2, "current");
        
        // Simulate assigning team
        setTimeout(() => {
          updateTimelineState(2, "complete");
          updateTimelineState(3, "current");
        }, 5000);
      }, 4000);
    }, 1500);
  };

  const updateTimelineState = (index: number, status: StatusStep["status"]) => {
    setTimeline(prev => {
      const next = [...prev];
      if (next[index]) next[index].status = status;
      return next;
    });
  };

  const resetPanic = () => {
    setPanicState("idle");
    setHoldProgress(0);
    setTimeline(timeline.map(t => ({ ...t, status: "pending" })));
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-2">
        {panicState === "holding" && (
          <div className="text-xs font-bold text-destructive animate-pulse bg-background/80 px-2 py-1 rounded backdrop-blur border border-destructive/20 shadow-sm">
            HOLD TO ACTIVATE
          </div>
        )}
        
        <button
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-xl transition-transform ${
            panicState === "holding" ? "scale-110" : "hover:scale-105"
          } ${panicState === "active" ? "hidden" : "flex"}`}
          style={{ touchAction: 'none' }}
          aria-label="Quick Panic"
        >
          {/* Progress Ring */}
          {panicState === "holding" && (
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="188.5"
                strokeDashoffset={188.5 - (188.5 * holdProgress) / 100}
                className="transition-all duration-75"
              />
            </svg>
          )}
          <AlertTriangle className="h-7 w-7" />
        </button>
      </div>

      {/* Active Modal */}
      {panicState === "active" && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-destructive/30 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-destructive/10 p-6 text-center border-b border-border/50">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Siren className="h-8 w-8 animate-pulse" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Emergency Alert Sent</h2>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-destructive">
                <MapPin className="h-4 w-4" /> {location}
              </p>
            </div>

            <div className="p-6">
              {/* Status Tracker */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Response Status</h3>
                <div className="space-y-4">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background">
                        {step.status === "complete" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : step.status === "current" ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted" />
                        )}
                        {/* Connecting line */}
                        {idx < timeline.length - 1 && (
                          <div className={`absolute top-8 bottom-[-16px] w-[2px] ${step.status === "complete" ? "bg-emerald-500/50" : "bg-border"}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${step.status === "current" ? "text-foreground" : step.status === "complete" ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearest Help */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Nearest Assistance</h3>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-foreground">Central Police Precinct</p>
                    <p className="text-sm text-muted-foreground mt-0.5">1.2 km away • ~4 min response</p>
                    <a href="tel:191" className="text-sm font-semibold text-primary mt-2 inline-block hover:underline">
                      Call 191
                    </a>
                  </div>
                  <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Navigation className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-muted/30 p-4 text-center">
              <button
                onClick={resetPanic}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Close Status Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
