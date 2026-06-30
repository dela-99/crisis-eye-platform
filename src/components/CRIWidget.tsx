import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  X, 
  AlertTriangle, 
  CloudRain, 
  Flame, 
  Wind, 
  Zap, 
  Info,
  CheckCircle2,
  Navigation
} from "lucide-react";

type LocationData = {
  region: string;
  district: string;
  community: string;
};

// --- MOCK DATA ---
const MOCK_ADVISORIES = [
  {
    id: 1,
    title: "Heavy Rain Warning",
    icon: CloudRain,
    community: "East Legon",
    riskLevel: "High",
    color: "bg-orange-500",
    time: "Next 4 Hours",
    description: "Intense rainfall expected. Localized flooding possible in low-lying areas.",
    actions: ["Avoid low-lying areas.", "Move valuables to higher ground.", "Do not drive through flooded roads."]
  },
  {
    id: 2,
    title: "Fire Risk Advisory",
    icon: Flame,
    community: "Madina",
    riskLevel: "Moderate",
    color: "bg-yellow-500",
    time: "Today",
    description: "Dry conditions and high winds increase the risk of rapid fire spread.",
    actions: ["Avoid open flames.", "Do not burn debris.", "Keep emergency exits clear."]
  }
];

const MOCK_NEARBY = [
  { community: "Adenta", distance: "3.2 km", severity: "Moderate", risk: "Heavy Rain Expected" },
  { community: "Airport Residential", distance: "4.5 km", severity: "High", risk: "Flood Watch" },
];

export function CRIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  // Check local storage for existing permission on mount
  useEffect(() => {
    const savedLoc = localStorage.getItem("cri_location");
    if (savedLoc) {
      setLocation(JSON.parse(savedLoc));
      setHasPermission(true);
    }
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const requestLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      // Simulate geolocation delay and mock reverse geocoding
      setTimeout(() => {
        const mockLoc = {
          region: "Greater Accra",
          district: "Ayawaso West",
          community: "East Legon"
        };
        setLocation(mockLoc);
        localStorage.setItem("cri_location", JSON.stringify(mockLoc));
        setHasPermission(true);
        setLoadingLoc(false);
      }, 1500);
    } else {
      setLoadingLoc(false);
      setManualEntry(true);
    }
  };

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mockLoc = {
      region: formData.get("region") as string,
      district: formData.get("district") as string,
      community: formData.get("community") as string,
    };
    setLocation(mockLoc);
    localStorage.setItem("cri_location", JSON.stringify(mockLoc));
    setHasPermission(true);
    setManualEntry(false);
  };

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed top-20 right-4 sm:top-24 sm:right-6 z-[90]">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/95 p-3 sm:px-5 sm:py-3 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] backdrop-blur-md transition-all hover:scale-105 hover:bg-emerald-600 hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)]"
          aria-label="Community Risk Intelligence"
        >
          <div className="relative flex items-center justify-center">
            {/* Subtle pulse */}
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
            <ShieldAlert className="relative h-6 w-6 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="hidden sm:inline-block text-base font-bold tracking-wide">CRI</span>
        </button>
      </div>

      {/* CRI Panel / Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-end sm:justify-center bg-background/40 backdrop-blur-sm sm:p-4 transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative h-full w-full sm:h-auto sm:max-h-[85vh] sm:w-[480px] overflow-y-auto sm:rounded-2xl border border-border/50 bg-card/95 text-card-foreground shadow-2xl animate-in slide-in-from-right sm:zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight">Community Risk Intel</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {!hasPermission ? (
                /* Location Permission Flow */
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-500">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-10 w-10 text-primary" />
                  </div>
                  
                  {!manualEntry ? (
                    <>
                      <h3 className="text-xl font-bold mb-2">Location Access</h3>
                      <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">
                        Allow CrisisEye to access your location to provide personalized community risk alerts and advisories?
                      </p>
                      
                      <div className="w-full space-y-3">
                        <button 
                          onClick={requestLocation}
                          disabled={loadingLoc}
                          className="btn-lift flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
                        >
                          {loadingLoc ? "Detecting..." : "Allow Location"}
                        </button>
                        <button 
                          onClick={() => setManualEntry(true)}
                          className="flex w-full items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary"
                        >
                          Enter Location Manually
                        </button>
                        <button 
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-semibold text-muted-foreground hover:text-foreground pt-2"
                        >
                          Not Now
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Manual Entry Form */
                    <form onSubmit={handleManualSubmit} className="w-full text-left space-y-4 animate-in slide-in-from-right-4">
                      <h3 className="text-lg font-bold mb-4 text-center">Set Your Community</h3>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Region</label>
                        <input required name="region" type="text" placeholder="e.g. Greater Accra" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">District</label>
                        <input required name="district" type="text" placeholder="e.g. Ayawaso West" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Community</label>
                        <input required name="community" type="text" placeholder="e.g. East Legon" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button type="button" onClick={() => setManualEntry(false)} className="flex-1 rounded-md border border-input py-2 text-sm font-semibold hover:bg-secondary">Back</button>
                        <button type="submit" className="flex-1 rounded-md bg-primary py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">Save</button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* CRI Dashboard */
                <div className="space-y-6 animate-in fade-in duration-500 pb-8 sm:pb-0">
                  
                  {/* Context & Risk Level */}
                  <div className="flex items-start justify-between rounded-xl bg-secondary/50 p-4 border border-border/50">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">My Community</p>
                      <h3 className="font-bold text-lg leading-tight">{location?.community}</h3>
                      <p className="text-sm text-muted-foreground">{location?.district}, {location?.region}</p>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Today's Risk</p>
                      <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-bold">High</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Advisories */}
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Active Advisories
                    </h3>
                    <div className="space-y-3">
                      {MOCK_ADVISORIES.map((adv) => (
                        <div key={adv.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${adv.color} text-white`}>
                              <adv.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-foreground leading-tight">{adv.title}</h4>
                                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                                  {adv.time}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-destructive mt-0.5">{adv.riskLevel} Risk • {adv.community}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 pl-11">
                            {adv.description}
                          </p>

                          <div className="pl-11 space-y-1.5">
                            <p className="text-xs font-semibold text-foreground">Recommended Actions:</p>
                            <ul className="space-y-1">
                              {adv.actions.map((act, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Risk Zones */}
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-primary" /> Nearby Elevated Risks
                    </h3>
                    <div className="rounded-xl border border-border overflow-hidden">
                      {MOCK_NEARBY.map((zone, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 ${i !== MOCK_NEARBY.length - 1 ? 'border-b border-border/50' : ''}`}>
                          <div>
                            <p className="text-sm font-bold text-foreground">{zone.community}</p>
                            <p className="text-xs text-muted-foreground">{zone.distance} away</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-destructive">{zone.severity}</p>
                            <p className="text-xs text-muted-foreground">{zone.risk}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
