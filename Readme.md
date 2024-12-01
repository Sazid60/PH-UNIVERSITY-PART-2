# Building University Management System Part-2

## 12-1 Avoid Repetition of Try-Catch , use catchAsync

### Higher Order Function

- A Function That Takes a function, do some task and return a function

- This is used to keep the code base clean
- Reduces repetitive functions
- Here Typescript comes with a solution named as functional typescript

- Express gives a request handler to deal with it and helps typescript

```ts
const createStudent: RequestHandler = async (req, res, next) => {};
```

- no need to define like req:Request

#### Ending an Era of Try Catch byy Using Higher Order function

```ts
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
// for getting all students
const getAllStudents = catchAsync(async (req, res, next) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});
```

## 12-2 Implement Your Army Middleware

- We will use the try catch catchAsync in utils folder
- We will make middleware of zod and use it. Its like we will make a higher order function in middleware and we will use.

#### Where will we use the zod middleware?

- Since controller will validate the data after the route is being called. So we will use it in between route and controller

![alt text](<WhatsApp Image 2024-11-30 at 19.17.18_b35da2de.jpg>)

- we can use multiple middleware

![alt text](<WhatsApp Image 2024-11-30 at 19.13.16_e5d32557.jpg>)

#### Middleware concepts

```ts
const router = express.Router();

const senaBahini = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  next();
};
router.post('/create-student', senaBahini, UserController.createStudent);

export const userRoutes = router;
```

- we will get the data in the body we will validate data inside the middleware and we will return error from the middleware if any kind of error happens

## 12-3 Implement validateRequest Middleware

- making the middleware function higher order

```ts
import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//  this is made higher order function
const senaBahini = (name) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    console.log(`I am ${name} senabahini`);

    //   validation
    next();
  };
};

router.post(
  '/create-student',
  senaBahini('ValidateRequest'),
  UserController.createStudent,
);

export const userRoutes = router;
```

- we have to take care of the data how we are sending and how we are dealing

```ts
import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { AnyZodObject } from 'zod';
import { studentValidationSchema } from '../students/student.validation';

const router = express.Router();

//  this is made higher order function
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   validation using zod
      // if everything alright next()
      await schema.parseAsync({
        body: req.body,
        //    as it is kept inside a body zod must be kept inside a body
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

router.post(
  '/create-student',
  validateRequest(studentValidationSchema),
  UserController.createStudent,
);

export const userRoutes = router;
```

- zod needs change as well

```ts
export const studentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),

    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImg: z.string(),
    }),
  }),
});
```

- Though we will make separate middleware for this

## 12-4 Create Academic Semester Interface

![alt text](image-1.png)

## 12-8 Handle Logical Validation of Academic Semester

- common work it written in model

```ts
//As it is a common work it is written in model
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExists) {
    throw new Error('Semester is already exists !');
  }
  next();
});
```

- not common for all works are made in service

```ts
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester ---> semester code
  //   type TAcademicSemesterNameCodeMapper = {
  //     Autumn: '01',
  //     Summer: '02',
  //     Fall: 'O3',
  //   }

  //   using map types as new semester may come un upcoming days

  //    as this is not common for all works so its made in service
  // if it is a common work it might be in model
  type TAcademicSemesterNameCodeMapper = {
    [key: string]: string;
  };
  const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: 'O3',
  };

  //   academicSemesterNameCodeMapper[Fall] this is 03 and matches with the value of the payload.code
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
```

![alt text](<WhatsApp Image 2024-12-01 at 21.54.39_e2e7fbd0.jpg>)

- This padStart means how many digits it want

```ts
const currentId = (0).toString().padStart(4, '0');
```

- creating a dynamic incremental id

```ts
// auto generate id

import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

// -->year->semester->4 digit number
export const generateStudentId = (payload: TAcademicSemester) => {
  const currentId = (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
```

- still there is some bug. to get latest student id id we can use createdAt:-1 and lean

```ts
// auto generate id

import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  // here lean mean it will give pure javascript which will make faster. but we can not use it all time time, when we are using query and doing no other mongoose operation we can use lean()

  //   203001 (0001) this will be incremented
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
  //   substring(6) means it will cut down 6 digits
};

// -->year->semester->4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  //   console.log(await findLastStudentId());
  const currentId = (await findLastStudentId()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
```
