import mongoose, { trusted } from "mongoose";
const departmentSchema =new mongoose.Schema({
  dep_name:{type:String,required:true,unique:true},
  description:{type:String},
  employeeCount:{type:Number ,default:0,
    min:0,
  },
  createdAt:{type:Date,default:Date.now},
  updatedAt:{type:Date,default:Date.now}
  }
)
const Department=mongoose.model("Department",departmentSchema)
export default Department;