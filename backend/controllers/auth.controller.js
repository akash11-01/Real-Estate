import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      message: "All fields are required",
    });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400).json("User already exists");
  }

  const hashedPassword = bcryptjs.hashSync(password, 12); // here 12 is salt -> it is a hashed number or variable that
  // combines with our password to make it encrypted

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    res.status(201).json("User created successfully");
  } catch (error) {
    next(error); // next will call the middleware which we created in the index.js
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // req.body is the information we get from the browser

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid creadentials"));
    }

    const { password: pass, ...rest } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true }) // httpOnly:true karne se ham bas server side se hi kuch change kar sakte hai
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random.toString(36).slice(-8) + Math.random.toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);

      const generatedUsername = Math.random().toString(36).slice(-8);
      const newUser = new User({
        username: generatedUsername,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const { password: pass, ...rest } = newUser._doc;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token"); // we get cookie from the response
    res.status(200).json({ message: "Signout successfull" });
  } catch (error) {
    next(error);
  }
};
