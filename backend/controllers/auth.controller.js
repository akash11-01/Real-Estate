import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
export const signup = async(req,res)=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        });
    }

    const existedUser = await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(existedUser){
        return res.status(400).json({
            message:"Username or email already existed"
        })
    }

    const hashedPassword = bcryptjs.hashSync(password,12);


    const newUser = new User({
        username,
        email,
        password:hashedPassword
    });

    try {
        await newUser.save()
    
        res.status(201).json({
            massage:"Signup successfull"
        })
    } catch (error) {
        res.status(500).json(error.massage) 
    }
}