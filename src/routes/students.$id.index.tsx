import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { DeleteStudentDialog } from "@/components/DeleteStudentDialog";
import { Button } from "@/components/ui/button";
import { deleteStudent, studentQueryOptions } from "@/lib/students";

export const Route = createFileRoute("/students/$id/")({
  head: () => ({
    meta: [
      { title: "Student Details | Student Management System" },
      {
        name: "description",
        content: "Full record for a student including contact details, attendance and marks.",
      },
      { property: "og:title", content: "Student Details | Student Management System" },
      {
        property: "og:description",
        content: "Full record for a student including contact details, attendance and marks.",
      },
    ],
  }),
  component: StudentDetailsPage,
});

function StudentDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: student, isLoading, isError, error } = useQuery(studentQueryOptions(id));
  const [confirming, setConfirming] = useState(false);

  const removeMutation = useMutation({
    mutationFn: () => deleteStudent(id),
    onSuccess: async () => {
      toast.success("Student deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate({ to: "/students" });
    },
    onError: (err: Error) => toast.error(err.message || "Could not delete student"),
  });

  return (
    <AppLayout
      title="Student Details"
      subtitle={student ? student.student_id : "Loading record…"}
      action={
        <Button asChild variant="outline">
          <Link to="/students">
            <ArrowLeft className="size-4" /> Back to list
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading student…
        </p>
      ) : null}

      {isError ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {(error as Error).message}
        </p>
      ) : null}

      {student ? (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">
                {student.department} · {student.year}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="brand" size="sm">
                <Link to="/students/$id/edit" params={{ id: student.id }}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirming(true)}
                disabled={removeMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            <Field label="Student ID" value={student.student_id} mono />
            <Field label="Student Name" value={student.name} />
            <Field label="Department" value={student.department} />
            <Field label="Year" value={student.year} />
            <Field label="Email" value={student.email} />
            <Field label="Phone Number" value={student.phone} />
            <Field label="Attendance Percentage" value={`${student.attendance}%`} />
            <Field label="Marks" value={`${student.marks} / 100`} />
          </dl>
        </div>
      ) : null}

      <DeleteStudentDialog
        studentName={student?.name ?? ""}
        open={confirming}
        onOpenChange={setConfirming}
        deleting={removeMutation.isPending}
        onConfirm={() => removeMutation.mutate()}
      />
    </AppLayout>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-card p-5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
