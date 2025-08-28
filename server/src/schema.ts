import { z } from 'zod';

// Enums for various system constants
export const userRoleEnum = z.enum(['teacher', 'student', 'manager']);
export const attendanceStatusEnum = z.enum(['present', 'absent', 'late']);
export const assignmentSubmissionTypeEnum = z.enum(['file', 'text']);
export const questionTypeEnum = z.enum(['multiple_choice', 'essay']);
export const examStatusEnum = z.enum(['active', 'expired', 'draft']);
export const materialTypeEnum = z.enum(['pdf', 'docx', 'link']);

// User schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string(),
  role: userRoleEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  role: userRoleEnum,
  is_active: z.boolean().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Class schemas
export const classSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Class = z.infer<typeof classSchema>;

export const createClassInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional()
});

export type CreateClassInput = z.infer<typeof createClassInputSchema>;

// Subject schemas
export const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  class_id: z.number(),
  teacher_id: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Subject = z.infer<typeof subjectSchema>;

export const createSubjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  class_id: z.number(),
  teacher_id: z.number()
});

export type CreateSubjectInput = z.infer<typeof createSubjectInputSchema>;

// Learning material schemas
export const learningMaterialSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  material_type: materialTypeEnum,
  file_path: z.string().nullable(),
  external_link: z.string().nullable(),
  subject_id: z.number(),
  uploaded_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LearningMaterial = z.infer<typeof learningMaterialSchema>;

export const createLearningMaterialInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  material_type: materialTypeEnum,
  file_path: z.string().nullable().optional(),
  external_link: z.string().nullable().optional(),
  subject_id: z.number()
});

export type CreateLearningMaterialInput = z.infer<typeof createLearningMaterialInputSchema>;

// Assignment schemas
export const assignmentSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  subject_id: z.number(),
  created_by: z.number(),
  due_date: z.coerce.date(),
  max_score: z.number().int().min(1).max(100),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Assignment = z.infer<typeof assignmentSchema>;

export const createAssignmentInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  subject_id: z.number(),
  due_date: z.coerce.date(),
  max_score: z.number().int().min(1).max(100)
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentInputSchema>;

// Assignment submission schemas
export const assignmentSubmissionSchema = z.object({
  id: z.number(),
  assignment_id: z.number(),
  student_id: z.number(),
  submission_type: assignmentSubmissionTypeEnum,
  text_content: z.string().nullable(),
  file_path: z.string().nullable(),
  score: z.number().int().min(0).max(100).nullable(),
  feedback: z.string().nullable(),
  graded_by: z.number().nullable(),
  graded_at: z.coerce.date().nullable(),
  submitted_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;

export const createAssignmentSubmissionInputSchema = z.object({
  assignment_id: z.number(),
  submission_type: assignmentSubmissionTypeEnum,
  text_content: z.string().nullable().optional(),
  file_path: z.string().nullable().optional()
});

export type CreateAssignmentSubmissionInput = z.infer<typeof createAssignmentSubmissionInputSchema>;

export const gradeAssignmentInputSchema = z.object({
  submission_id: z.number(),
  score: z.number().int().min(0).max(100),
  feedback: z.string().nullable().optional()
});

export type GradeAssignmentInput = z.infer<typeof gradeAssignmentInputSchema>;

// Exam schemas
export const examSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  subject_id: z.number(),
  created_by: z.number(),
  time_limit_minutes: z.number().int().positive(),
  access_deadline: z.coerce.date(),
  status: examStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Exam = z.infer<typeof examSchema>;

export const createExamInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  subject_id: z.number(),
  time_limit_minutes: z.number().int().positive(),
  access_deadline: z.coerce.date(),
  status: examStatusEnum.optional()
});

export type CreateExamInput = z.infer<typeof createExamInputSchema>;

// Exam question schemas
export const examQuestionSchema = z.object({
  id: z.number(),
  exam_id: z.number(),
  question_text: z.string(),
  question_type: questionTypeEnum,
  points: z.number().int().positive(),
  order_index: z.number().int().nonnegative(),
  created_at: z.coerce.date()
});

export type ExamQuestion = z.infer<typeof examQuestionSchema>;

export const createExamQuestionInputSchema = z.object({
  exam_id: z.number(),
  question_text: z.string().min(1),
  question_type: questionTypeEnum,
  points: z.number().int().positive(),
  order_index: z.number().int().nonnegative()
});

export type CreateExamQuestionInput = z.infer<typeof createExamQuestionInputSchema>;

// Multiple choice option schemas
export const multipleChoiceOptionSchema = z.object({
  id: z.number(),
  question_id: z.number(),
  option_text: z.string(),
  is_correct: z.boolean(),
  order_index: z.number().int().nonnegative()
});

export type MultipleChoiceOption = z.infer<typeof multipleChoiceOptionSchema>;

export const createMultipleChoiceOptionInputSchema = z.object({
  question_id: z.number(),
  option_text: z.string().min(1),
  is_correct: z.boolean(),
  order_index: z.number().int().nonnegative()
});

export type CreateMultipleChoiceOptionInput = z.infer<typeof createMultipleChoiceOptionInputSchema>;

// Exam attempt schemas
export const examAttemptSchema = z.object({
  id: z.number(),
  exam_id: z.number(),
  student_id: z.number(),
  started_at: z.coerce.date(),
  submitted_at: z.coerce.date().nullable(),
  total_score: z.number().nullable(),
  is_completed: z.boolean(),
  created_at: z.coerce.date()
});

export type ExamAttempt = z.infer<typeof examAttemptSchema>;

export const startExamInputSchema = z.object({
  exam_id: z.number()
});

export type StartExamInput = z.infer<typeof startExamInputSchema>;

// Exam answer schemas
export const examAnswerSchema = z.object({
  id: z.number(),
  attempt_id: z.number(),
  question_id: z.number(),
  selected_option_id: z.number().nullable(),
  essay_answer: z.string().nullable(),
  score: z.number().nullable(),
  answered_at: z.coerce.date()
});

export type ExamAnswer = z.infer<typeof examAnswerSchema>;

export const submitExamAnswerInputSchema = z.object({
  attempt_id: z.number(),
  question_id: z.number(),
  selected_option_id: z.number().nullable().optional(),
  essay_answer: z.string().nullable().optional()
});

export type SubmitExamAnswerInput = z.infer<typeof submitExamAnswerInputSchema>;

// Attendance schemas
export const attendanceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  subject_id: z.number(),
  date: z.coerce.date(),
  status: attendanceStatusEnum,
  recorded_by: z.number().nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Attendance = z.infer<typeof attendanceSchema>;

export const recordAttendanceInputSchema = z.object({
  user_id: z.number(),
  subject_id: z.number(),
  date: z.coerce.date(),
  status: attendanceStatusEnum,
  notes: z.string().nullable().optional()
});

export type RecordAttendanceInput = z.infer<typeof recordAttendanceInputSchema>;

// Class enrollment schemas
export const classEnrollmentSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  class_id: z.number(),
  enrolled_at: z.coerce.date(),
  is_active: z.boolean()
});

export type ClassEnrollment = z.infer<typeof classEnrollmentSchema>;

export const enrollStudentInputSchema = z.object({
  student_id: z.number(),
  class_id: z.number()
});

export type EnrollStudentInput = z.infer<typeof enrollStudentInputSchema>;