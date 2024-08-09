import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs' 


export const testApi = async (req,res) =>{
    res.json({
        massage:"Api is working"
    })
}


export const updateUser = async(req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can update only your profile'))
    
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
    
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                // set updates only those things which are updated
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    avatar:req.body.avatar
                },
            },
            {
                new:true  // this will create and save the user
            }
        )
    
        const {password,...rest} = updatedUser._doc
    
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}


export const deleteUser = async (req,res,next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only delete your own account'))
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json({message:'user has been deleted'})
    } catch (error) {
        next(error)
    }
}


export const getUserListings = async (req,res,next) =>{
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef:req.params.id})
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(401,'You can see only your listings'))
    }
}