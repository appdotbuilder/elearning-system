import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  integer, 
  boolean, 
  pgEnum,
  numeric
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['teacher', 'student', 'manager']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late']);
export const assignmentSubmissionTypeEnum = pgEnum('assignment_submission_type', ['file', 'text']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'essay']);
export const examStatusEnum = pgEnum('exam_status', ['active', 'expired', 'draft']);
export const materialTypeEnum = pgEnum('material_type', ['pdf', 'docx', 'link']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: text('full_name').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Subjects table
export const subjectsTable = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  teacher_id: integer('teacher_id').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Learning materials table
export const learningMaterialsTable = pgTable('learning_materials', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  material_type: materialTypeEnum('material_type').notNull(),
  file_path: text('file_path'),
  external_link: text('external_link'),
  subject_id: integer('subject_id').notNull().references(() => subjectsTable.id),
  uploaded_by: integer('uploaded_by').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Assignments table
export const assignmentsTable = pgTable('assignments', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  subject_id: integer('subject_id').notNull().references(() => subjectsTable.id),
  created_by: integer('created_by').notNull().references(() => usersTable.id),
  due_date: timestamp('due_date').notNull(),
  max_score: integer('max_score').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Assignment submissions table
export const assignmentSubmissionsTable = pgTable('assignment_submissions', {
  id: serial('id').primaryKey(),
  assignment_id: integer('assignment_id').notNull().references(() => assignmentsTable.id),
  student_id: integer('student_id').notNull().references(() => usersTable.id),
  submission_type: assignmentSubmissionTypeEnum('submission_type').notNull(),
  text_content: text('text_content'),
  file_path: text('file_path'),
  score: integer('score'),
  feedback: text('feedback'),
  graded_by: integer('graded_by').references(() => usersTable.id),
  graded_at: timestamp('graded_at'),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Exams table
export const examsTable = pgTable('exams', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  subject_id: integer('subject_id').notNull().references(() => subjectsTable.id),
  created_by: integer('created_by').notNull().references(() => usersTable.id),
  time_limit_minutes: integer('time_limit_minutes').notNull(),
  access_deadline: timestamp('access_deadline').notNull(),
  status: examStatusEnum('status').notNull().default('draft'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Exam questions table
export const examQuestionsTable = pgTable('exam_questions', {
  id: serial('id').primaryKey(),
  exam_id: integer('exam_id').notNull().references(() => examsTable.id),
  question_text: text('question_text').notNull(),
  question_type: questionTypeEnum('question_type').notNull(),
  points: integer('points').notNull(),
  order_index: integer('order_index').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Multiple choice options table
export const multipleChoiceOptionsTable = pgTable('multiple_choice_options', {
  id: serial('id').primaryKey(),
  question_id: integer('question_id').notNull().references(() => examQuestionsTable.id),
  option_text: text('option_text').notNull(),
  is_correct: boolean('is_correct').notNull(),
  order_index: integer('order_index').notNull()
});

// Exam attempts table
export const examAttemptsTable = pgTable('exam_attempts', {
  id: serial('id').primaryKey(),
  exam_id: integer('exam_id').notNull().references(() => examsTable.id),
  student_id: integer('student_id').notNull().references(() => usersTable.id),
  started_at: timestamp('started_at').defaultNow().notNull(),
  submitted_at: timestamp('submitted_at'),
  total_score: numeric('total_score', { precision: 5, scale: 2 }),
  is_completed: boolean('is_completed').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Exam answers table
export const examAnswersTable = pgTable('exam_answers', {
  id: serial('id').primaryKey(),
  attempt_id: integer('attempt_id').notNull().references(() => examAttemptsTable.id),
  question_id: integer('question_id').notNull().references(() => examQuestionsTable.id),
  selected_option_id: integer('selected_option_id').references(() => multipleChoiceOptionsTable.id),
  essay_answer: text('essay_answer'),
  score: numeric('score', { precision: 5, scale: 2 }),
  answered_at: timestamp('answered_at').defaultNow().notNull()
});

// Attendance table
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  subject_id: integer('subject_id').notNull().references(() => subjectsTable.id),
  date: timestamp('date').notNull(),
  status: attendanceStatusEnum('status').notNull(),
  recorded_by: integer('recorded_by').references(() => usersTable.id),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Class enrollments table
export const classEnrollmentsTable = pgTable('class_enrollments', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => usersTable.id),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  enrolled_at: timestamp('enrolled_at').defaultNow().notNull(),
  is_active: boolean('is_active').notNull().default(true)
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  createdSubjects: many(subjectsTable),
  uploadedMaterials: many(learningMaterialsTable),
  createdAssignments: many(assignmentsTable),
  assignmentSubmissions: many(assignmentSubmissionsTable),
  createdExams: many(examsTable),
  examAttempts: many(examAttemptsTable),
  attendanceRecords: many(attendanceTable),
  classEnrollments: many(classEnrollmentsTable)
}));

export const classesRelations = relations(classesTable, ({ many }) => ({
  subjects: many(subjectsTable),
  enrollments: many(classEnrollmentsTable)
}));

export const subjectsRelations = relations(subjectsTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [subjectsTable.class_id],
    references: [classesTable.id]
  }),
  teacher: one(usersTable, {
    fields: [subjectsTable.teacher_id],
    references: [usersTable.id]
  }),
  materials: many(learningMaterialsTable),
  assignments: many(assignmentsTable),
  exams: many(examsTable),
  attendanceRecords: many(attendanceTable)
}));

export const learningMaterialsRelations = relations(learningMaterialsTable, ({ one }) => ({
  subject: one(subjectsTable, {
    fields: [learningMaterialsTable.subject_id],
    references: [subjectsTable.id]
  }),
  uploadedBy: one(usersTable, {
    fields: [learningMaterialsTable.uploaded_by],
    references: [usersTable.id]
  })
}));

export const assignmentsRelations = relations(assignmentsTable, ({ one, many }) => ({
  subject: one(subjectsTable, {
    fields: [assignmentsTable.subject_id],
    references: [subjectsTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [assignmentsTable.created_by],
    references: [usersTable.id]
  }),
  submissions: many(assignmentSubmissionsTable)
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissionsTable, ({ one }) => ({
  assignment: one(assignmentsTable, {
    fields: [assignmentSubmissionsTable.assignment_id],
    references: [assignmentsTable.id]
  }),
  student: one(usersTable, {
    fields: [assignmentSubmissionsTable.student_id],
    references: [usersTable.id]
  }),
  gradedBy: one(usersTable, {
    fields: [assignmentSubmissionsTable.graded_by],
    references: [usersTable.id]
  })
}));

export const examsRelations = relations(examsTable, ({ one, many }) => ({
  subject: one(subjectsTable, {
    fields: [examsTable.subject_id],
    references: [subjectsTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [examsTable.created_by],
    references: [usersTable.id]
  }),
  questions: many(examQuestionsTable),
  attempts: many(examAttemptsTable)
}));

export const examQuestionsRelations = relations(examQuestionsTable, ({ one, many }) => ({
  exam: one(examsTable, {
    fields: [examQuestionsTable.exam_id],
    references: [examsTable.id]
  }),
  options: many(multipleChoiceOptionsTable),
  answers: many(examAnswersTable)
}));

export const multipleChoiceOptionsRelations = relations(multipleChoiceOptionsTable, ({ one, many }) => ({
  question: one(examQuestionsTable, {
    fields: [multipleChoiceOptionsTable.question_id],
    references: [examQuestionsTable.id]
  }),
  selectedInAnswers: many(examAnswersTable)
}));

export const examAttemptsRelations = relations(examAttemptsTable, ({ one, many }) => ({
  exam: one(examsTable, {
    fields: [examAttemptsTable.exam_id],
    references: [examsTable.id]
  }),
  student: one(usersTable, {
    fields: [examAttemptsTable.student_id],
    references: [usersTable.id]
  }),
  answers: many(examAnswersTable)
}));

export const examAnswersRelations = relations(examAnswersTable, ({ one }) => ({
  attempt: one(examAttemptsTable, {
    fields: [examAnswersTable.attempt_id],
    references: [examAttemptsTable.id]
  }),
  question: one(examQuestionsTable, {
    fields: [examAnswersTable.question_id],
    references: [examQuestionsTable.id]
  }),
  selectedOption: one(multipleChoiceOptionsTable, {
    fields: [examAnswersTable.selected_option_id],
    references: [multipleChoiceOptionsTable.id]
  })
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [attendanceTable.user_id],
    references: [usersTable.id]
  }),
  subject: one(subjectsTable, {
    fields: [attendanceTable.subject_id],
    references: [subjectsTable.id]
  }),
  recordedBy: one(usersTable, {
    fields: [attendanceTable.recorded_by],
    references: [usersTable.id]
  })
}));

export const classEnrollmentsRelations = relations(classEnrollmentsTable, ({ one }) => ({
  student: one(usersTable, {
    fields: [classEnrollmentsTable.student_id],
    references: [usersTable.id]
  }),
  class: one(classesTable, {
    fields: [classEnrollmentsTable.class_id],
    references: [classesTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  classes: classesTable,
  subjects: subjectsTable,
  learningMaterials: learningMaterialsTable,
  assignments: assignmentsTable,
  assignmentSubmissions: assignmentSubmissionsTable,
  exams: examsTable,
  examQuestions: examQuestionsTable,
  multipleChoiceOptions: multipleChoiceOptionsTable,
  examAttempts: examAttemptsTable,
  examAnswers: examAnswersTable,
  attendance: attendanceTable,
  classEnrollments: classEnrollmentsTable
};