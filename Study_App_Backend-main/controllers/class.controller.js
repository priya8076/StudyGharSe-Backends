import student from '../models/Student.model.js';
import teacher from '../models/teacher.model.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';


export const genrateOtp = async (req,res)=>{
    const {teacherId,studentEmail} = req.body;
    const teacherDetails = await teacher.findById(teacherId,{classOtp:1});
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(),12);
    teacherDetails.classOtp = hashedOtp;
    await teacher.findByIdAndUpdate(teacherId,{classOtp:{otp:hashedOtp,date:new Date()}});
    try{
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })
        const mailOptions = {
            from:process.env.EMAIL,
            to:studentEmail,
            subject:"OTP for class",
            text:`Your OTP is ${otp}`
        }
      const resp= transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }else{
                res.status(200).json({message:"Otp sent successfully on registered email"});
            }
        })
    }catch(e){
        return res.status(500).json({message:"Something went wrong"});
    }   
}

export const resendOtp = async (req,res)=>{
    const {teacherId,studentId} = req.body;
    const teacherDetails = await teacher.findById(teacherId,{classOtp:1});
    const studentDetails = await student.findById(studentId,{email:1});
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(),12);
    const date = new Date();
    teacherDetails.classOtp = hashedOtp;
    await teacher.findByIdAndUpdate(teacherId,{classOtp:{otp:hashedOtp,date}});
    try{
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })
        const mailOptions = {
            from:process.env.EMAIL,
            to:studentDetails.email,
            subject:"OTP for class",
            text:`Your OTP is ${otp}`
        }
      const resp= transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }else{
                console.log(`Email sent: ${info.response}`);
                console.log(existingUser);
                res.status(200).json({message:"resend Otp sent successfully on registered email"});
                return;
            }
        })
    }catch(e){
        console.error(e);
    }
}

export const TakeClass = async (req,res)=>{
    const {teacherId,studentId,otp}= req.body;
    const teacherDetails = await teacher.findById(teacherId,{classOtp:1,classes:1});
    const studentDetails = await student.findById(studentId,{classes:1});
    const otpTime = teacherDetails.classOtp.date.getTime();
    const currentTime = new Date().getTime();
   try{
    if(otpTime+900000>currentTime){
        const isOtpValid =await bcrypt.compare(otp,teacherDetails.classOtp.otp);
        if(isOtpValid){
            teacherDetails.classes.find((item)=>{
                if(item.studentId==studentId){
                    item.classesLeft = item.classesLeft-1;
                }
            })
            studentDetails.classes.find((item)=>{
                if(item.teacherId==teacherId){
                    item.classesLeft = item.classesLeft-1;
                }
            })
            teacherDetails.classOtp = {otp:"",date:""};
            if(teacherDetails.classes.find((item)=>item.studentId==studentId && item.classesLeft<=0)){
                teacherDetails.classes = teacherDetails.classes.filter((item)=>item.studentId!=studentId);
                studentDetails.classes = studentDetails.classes.filter((item)=>item.teacherId!=teacherId);
                await teacher.findByIdAndUpdate(teacherId,{classes:teacherDetails.classes,classOtp:teacherDetails.classOtp});
                await student.findByIdAndUpdate(studentId,{classes:studentDetails.classes});
                res.status(200).json({message:"OTP verified successfully"});
            }else{
                await teacher.findByIdAndUpdate(teacherId,{classes:teacherDetails.classes,classOtp:teacherDetails.classOtp});
                await student.findByIdAndUpdate(studentId,{classes:studentDetails.classes});
                res.status(200).json({message:"OTP verified successfully"});
            }
        }else{
            res.status(404).json({message:"Invalid OTP"});
        }
    }
   }catch(e){
       console.error(e);
   }
}

