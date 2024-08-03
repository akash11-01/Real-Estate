import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
,        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            default:'https://kerma.widyatama.ac.id/wp-content/uploads/2021/05/blank-profile-picture-973460_1280-850x850.png'
        }
    },
    {timestamps:true}
);

const User = mongoose.model('User',userSchema);

export default User;