CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendance NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (attendance >= 0 AND attendance <= 100),
  marks NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (marks >= 0 AND marks <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can add students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON public.students FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete students" ON public.students FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.students (student_id, name, department, year, email, phone, attendance, marks) VALUES
  ('STU-001', 'Aarav Sharma', 'Artificial Intelligence and Data Science', '3rd Year', 'aarav.sharma@college.edu', '9876543210', 92.00, 88.00),
  ('STU-002', 'Diya Patel', 'Artificial Intelligence and Data Science', '2nd Year', 'diya.patel@college.edu', '9876501234', 89.00, 94.00),
  ('STU-003', 'Rohan Mehta', 'Computer Science and Engineering', '4th Year', 'rohan.mehta@college.edu', '9812345678', 74.00, 71.00),
  ('STU-004', 'Ishaan Verma', 'Information Technology', '1st Year', 'ishaan.verma@college.edu', '9898989898', 95.00, 82.00),
  ('STU-005', 'Ananya Iyer', 'Artificial Intelligence and Data Science', '3rd Year', 'ananya.iyer@college.edu', '9765432109', 90.00, 91.00);