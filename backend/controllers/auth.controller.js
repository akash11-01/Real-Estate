import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      message: "All fields are required",
    });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400).json('User already exists');
  }

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


export const signin = async(req,res,next)=>{
  const {email,password} = req.body

  try {
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404,'User not found')) 
    }

    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorHandler(400,'Invalid creadentials'))
    }
    
    const {password:pass,...rest} = validUser._doc;

    const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET)
    res
      .cookie('access_token',token,{httpOnly:true})
      .status(200)
      .json(rest);
  } catch (error) {
    next(error)
  }
}