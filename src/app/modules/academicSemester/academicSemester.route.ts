import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);
// // get all students
// router.get('/', StudentController.getAllStudents);
// // get single students
// router.get('/:studentId', StudentController.getSingleStudent);
// // delete student
// router.delete('/:studentId', StudentController.deleteStudent);

export const AcademicSemesterRoutes = router;
