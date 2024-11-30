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