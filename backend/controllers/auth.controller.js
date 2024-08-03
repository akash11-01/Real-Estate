import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;

  // if (!username || !email || !password) {
  //   res.status(400).json({
  //     message: "All fields are required",
  //   });
  // }

  // const existedUser = await User.findOne({ email });

  // if (existedUser) {
  //   res.status(400).json('User already exists');
  // }

  const hashedPassword = bcryptjs.hashSync(password, 12);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    res.status(201).json('User created successfully');
  } catch (error) {
    next(error)
  }
};
