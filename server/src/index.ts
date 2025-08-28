import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import all schemas
import {
  createUserInputSchema,
  loginInputSchema,
  createClassInputSchema,
  createSubjectInputSchema,
  createLearningMaterialInputSchema,
  createAssignmentInputSchema,
  createAssignmentSubmissionInputSchema,
  gradeAssignmentInputSchema,
  createExamInputSchema,
  createExamQuestionInputSchema,
  createMultipleChoiceOptionInputSchema,
  startExamInputSchema,
  submitExamAnswerInputSchema,
  recordAttendanceInputSchema,
  enrollStudentInputSchema
} from './schema';

// Import all handlers
import { registerUser, loginUser, getCurrentUser } from './handlers/auth';
import { 
  createClass, 
  getClasses, 
  getClassById, 
  updateClass, 
  deleteClass, 
  enrollStudent, 
  getStudentsInClass 
} from './handlers/classes';
import { 
  createSubject, 
  getSubjects, 
  getSubjectsByClass, 
  getSubjectsByTeacher, 
  getSubjectById, 
  updateSubject, 
  deleteSubject 
} from './handlers/subjects';
import { 
  uploadLearningMaterial, 
  getLearningMaterialsBySubject, 
  getLearningMaterialById, 
  updateLearningMaterial, 
  deleteLearningMaterial 
} from './handlers/learning_materials';
import { 
  createAssignment, 
  getAssignmentsBySubject, 
  getAssignmentById, 
  submitAssignment, 
  gradeAssignment, 
  getSubmissionsByAssignment, 
  getStudentSubmissions, 
  updateAssignment, 
  deleteAssignment 
} from './handlers/assignments';
import { 
  createExam, 
  createExamQuestion, 
  createMultipleChoiceOption, 
  getExamsBySubject, 
  getExamById, 
  getExamQuestions, 
  getQuestionOptions, 
  startExam, 
  submitExamAnswer, 
  submitExam, 
  getStudentExamAttempts, 
  getExamResults 
} from './handlers/exams';
import { 
  recordAttendance, 
  getAttendanceBySubject, 
  getAttendanceByUser, 
  updateAttendance, 
  getAttendanceReport, 
  deleteAttendance 
} from './handlers/attendance';
import { 
  getAllUsers, 
  getUserById, 
  getUsersByRole, 
  updateUser, 
  deleteUser, 
  activateUser, 
  deactivateUser, 
  getTeachers, 
  getStudents 
} from './handlers/users';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    register: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => registerUser(input)),
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => loginUser(input)),
    getCurrentUser: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => getCurrentUser(input.userId)),
  }),

  // User management routes (Manager role)
  users: router({
    getAll: publicProcedure
      .query(() => getAllUsers()),
    getById: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => getUserById(input.userId)),
    getByRole: publicProcedure
      .input(z.object({ role: z.enum(['teacher', 'student', 'manager']) }))
      .query(({ input }) => getUsersByRole(input.role)),
    update: publicProcedure
      .input(z.object({ userId: z.number() }).merge(createUserInputSchema.partial()))
      .mutation(({ input }) => updateUser(input.userId, input)),
    delete: publicProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ input }) => deleteUser(input.userId)),
    activate: publicProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ input }) => activateUser(input.userId)),
    deactivate: publicProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ input }) => deactivateUser(input.userId)),
    getTeachers: publicProcedure
      .query(() => getTeachers()),
    getStudents: publicProcedure
      .query(() => getStudents()),
  }),

  // Class management routes
  classes: router({
    create: publicProcedure
      .input(createClassInputSchema)
      .mutation(({ input }) => createClass(input)),
    getAll: publicProcedure
      .query(() => getClasses()),
    getById: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getClassById(input.classId)),
    update: publicProcedure
      .input(z.object({ classId: z.number() }).merge(createClassInputSchema.partial()))
      .mutation(({ input }) => updateClass(input.classId, input)),
    delete: publicProcedure
      .input(z.object({ classId: z.number() }))
      .mutation(({ input }) => deleteClass(input.classId)),
    enrollStudent: publicProcedure
      .input(enrollStudentInputSchema)
      .mutation(({ input }) => enrollStudent(input)),
    getStudents: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getStudentsInClass(input.classId)),
  }),

  // Subject management routes
  subjects: router({
    create: publicProcedure
      .input(createSubjectInputSchema)
      .mutation(({ input }) => createSubject(input)),
    getAll: publicProcedure
      .query(() => getSubjects()),
    getByClass: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getSubjectsByClass(input.classId)),
    getByTeacher: publicProcedure
      .input(z.object({ teacherId: z.number() }))
      .query(({ input }) => getSubjectsByTeacher(input.teacherId)),
    getById: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => getSubjectById(input.subjectId)),
    update: publicProcedure
      .input(z.object({ subjectId: z.number() }).merge(createSubjectInputSchema.partial()))
      .mutation(({ input }) => updateSubject(input.subjectId, input)),
    delete: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .mutation(({ input }) => deleteSubject(input.subjectId)),
  }),

  // Learning materials routes
  materials: router({
    upload: publicProcedure
      .input(createLearningMaterialInputSchema.merge(z.object({ uploadedBy: z.number() })))
      .mutation(({ input }) => uploadLearningMaterial(input, input.uploadedBy)),
    getBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => getLearningMaterialsBySubject(input.subjectId)),
    getById: publicProcedure
      .input(z.object({ materialId: z.number() }))
      .query(({ input }) => getLearningMaterialById(input.materialId)),
    update: publicProcedure
      .input(z.object({ materialId: z.number() }).merge(createLearningMaterialInputSchema.partial()))
      .mutation(({ input }) => updateLearningMaterial(input.materialId, input)),
    delete: publicProcedure
      .input(z.object({ materialId: z.number() }))
      .mutation(({ input }) => deleteLearningMaterial(input.materialId)),
  }),

  // Assignment routes
  assignments: router({
    create: publicProcedure
      .input(createAssignmentInputSchema.merge(z.object({ createdBy: z.number() })))
      .mutation(({ input }) => createAssignment(input, input.createdBy)),
    getBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => getAssignmentsBySubject(input.subjectId)),
    getById: publicProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(({ input }) => getAssignmentById(input.assignmentId)),
    submit: publicProcedure
      .input(createAssignmentSubmissionInputSchema.merge(z.object({ studentId: z.number() })))
      .mutation(({ input }) => submitAssignment(input, input.studentId)),
    grade: publicProcedure
      .input(gradeAssignmentInputSchema.merge(z.object({ gradedBy: z.number() })))
      .mutation(({ input }) => gradeAssignment(input, input.gradedBy)),
    getSubmissions: publicProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(({ input }) => getSubmissionsByAssignment(input.assignmentId)),
    getStudentSubmissions: publicProcedure
      .input(z.object({ studentId: z.number(), subjectId: z.number().optional() }))
      .query(({ input }) => getStudentSubmissions(input.studentId, input.subjectId)),
    update: publicProcedure
      .input(z.object({ assignmentId: z.number() }).merge(createAssignmentInputSchema.partial()))
      .mutation(({ input }) => updateAssignment(input.assignmentId, input)),
    delete: publicProcedure
      .input(z.object({ assignmentId: z.number() }))
      .mutation(({ input }) => deleteAssignment(input.assignmentId)),
  }),

  // Exam routes
  exams: router({
    create: publicProcedure
      .input(createExamInputSchema.merge(z.object({ createdBy: z.number() })))
      .mutation(({ input }) => createExam(input, input.createdBy)),
    createQuestion: publicProcedure
      .input(createExamQuestionInputSchema)
      .mutation(({ input }) => createExamQuestion(input)),
    createOption: publicProcedure
      .input(createMultipleChoiceOptionInputSchema)
      .mutation(({ input }) => createMultipleChoiceOption(input)),
    getBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => getExamsBySubject(input.subjectId)),
    getById: publicProcedure
      .input(z.object({ examId: z.number() }))
      .query(({ input }) => getExamById(input.examId)),
    getQuestions: publicProcedure
      .input(z.object({ examId: z.number() }))
      .query(({ input }) => getExamQuestions(input.examId)),
    getOptions: publicProcedure
      .input(z.object({ questionId: z.number() }))
      .query(({ input }) => getQuestionOptions(input.questionId)),
    start: publicProcedure
      .input(startExamInputSchema.merge(z.object({ studentId: z.number() })))
      .mutation(({ input }) => startExam(input, input.studentId)),
    submitAnswer: publicProcedure
      .input(submitExamAnswerInputSchema)
      .mutation(({ input }) => submitExamAnswer(input)),
    submit: publicProcedure
      .input(z.object({ attemptId: z.number() }))
      .mutation(({ input }) => submitExam(input.attemptId)),
    getAttempts: publicProcedure
      .input(z.object({ studentId: z.number(), examId: z.number().optional() }))
      .query(({ input }) => getStudentExamAttempts(input.studentId, input.examId)),
    getResults: publicProcedure
      .input(z.object({ attemptId: z.number() }))
      .query(({ input }) => getExamResults(input.attemptId)),
  }),

  // Attendance routes
  attendance: router({
    record: publicProcedure
      .input(recordAttendanceInputSchema.merge(z.object({ recordedBy: z.number() })))
      .mutation(({ input }) => recordAttendance(input, input.recordedBy)),
    getBySubject: publicProcedure
      .input(z.object({ 
        subjectId: z.number(), 
        startDate: z.coerce.date().optional(), 
        endDate: z.coerce.date().optional() 
      }))
      .query(({ input }) => getAttendanceBySubject(input.subjectId, input.startDate, input.endDate)),
    getByUser: publicProcedure
      .input(z.object({ userId: z.number(), subjectId: z.number().optional() }))
      .query(({ input }) => getAttendanceByUser(input.userId, input.subjectId)),
    update: publicProcedure
      .input(z.object({ attendanceId: z.number() }).merge(recordAttendanceInputSchema.partial()))
      .mutation(({ input }) => updateAttendance(input.attendanceId, input)),
    getReport: publicProcedure
      .input(z.object({ subjectId: z.number().optional(), classId: z.number().optional() }))
      .query(({ input }) => getAttendanceReport(input.subjectId, input.classId)),
    delete: publicProcedure
      .input(z.object({ attendanceId: z.number() }))
      .mutation(({ input }) => deleteAttendance(input.attendanceId)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`E-Learning TRPC server listening at port: ${port}`);
}

start();