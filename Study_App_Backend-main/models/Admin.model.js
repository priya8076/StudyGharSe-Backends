import mongoose from "mongoose";
const schema = mongoose.Schema;

const adminSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isadmin:{type:Boolean,default:true}
})

const Admin = mongoose.model('Admin',adminSchema);
export default Admin;