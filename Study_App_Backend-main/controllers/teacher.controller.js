import teacher from '../models/teacher.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cookieParser from 'cookie-parser';


const secret = process.env.JWT_SECRET;

export const registerTeacher = async (req,res)=>{
    const {name,email,location,subjects,experience,highestqualification,mobile,password,bankDetails,aadharNumber,profilePic,sampleVideo} = req.body;
    const existingTeacher = await teacher.findOne({email});
    try{
       if(!existingTeacher){
        const hashedPassword = await bcrypt.hash(password,12);
        const newTeacher = new teacher({name,email,location,subjects,experience,highestqualification,mobile,password:hashedPassword,bankDetails,aadharNumber,profilePic,sampleVideo});
        await newTeacher.save();
        const token = jwt.sign({email:newTeacher.email,id:newTeacher._id,isTeacher:true},secret,{expiresIn:"90d"});
        console.log(newTeacher);
        res.cookie('token',token).status(200).json({message:"Teacher registered successfully",token});
       }else{
           res.status(404).json({message:"Teacher already exists"});
       }
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

export const loginTeacher = async (req,res)=>{
    try{
        const {email,password,mobile}=req.body;
        const existingTeacher = await teacher.findOne({email}) || await teacher.findOne({mobile});
        if(existingTeacher){
            const isPasswordCorrect = await bcrypt.compare(password,existingTeacher.password);
            if(isPasswordCorrect){
                const token = jwt.sign({email:existingTeacher.email,id:existingTeacher._id,isTeacher:true},secret,{expiresIn:"90d"});
                res.cookie("token",token).status(200).json({message:"Login successful",token,user:existingTeacher._id,isVerified:existingTeacher.isVerified,classes:existingTeacher.classes});
            }else{
                return res.status(404).json({message:"Credentials not valid"});
            }
        }else{
            return res.status(404).json({message:"Credentials not valid"});
        }
    }catch(e){
        console.error(e);
    }
}

export const logoutTeacher = async (req,res)=>{
    res.cookie("token","").status(200).json({message:"Logged out successfully"});
}

export const getTeacher = async (req,res)=>{
    try{
        const {id} = req.params;
        const teacherDetails = await teacher.findById(id,{name:1,email:1,mobile:1,location:1,subjects:1,experience:1,profilePic:1,isVerified:1,reviews:1,rating:1});
        res.status(200).json(teacherDetails);
    }catch(e){
        console.error(e);
    }
}

export const GetTeachers = async (req,res)=>{
    try{
        const teachers= await teacher.find({},{location:1,name:1,profilePic:1,subjects:1,experience:1});
        res.status(200).json({message:"Teachers fetched successfully",teachers});
    }catch(e){
        console.error(e);
        res.status(404).json({message:"Something went wrong"});
    }
}

export const GetClasses = async (req,res)=>{
    try{
        const {id} = req.params;
        const teacherDetails = await teacher.findById(id,{classes:1}).populate('classes.studentId','name email mobile profilePic standard _id');
        res.status(200).json(teacherDetails);
    }
    catch(e){
        console.error(e);
    }
}

export const PaymentHistory = async (req,res)=>{
    try{
        const {id} = req.params;
        const teacherDetails = await teacher.findById(id,{paymentHistory:1});
        res.status(200).json(teacherDetails);
    }catch(e){
        console.error(e);
    }
}



