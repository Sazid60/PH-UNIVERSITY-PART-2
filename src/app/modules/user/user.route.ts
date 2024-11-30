import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';

const router = express.Router();

const senaBahini = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  next();
};
router.post('/create-student', senaBahini, UserController.createStudent);

export const userRoutes = router;
