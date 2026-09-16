import { supabase } from "@/integrations/supabase/client";

export type Student = {
  id: string;
  student_id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  attendance: number;
  marks: number;
  created_at: string;
  updated_at: string;
};

export type StudentInput = {
  student_id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  attendance: number;
  marks: number;
};

export const DEPARTMENTS = [
  "Artificial Intelligence and Data Science",
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication",
  "Mechanical Engineering",
];

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export const studentsQueryOptions = {
  queryKey: ["students"] as const,
  queryFn: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("student_id", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...row,
      attendance: Number(row.attendance),
      marks: Number(row.marks),
    })) as Student[];
  },
};

export const studentQueryOptions = (id: string) => ({
  queryKey: ["students", id] as const,
  queryFn: async (): Promise<Student> => {
    const { data, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Student not found");
    return {
      ...data,
      attendance: Number(data.attendance),
      marks: Number(data.marks),
    } as Student;
  },
});

async function assertUniqueStudentId(studentId: string, excludeId?: string) {
  let query = supabase.from("students").select("id").eq("student_id", studentId);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw error;
  if (data && data.length > 0) {
    throw new Error(`Student ID "${studentId}" already exists. Please use a unique ID.`);
  }
}

export async function createStudent(input: StudentInput): Promise<Student> {
  await assertUniqueStudentId(input.student_id);
  const { data, error } = await supabase.from("students").insert(input).select().single();
  if (error) {
    if (error.code === "23505") throw new Error("Student ID already exists. Please use a unique ID.");
    throw new Error(error.message);
  }
  return data as unknown as Student;
}

export async function updateStudent(id: string, input: StudentInput): Promise<Student> {
  await assertUniqueStudentId(input.student_id, id);
  const { data, error } = await supabase
    .from("students")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    if (error.code === "23505") throw new Error("Student ID already exists. Please use a unique ID.");
    throw new Error(error.message);
  }
  return data as unknown as Student;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type StudentErrors = Partial<Record<keyof StudentInput, string>>;

export function validateStudent(values: {
  student_id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  attendance: string;
  marks: string;
}): StudentErrors {
  const errors: StudentErrors = {};

  if (!values.student_id.trim()) errors.student_id = "Student ID is required";
  if (!values.name.trim()) errors.name = "Student name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!values.department) errors.department = "Department is required";
  if (!values.year) errors.year = "Year is required";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Enter a valid email address";

  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  else if (digits.length !== 10) errors.phone = "Phone number must be exactly 10 digits";

  const attendance = Number(values.attendance);
  if (values.attendance === "" || Number.isNaN(attendance))
    errors.attendance = "Attendance is required";
  else if (attendance < 0 || attendance > 100)
    errors.attendance = "Attendance must be between 0 and 100";

  const marks = Number(values.marks);
  if (values.marks === "" || Number.isNaN(marks)) errors.marks = "Marks are required";
  else if (marks < 0 || marks > 100) errors.marks = "Marks must be between 0 and 100";

  return errors;
}
