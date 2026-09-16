import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEPARTMENTS,
  YEARS,
  validateStudent,
  type Student,
  type StudentErrors,
  type StudentInput,
} from "@/lib/students";

type FormValues = {
  student_id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  attendance: string;
  marks: string;
};

export function StudentForm({
  student,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  student?: Student;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (input: StudentInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>({
    student_id: student?.student_id ?? "",
    name: student?.name ?? "",
    department: student?.department ?? DEPARTMENTS[0]!,
    year: student?.year ?? YEARS[0]!,
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    attendance: student ? String(student.attendance) : "",
    marks: student ? String(student.marks) : "",
  });
  const [errors, setErrors] = useState<StudentErrors>({});

  const set = (key: keyof FormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateStudent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      student_id: values.student_id.trim(),
      name: values.name.trim(),
      department: values.department,
      year: values.year,
      email: values.email.trim(),
      phone: values.phone.trim(),
      attendance: Number(values.attendance),
      marks: Number(values.marks),
    });
  }

  const fieldError = (key: keyof StudentErrors) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="student_id">Student ID</Label>
          <Input
            id="student_id"
            className="mt-1.5"
            placeholder="STU-006"
            value={values.student_id}
            onChange={(e) => set("student_id")(e.target.value)}
          />
          {fieldError("student_id")}
        </div>
        <div>
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            className="mt-1.5"
            placeholder="e.g. Kavya Menon"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
          />
          {fieldError("name")}
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.department}
            onChange={(e) => set("department")(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {fieldError("department")}
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <select
            id="year"
            className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.year}
            onChange={(e) => set("year")(e.target.value)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {fieldError("year")}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            className="mt-1.5"
            placeholder="name@college.edu"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
          />
          {fieldError("email")}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            className="mt-1.5"
            placeholder="9876543210"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
          />
          {fieldError("phone")}
        </div>
        <div>
          <Label htmlFor="attendance">Attendance Percentage</Label>
          <Input
            id="attendance"
            type="number"
            min={0}
            max={100}
            step="0.01"
            className="mt-1.5"
            placeholder="0 - 100"
            value={values.attendance}
            onChange={(e) => set("attendance")(e.target.value)}
          />
          {fieldError("attendance")}
        </div>
        <div>
          <Label htmlFor="marks">Marks</Label>
          <Input
            id="marks"
            type="number"
            min={0}
            max={100}
            step="0.01"
            className="mt-1.5"
            placeholder="0 - 100"
            value={values.marks}
            onChange={(e) => set("marks")(e.target.value)}
          />
          {fieldError("marks")}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="teal" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
