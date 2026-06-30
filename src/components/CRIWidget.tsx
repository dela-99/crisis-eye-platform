import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  X, 
  CloudRain, 
  Flame, 
  Wind, 
  Navigation,
  Cloud,
  Thermometer,
  Droplets,
  AlertCircle,
  CheckCircle
} from "lucide-react";

type LocationData = {
  region: string;
  district: string;
  community: string;
};

type WeatherData = {
  temp: number;
  humidity: number;
  wind: number;
  precip: number;
  condition: string;
};

// Map WMO codes to human readable strings
const mapWeatherCode = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Overcast / Fog";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
};

// --- MOCK DATA FOR PRESENTATION ---
const MOCK_ADVISORIES = [
  {
    id: 1,
    title: "Heavy Rain Expected",
    status: "Monitor Conditions",
    color: "bg-yellow-500",
    recommendations: ["Carry an umbrella.", "Watch weather updates."]
  },
  {
    id: 2,
    title: "No Active Fire Advisory",
    status: "Safe",
    color: "bg-emerald-500",
    recommendations: []
  },
  {
    id: 3,
    title: "No Active Flood Advisory",
    status: "Safe",
    color: "bg-emerald-500",
    recommendations: []
  }
];

const MOCK_NEARBY = [
  { community: "Polytechnic Area", status: "Safe", color: "text-emerald-500" },
  { community: "KTU Campus", status: "Safe", color: "text-emerald-500" },
  { community: "Effiduase", status: "Monitor Conditions", color: "text-yellow-500" },
  { community: "Low-Lying Streams", status: "Potential Water Accumulation During Heavy Rain", color: "text-orange-500" },
];

export function CRIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  // Check local storage for existing permission on mount
  useEffect(() => {
    const savedLoc = localStorage.getItem("cri_location_koforidua");
    if (savedLoc) {
      setLocation(JSON.parse(savedLoc));
      setHasPermission(true);
    }
  }, []);

  // Fetch Live Weather whenever Location is set
  useEffect(() => {
    if (location) {
      // Coordinates for Koforidua roughly: 6.0945, -0.2609
      fetch("https://api.open-meteo.com/v1/forecast?latitude=6.0945&longitude=-0.2609&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code")
        .then(res => res.json())
        .then(data => {
          if (data && data.current) {
            setWeather({
              temp: data.current.temperature_2m,
              humidity: data.current.relative_humidity_2m,
              wind: data.current.wind_speed_10m,
              precip: data.current.precipitation,
              condition: mapWeatherCode(data.current.weather_code)
            });
          }
        })
        .catch(err => console.error("Weather fetch failed:", err));
    }
  }, [location]);

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
      // Simulate geolocation delay and mock reverse geocoding to Koforidua
      setTimeout(() => {
        const mockLoc = {
          region: "Eastern Region",
          district: "New Juaben Municipal",
          community: "Koforidua"
        };
        setLocation(mockLoc);
        localStorage.setItem("cri_location_koforidua", JSON.stringify(mockLoc));
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
    localStorage.setItem("cri_location_koforidua", JSON.stringify(mockLoc));
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
          <div className="relative h-full w-full sm:h-auto sm:max-h-[85vh] sm:w-[500px] overflow-y-auto sm:rounded-2xl border border-border/50 bg-card/95 text-card-foreground shadow-2xl animate-in slide-in-from-right sm:zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-emerald-500" />
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
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                    <MapPin className="h-10 w-10 text-emerald-500" />
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
                          className="btn-lift flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-70"
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
                        <input required name="region" type="text" placeholder="e.g. Eastern Region" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">District/Municipality</label>
                        <input required name="district" type="text" placeholder="e.g. New Juaben Municipal" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Community</label>
                        <input required name="community" type="text" placeholder="e.g. Koforidua" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button type="button" onClick={() => setManualEntry(false)} className="flex-1 rounded-md border border-input py-2 text-sm font-semibold hover:bg-secondary">Back</button>
                        <button type="submit" className="flex-1 rounded-md bg-emerald-500 py-2 text-sm font-bold text-white hover:bg-emerald-600">Save</button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* CRI Dashboard */
                <div className="space-y-6 animate-in fade-in duration-500 pb-8 sm:pb-0">
                  
                  {/* Context */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">My Community</p>
                      <h3 className="font-bold text-xl leading-tight text-foreground">{location?.community}</h3>
                      <p className="text-sm text-muted-foreground">{location?.district}, {location?.region}</p>
                    </div>
                  </div>

                  {/* Live Weather Widget */}
                  <div className="rounded-xl border border-border bg-secondary/30 p-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                      <Cloud className="h-32 w-32" />
                    </div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Live Weather</p>
                    {weather ? (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Temperature</p>
                            <p className="text-sm font-bold">{weather.temp}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Condition</p>
                            <p className="text-sm font-bold">{weather.condition}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Humidity</p>
                            <p className="text-sm font-bold">{weather.humidity}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Wind</p>
                            <p className="text-sm font-bold">{weather.wind} km/h</p>
                          </div>
                        </div>
                        {weather.precip > 0 && (
                          <div className="col-span-2 mt-1">
                            <p className="text-xs font-semibold text-blue-500 bg-blue-500/10 py-1 px-2 rounded inline-block">
                              Chance of rain: {weather.precip}mm expected
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground animate-pulse">Fetching live weather...</span>
                      </div>
                    )}
                  </div>

                  {/* Overall Risks Breakdown */}
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-emerald-500" /> Risk Breakdown
                    </h3>
                    <div className="space-y-2">
                      {/* Overall */}
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                        <span className="text-sm font-bold text-foreground">Today's Overall Risk</span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">LOW</span>
                        </div>
                      </div>
                      
                      {/* Flood */}
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-muted-foreground"/> Flood Risk</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">LOW</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Reason:</span> Koforidua is generally elevated and currently has no active flood advisory.</p>
                      </div>

                      {/* Fire */}
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-muted-foreground"/> Fire Risk</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">LOW</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Reason:</span> No active fire advisories reported.</p>
                      </div>

                      {/* Storm */}
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold flex items-center gap-1.5"><CloudRain className="h-3.5 w-3.5 text-muted-foreground"/> Storm Risk</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">MODERATE</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Reason:</span> Possibility of scattered rainfall later today.</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Advisories */}
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-emerald-500" /> Active Advisories
                    </h3>
                    <div className="space-y-3">
                      {MOCK_ADVISORIES.map((adv) => (
                        <div key={adv.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-foreground leading-tight">{adv.title}</h4>
                            <span className="text-xs font-bold">Status: {adv.status}</span>
                          </div>
                          
                          {adv.recommendations.length > 0 && (
                            <div className="space-y-1.5 mt-2 bg-secondary/50 p-2.5 rounded-md border border-border/50">
                              <p className="text-xs font-semibold text-foreground">Recommendation:</p>
                              <ul className="space-y-1">
                                {adv.recommendations.map((act, i) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{act}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Risk Zones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-emerald-500" /> Nearby Community Risk Overview
                      </h3>
                    </div>
                    <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Demonstration Assessments</p>
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      {MOCK_NEARBY.map((zone, i) => (
                        <div key={i} className={`flex items-start justify-between p-3 gap-2 ${i !== MOCK_NEARBY.length - 1 ? 'border-b border-border/50' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${zone.status === 'Safe' ? 'bg-emerald-500' : zone.status === 'Monitor Conditions' ? 'bg-yellow-500' : 'bg-orange-500'}`}></span>
                            <p className="text-sm font-bold text-foreground">{zone.community}</p>
                          </div>
                          <p className={`text-xs font-semibold text-right ${zone.color}`}>{zone.status}</p>
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
