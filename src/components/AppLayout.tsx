import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GraduationCap, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/students/new", label: "Add Student" },
  { to: "/students", label: "View Students" },
] as const;

export function AppLayout({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-semibold">
                Student Management System
              </span>
              <span className="block text-[11px] text-muted-foreground">
                AI &amp; Data Science · B.Tech
              </span>
            </span>
          </Link>
          <Button asChild variant="teal" className="h-9">
            <Link to="/students/new">
              <Plus className="size-4" /> Add Student
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-accent"
                activeProps={{ className: "bg-brand/10 text-brand hover:bg-brand/10" }}
              >
                <span className="size-1.5 rounded-full bg-current opacity-60" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-xl bg-brand p-4 text-brand-foreground">
            <p className="font-display text-sm font-semibold">Database</p>
            <p className="mt-1 text-[11px] opacity-70">PostgreSQL · Lovable Cloud</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium">
              <span className="size-1.5 rounded-full bg-teal" /> Connected
            </span>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {action}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
