import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { DeleteStudentDialog } from "@/components/DeleteStudentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteStudent, studentsQueryOptions, type Student } from "@/lib/students";

export const Route = createFileRoute("/students/")({
  head: () => ({
    meta: [
      { title: "View Students | Student Management System" },
      {
        name: "description",
        content: "Search, edit and delete all student records stored in the database.",
      },
      { property: "og:title", content: "View Students | Student Management System" },
      {
        property: "og:description",
        content: "Search, edit and delete all student records stored in the database.",
      },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: students = [], isLoading, isError, error } = useQuery(studentsQueryOptions);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.student_id, s.name, s.department, s.year, s.email, s.phone].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [students, search]);

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: async () => {
      toast.success("Student deleted successfully");
      setTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err: Error) => toast.error(err.message || "Could not delete student"),
  });

  return (
    <AppLayout
      title="View Students"
      subtitle="All student records from the database."
      action={
        <Button asChild variant="teal">
          <Link to="/students/new">
            <Plus className="size-4" /> Add Student
          </Link>
        </Button>
      }
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, ID, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {filtered.length} of {students.length} students
          </span>
        </div>

        {isError ? (
          <p className="p-5 text-sm text-destructive">
            Could not load students: {(error as Error).message}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Department</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 text-right font-medium">Attendance</th>
                <th className="px-5 py-3 text-right font-medium">Marks</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
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
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {s.department}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.year}</td>
                  <td
                    className={`px-5 py-3 text-right font-medium ${
                      s.attendance >= 75 ? "text-teal" : "text-destructive"
                    }`}
                  >
                    {s.attendance}%
                  </td>
                  <td className="px-5 py-3 text-right font-medium">{s.marks}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <Link
                      to="/students/$id"
                      params={{ id: s.id }}
                      className="text-xs font-medium text-muted-foreground hover:underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="ml-3 cursor-pointer text-xs font-medium text-brand hover:underline"
                      onClick={() =>
                        navigate({ to: "/students/$id/edit", params: { id: s.id } })
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ml-3 cursor-pointer text-xs font-medium text-destructive hover:underline"
                      onClick={() => setTarget(s)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Loading students…
                  </td>
                </tr>
              ) : null}
              {!isLoading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No students match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteStudentDialog
        studentName={target?.name ?? ""}
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        deleting={removeMutation.isPending}
        onConfirm={() => target && removeMutation.mutate(target.id)}
      />
    </AppLayout>
  );
}
