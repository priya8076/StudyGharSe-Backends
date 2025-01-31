import mongoose from "mongoose";

const schema = mongoose.Schema;

const studentSchema = new schema({
    profilePic:{type:String},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    standard:{type:String,required:true},
    password:{type:String,required:true},
    PastTeacher:[{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'}],
    classes:[{teacherId:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'},classesLeft:{type:Number}}],
    subscriptionEndDate:{type:Date,default:null},
    paymentHistory:[{amount:{type:Number}, date:{type:Date},status:{type:String},transactionId:{type:String}}],
    isverified:{type:Boolean,default:false},
})

const Student = mongoose.model('Student',studentSchema);
export default Student;