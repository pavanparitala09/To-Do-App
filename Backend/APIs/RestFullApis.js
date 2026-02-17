import exp, { response } from "express";
import { taskModel } from "../models/TaskModel.js";

export const router = exp.Router();

router.get("/", async (req, res) => {
  //get all tasks from db
  let tasks = await taskModel.find({ isActive: true });

  //send res
  res.status(200).json({ message: "tasks are", payload: tasks });
});

//get task details from user
router.post("/add-tasks", async (req, res) => {
  try {
    //get task details from body
    let task = req.body.task;
    console.log(task)

    //create a task model
    const newtask = await taskModel({ task });

    //save the model in db
    await newtask.save();

    //send response
    res.status(201).json({ message: "new task added", payload: newtask });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
});

router.put("/edit-task/:id", async (req, res) => {
  //get task id from params
  let taskId = req.params.id;

  //get updated task from body
  let task = req.body.editedTask;

  //edit task if it exist in db
  let updatedTask = await taskModel.findByIdAndUpdate(taskId, {
    $set: { task: task },
  });

  //if task does not exist
  if (!updatedTask) res.status(404).json({ message: "task does not exis" });

  //return updated task
  res
    .status(200)
    .json({ message: "task updated sucessfully", payload: updatedTask });
});

router.delete("/delete-task/:id", async (req, res) => {
  //get task id from params
  let taskId = req.params.id;

  //if task exist set is active status to false
  let deletedtask = await taskModel.findByIdAndUpdate(taskId, {
    $set: { isActive: false },
  });

  if (!deletedtask) res.status(404).json({ message: "task does not exist" });

  res.status(200).json({ message: "task deleted sucessfully" });
});
