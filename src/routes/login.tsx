import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Mail, Lock, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    // In a real app, this would redirect to dashboard
  };

  return (
    <PageShell>
      <section className="relative flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
        {/* Background gradient elements to match theme */}
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">
          <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-destructive/5 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 mb-4">
              <ShieldAlert className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to manage emergency protocols and dashboard data.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/60" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="responder@crisiseye.org"
                    className="h-11 w-full rounded-lg border border-input bg-background/50 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/60" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-input bg-background/50 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-[color:var(--color-primary)]"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-lift mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Authenticating..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an agency account?{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Request access
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
