// import studentValidationSchema from '../students/student.validation';
import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body;

    // using zod
    // const zodValidationData = studentValidationSchema.parse(studentData);
    // will call service function to send this data
    const result = await UserServices.createStudentInDB(studentData, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Is Created Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  createStudent,
};
