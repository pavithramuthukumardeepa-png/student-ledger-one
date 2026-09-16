import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { StudentForm } from "@/components/StudentForm";
import { createStudent, type StudentInput } from "@/lib/students";

export const Route = createFileRoute("/students/new")({
  head: () => ({
    meta: [
      { title: "Add Student | Student Management System" },
      {
        name: "description",
        content: "Add a new student record with department, year, contact details, attendance and marks.",
      },
      { property: "og:title", content: "Add Student | Student Management System" },
      {
        property: "og:description",
        content: "Add a new student record to the college database.",
      },
    ],
  }),
  component: AddStudentPage,
});

function AddStudentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: StudentInput) => createStudent(input),
    onSuccess: async (student) => {
      toast.success(`${student.name} added successfully`);
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate({ to: "/students" });
    },
    onError: (err: Error) => toast.error(err.message || "Could not add student"),
  });

  return (
    <AppLayout title="Add Student" subtitle="Create a new student record in the database.">
      <StudentForm
        submitting={mutation.isPending}
        submitLabel="Save Student"
        onSubmit={(input) => mutation.mutate(input)}
        onCancel={() => navigate({ to: "/students" })}
      />
    </AppLayout>
  );
}
