import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import eyeLogo from "@/assets/eye-logo.jpeg";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Incident" },
  { to: "/map", label: "Live Map" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/login", label: "Login" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-6">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-3 pl-4 transition-all duration-300 sm:px-4 sm:pl-5 ${
          scrolled
            ? "border-border/70 bg-background/80 shadow-[var(--shadow-floating)] backdrop-blur-md"
            : "border-border/50 bg-background/60 backdrop-blur-sm"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <img 
              src={eyeLogo} 
              alt="CrisisEye Icon" 
              className="h-full w-full object-cover object-center scale-[1.35]" 
            />
          </div>
          <span className="text-[17px] font-bold tracking-tight">CrisisEye</span>
        </Link>
        <nav className="hidden items-center gap-1.5 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-[16px] font-semibold text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-[16px] font-semibold bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/report"
            className="btn-lift inline-flex h-10 items-center justify-center rounded-full bg-destructive px-5 text-[16px] font-semibold text-destructive-foreground"
          >
            Report Emergency
          </Link>
        </div>
        <button
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl origin-top animate-slide-down rounded-2xl border border-white/10 bg-background/90 p-2 shadow-[var(--shadow-floating)] backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1 p-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-[17px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/report"
              onClick={() => setOpen(false)}
              className="btn-lift mt-2 inline-flex h-12 items-center justify-center rounded-lg bg-destructive px-4 text-[17px] font-semibold text-destructive-foreground"
            >
              Report Emergency
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
