import student from "../models/Student.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const secret = process.env.JWT_SECRET;
import nodemailer from 'nodemailer';
import Teacher from "../models/teacher.model.js";


export const registerStudent = async (req,res)=>{
    try{
        const {name,email,mobile,standard,password,profilePic} = req.body;
        
        const existingStudent = await student.findOne({email}) || await student.findOne({mobile});
        if(existingStudent){
            return res.status(400).json({message:"Student already exists"});
        }else{
            const hashedPassword = await bcrypt.hash(password,12);
            const newStudent = new student({
                name,
                email,
                mobile,
                standard,
                password:hashedPassword,
                profilePic
            })
            await newStudent.save();
             const transporter = nodemailer.createTransport({
                 service:"gmail",
                 auth:{
                     user:process.env.EMAIL,
                     pass:process.env.PASSWORD
                 }
             })
             const mailOptions = {
                 from:process.env.EMAIL,
                 to:email,
                 subject:"Verify your email",
                 text:`Click on the link to verify your email http://localhost:3000/student/verify/${email}`
             }
           const resp= transporter.sendMail(mailOptions,(error,info)=>{
                 if(error){
                     console.log(error);
                 }else{
                     console.log(`Email sent: ${info.response}`);
                     console.log(existingUser);
                     res.status(200).json({message:"Email sent successfully"});
                     return;
                 }
             })
            res.status(201).json({message:"Student registered successfully",verify:"Email sent successfully to verify your email"});
        }
    }catch(e){
        console.error(e);
    }
}

export const verifyStudent = async (req,res)=>{
        try{
            const {email} = req.params;
            const studentDetails = await student.findOne({email});
            if(studentDetails){
                await student.findByIdAndUpdate(studentDetails._id,{isverified:true});
                res.status(200).json({message:"Student verified successfully"});
            }
            else{
                res.status(404).json({message:"Student not found"});
            }
        }catch(e){
            console.error(e);
            res.status(404).json({message:"Student not found"});
        }
}

export const loginStudent = async (req,res)=>{
    try{
        const {email,password,mobile}=req.body;
        const existingStudent = await student.findOne({email}) || await student.findOne({mobile});
        if(existingStudent){
            const isPasswordCorrect = await bcrypt.compare(password,existingStudent.password);
            if(isPasswordCorrect){
                const token = jwt.sign({email:existingStudent.email,id:existingStudent._id,isTeacher:false},secret,{expiresIn:"90d"});
                res.cookie("token",token).status(200).json({message:"Login successful",token,user:existingStudent._id,classes:existingStudent.classes,isVerified:existingStudent.isverified});
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

export const logoutStudent = (req,res)=>{
    res.clearCookie("token").status(200).json({message:"Logout successful"});
}

export const getStudent = async (req,res)=>{
    try{
        const {id} = req.params;
        const studentDetails = await student.findById(id,{name:1,email:1,mobile:1,standard:1,profilePic:1,isverified:1});
        res.status(200).json(studentDetails);
    }catch(e){
        console.error(e);
    }
}

export const updateStudent = async (req,res)=>{
    try{
        const {id} = req.params;
        const {name,email,mobile,location,standard,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,12);
        await student.findByIdAndUpdate(id,{name,email,mobile,location,standard,password:hashedPassword});
        res.status(200).json({message:"Updated successfully"});
    }catch(e){
        console.error(e);
    }
}

export const deleteStudent = async (req,res)=>{
    try{
        const {id} = req.params;
        await student.findByIdAndDelete(id);
        res.status(200).json({message:"Deleted successfully"});
    }catch(e){
        console.error(e);
    }
}

export const addClasses = async (req,res)=>{
    try{
        const {id} = req.params;
        const {teacherId} = req.body;
        const teacherDetails = await Teacher.findById(teacherId);
        const studentDetails = await student.findById(id).populate('classes.teacherId');
        const classes = studentDetails.classes;
        if(classes.find(cls=>cls.teacherId.toString()===teacherId)){
            return res.status(404).json({message:"Class already added"});
        }
        const teacherClasses = teacherDetails.classes;
        const index = teacherClasses.findIndex((c)=>c.studentId===id);
        if(index===-1){
            teacherClasses.push({studentId:id,classesLeft:8});
        }
        classes.push({teacherId,classesLeft:8});
        await student.findByIdAndUpdate(id,{classes});
        await Teacher.findByIdAndUpdate(teacherId,{classes:teacherClasses});
        res.status(200).json({message:"Class added successfully"});
       
    }catch(e){
        console.error(e);
    }
}

export const classleft = async (req,res)=>{
    try{
        const {id}= req.params;
        const {teacherId} = req.body;
        const studentDetails = await student.findById(id);
        const classes = studentDetails.classes;
        const index = classes.findIndex((c)=>c.teacherId===teacherId);
        classes[index].classesLeft = classes[index].classesLeft-1;
        await student.findByIdAndUpdate(id,{classes});
        res.status(200).json({message:"Class left updated successfully"});
    }catch(e){
        console.error(e);
    }
}

export const getClasses = async (req,res)=>{
    try{
        const {id} = req.params;
        const studentDetails = await student.findById(id).populate('classes.teacherId');
        res.status(200).json(studentDetails.classes);
    }catch(e){
        console.error(e);
    }
}

export const getPastTeachers = async (req,res)=>{
    try{
        const {id} = req.params;
        const studentDetails = await student.findById(id);
        res.status(200).json(studentDetails.PastTeacher);
    }catch(e){
        console.error(e);
    }
}

export const getPaymentHistory = async (req,res)=>{
    try{
        const {id} = req.params;
        const studentDetails = await student.findById(id,{paymentHistory:1});
        res.status(200).json(studentDetails.paymentHistory);
    }catch(e){
        console.error(e);
    }
}

export const updatePssword = async (req,res)=>{
    try{
        const {id} = req.params;
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password,12);
        await student.findByIdAndUpdate(id,{password:hashedPassword});
        res.status(200).json({message:"Password updated successfully"});
    }
    catch(e){
        console.error(e);
    }
}

export const forgotPassword = async (req,res)=>{
    try{
        const {email}= req.body;
        const studentDetails = await student.findOne({email});
        if(studentDetails){
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            })
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:"Reset your password",
                text:`Click on the link to reset your password http://localhost:3000/reset/${email}`
            }
             transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error);
                }else{
                    console.log(`Email sent: ${info.response}`);
                    res.status(200).json({message:"Email sent successfully"});
                    return;
                }
            })}else{
                res.status(404).json({message:"Student not found"});
            }
    }catch(e){
        console.error(e);
    }
}

export const payment = async (req,res)=>{
    try{
        const {id}= req.params;
        const {amount,status,transactionId,date} = req.body;
        const studentDetails = await student.findById(id);
        const paymentHistory = studentDetails.paymentHistory;
        paymentHistory.push({amount,status,transactionId,date});
        await student.findByIdAndUpdate(id,{paymentHistory});
        res.status(200).json({message:"Payment successful"});
    }catch(e){
        console.error(e);
        res.status(404).json({message:"Payment failed"});
    }
}
