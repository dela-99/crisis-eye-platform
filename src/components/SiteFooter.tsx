import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">CrisisEye</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              An emergency monitoring and reporting platform built for governments,
              first responders, and community organizations.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Report Incident</li>
              <li>Live Map</li>
              <li>Dashboard</li>
              <li>API access</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Organisation</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Partners</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} CrisisEye. A university project demonstrating modern civic technology.</p>
          <p>In a real emergency, always call your local emergency number first.</p>
        </div>
      </div>
    </footer>
  );
}
