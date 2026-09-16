import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, CalendarCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { studentsQueryOptions } from "@/lib/students";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Student Management System" },
      {
        name: "description",
        content:
          "Dashboard overview of total students, average marks and average attendance for the college.",
      },
      { property: "og:title", content: "Dashboard | Student Management System" },
      {
        property: "og:description",
        content: "Total students, average marks and average attendance at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: students = [], isLoading, isError, error } = useQuery(studentsQueryOptions);

  const total = students.length;
  const avgMarks = total ? students.reduce((s, x) => s + x.marks, 0) / total : 0;
  const avgAttendance = total ? students.reduce((s, x) => s + x.attendance, 0) / total : 0;

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of enrolled students and academic performance."
      action={
        <Button asChild variant="outline">
          <Link to="/students">View all students</Link>
        </Button>
      }
    >
      {isError ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load students: {(error as Error).message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Users className="size-4" />}
          label="Total Students"
          value={isLoading ? "—" : String(total)}
          hint="Records in the database"
        />
        <StatCard
          icon={<GraduationCap className="size-4" />}
          label="Average Marks"
          value={isLoading ? "—" : avgMarks.toFixed(1)}
          suffix="/100"
          bar={avgMarks}
          barClass="bg-teal"
        />
        <StatCard
          icon={<CalendarCheck className="size-4" />}
          label="Average Attendance"
          value={isLoading ? "—" : avgAttendance.toFixed(1)}
          suffix="%"
          bar={avgAttendance}
          barClass="bg-brand"
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold">Recent Students</h2>
          <span className="text-xs text-muted-foreground">
            Showing {Math.min(5, total)} of {total}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Department</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 text-right font-medium">Attendance</th>
                <th className="px-5 py-3 text-right font-medium">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-accent/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {s.student_id}
                  </td>
                  <td className="px-5 py-3 font-medium">
                    <Link
                      to="/students/$id"
                      params={{ id: s.id }}
                      className="hover:text-brand hover:underline"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground sm:table-cell">
                    {s.department}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.year}</td>
                  <td className="px-5 py-3 text-right font-medium">{s.attendance}%</td>
                  <td className="px-5 py-3 text-right font-medium">{s.marks}</td>
                </tr>
              ))}
              {!isLoading && total === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No students yet. Add your first student to get started.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
  bar,
  barClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  bar?: number;
  barClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold">
        {value}
        {suffix ? <span className="text-lg text-muted-foreground">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {typeof bar === "number" ? (
        <div className="mt-3 h-1.5 rounded-full bg-accent">
          <div
            className={`h-full rounded-full ${barClass ?? "bg-brand"}`}
            style={{ width: `${Math.min(100, Math.max(0, bar))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
