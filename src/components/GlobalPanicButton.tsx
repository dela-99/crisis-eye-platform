import { useState, useRef, useEffect } from "react";
import { MapPin, CheckCircle2, ShieldAlert, Navigation, X, Siren } from "lucide-react";

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

  // Handle Esc key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panicState === "active") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panicState]);

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
    }, 1500); // 1.5s locked transmission
  };

  const updateTimelineState = (index: number, status: StatusStep["status"]) => {
    setTimeline(prev => {
      const next = [...prev];
      if (next[index]) next[index].status = status;
      return next;
    });
  };

  const closeModal = () => {
    // Only allow closing if active (not locked in 'activating' state)
    if (panicState === "active") {
      setPanicState("idle");
      setHoldProgress(0);
      setTimeline(timeline.map(t => ({ ...t, status: "pending" })));
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
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
          className={`group relative flex items-center gap-3 rounded-full bg-destructive text-destructive-foreground shadow-xl transition-all ${
            panicState === "holding" ? "scale-105" : "hover:scale-105"
          } ${panicState === "active" || panicState === "activating" ? "hidden" : "flex"} p-3 sm:pr-6 sm:pl-3`}
          style={{ touchAction: 'none' }}
          aria-label="Quick Panic"
        >
          {/* Circular SOS Icon */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-destructive shadow-sm">
             {/* Progress Ring */}
             {panicState === "holding" && (
              <svg className="absolute inset-0 h-full w-full -rotate-90 scale-[1.15]">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="rgba(220, 38, 38, 0.2)"
                  strokeWidth="3"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * holdProgress) / 100}
                  className="transition-all duration-75 text-white"
                />
              </svg>
            )}
            <span className="text-xl font-black tracking-tighter">SOS</span>
          </div>

          {/* Label for Desktop */}
          <div className="hidden sm:flex flex-col items-start pr-2">
            <span className="text-sm font-bold uppercase leading-none">🚨 SOS</span>
            <span className="text-xs font-medium text-destructive-foreground/80">Emergency</span>
          </div>
        </button>
      </div>

      {/* Activating/Active Modal */}
      {(panicState === "activating" || panicState === "active") && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/60 p-4 backdrop-blur-sm transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-destructive/20 bg-card/95 text-card-foreground shadow-2xl animate-in zoom-in-95 fade-in duration-300 backdrop-blur-xl">
            
            {panicState === "active" && (
              <button 
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/10 p-2 text-foreground/60 transition-colors hover:bg-black/20 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="bg-destructive/10 p-6 text-center border-b border-border/50 relative overflow-hidden">
              {panicState === "activating" ? (
                <>
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    <Siren className="h-8 w-8 animate-pulse" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground animate-pulse">Transmitting...</h2>
                </>
              ) : (
                <>
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-in zoom-in duration-300">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground animate-in slide-in-from-bottom-2 duration-300">Emergency Alert Sent</h2>
                  <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-destructive animate-in slide-in-from-bottom-2 duration-500">
                    <MapPin className="h-4 w-4" /> {location}
                  </p>
                </>
              )}
            </div>

            <div className="p-6 relative">
              {/* Status Tracker */}
              <div className={`mb-8 transition-opacity duration-300 ${panicState === "activating" ? "opacity-30 blur-sm pointer-events-none" : "opacity-100"}`}>
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
              <div className={`rounded-xl border border-border bg-secondary/50 p-4 transition-opacity duration-500 ${panicState === "activating" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
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
                  <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 shadow-sm">
                    <Navigation className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {panicState === "active" && (
              <div className="border-t border-border bg-muted/30 p-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
