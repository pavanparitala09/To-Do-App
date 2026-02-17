import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    task: {
      type: String,
      required: [true," please Enter the task"],
    },
    isActive:{
      type:Boolean,
      default:true
    },
  },
  { timestamps: true }
);

export const taskModel = model("Task", taskSchema);
