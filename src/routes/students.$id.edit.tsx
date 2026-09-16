import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { StudentForm } from "@/components/StudentForm";
import { studentQueryOptions, updateStudent, type StudentInput } from "@/lib/students";

export const Route = createFileRoute("/students/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Student | Student Management System" },
      {
        name: "description",
        content: "Update an existing student's details, attendance percentage and marks.",
      },
      { property: "og:title", content: "Edit Student | Student Management System" },
      {
        property: "og:description",
        content: "Update an existing student's details, attendance percentage and marks.",
      },
    ],
  }),
  component: EditStudentPage,
});

function EditStudentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: student, isLoading, isError, error } = useQuery(studentQueryOptions(id));

  const mutation = useMutation({
    mutationFn: (input: StudentInput) => updateStudent(id, input),
    onSuccess: async (updated) => {
      toast.success(`${updated.name} updated successfully`);
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate({ to: "/students/$id", params: { id } });
    },
    onError: (err: Error) => toast.error(err.message || "Could not update student"),
  });

  return (
    <AppLayout
      title="Edit Student"
      subtitle={student ? `Updating ${student.student_id}` : "Loading record…"}
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
        <StudentForm
          student={student}
          submitting={mutation.isPending}
          submitLabel="Update Student"
          onSubmit={(input) => mutation.mutate(input)}
          onCancel={() => navigate({ to: "/students/$id", params: { id } })}
        />
      ) : null}
    </AppLayout>
  );
}
