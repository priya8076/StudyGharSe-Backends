import mongoose from "mongoose";

const schema = mongoose.Schema;

const teacherSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    location:{locationName:{type:String},lat:{type:Number},lng:{type:Number}},
    subjects:[{type:String,required:true}],
    experience:{type:Number,required:true},
    highestqualification:{type:String,required:true},
    password:{type:String,required:true},
    CurrentStudents:[{type:mongoose.Schema.Types.ObjectId,ref:'Student'}],
    PastStudents:[{type:mongoose.Schema.Types.ObjectId,ref:'Student'}],
    rating:{type:Number,default:0},
    reviews:[{
        studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student'},
        review:{type:String},
        rating:{type:Number},
        date:{type:Date}
    }],
    profilePic:{type:String},
    isVerified:{type:Boolean,default:false},
    totalAmountEarned:{type:Number,default:0},
    withdrawlAmount:{type:Number,default:0},
    totalWithrwalableAmount:{type:Number,default:0},
    sampleVideo:{type:String},
    bankDetails:{accountNumber:{type:String},ifscCode:{type:String},bankName:{type:String},accountHolderName:{type:String}},
    aadharNumber:{type:String,required:true},
    paymentHistory:[{amount:{type:Number},date:{type:Date},status:{type:String},transactionId:{type:String}}],
    classes:[{studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student'},classesLeft:{type:Number}}],
    classOtp:{otp:{type:String},date:{type:Date}},
})

const Teacher = mongoose.model('Teacher',teacherSchema);

export default Teacher;