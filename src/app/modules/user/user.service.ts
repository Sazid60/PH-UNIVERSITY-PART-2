import config from '../../config';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';

import { User } from './user.model';

const createStudentInDB = async (studentData: TStudent, password: string) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given use default password
  //   if (!password) {
  //     user.password = config.default_password as string;
  //   } else {
  //     user.password = password;
  //   }
  userData.password = password || (config.default_password as string);

  //   console.log('password:', password);
  // console.log(studentData);

  // set student role
  userData.role = 'student';

  //   set manually generated id
  userData.id = '2030100001';

  //    create a user
  const newUser = await User.create(userData);

  //    create a student
  if (Object.keys(newUser).length) {
    //  set id, _id as user
    studentData.id = newUser.id; //embedding id
    studentData.user = newUser._id; //reference _d

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentInDB,
};
