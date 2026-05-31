import Task from "../models/Task.js";

const addTask = async (req, res) => {
  try {
    const { task, cleared } = req.body;
    const userId = req.user.id;

    if (!task || cleared === undefined || !userId) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const creationResult = await Task.create({
      task,
      cleared,
      user: userId,
    });

    console.log(creationResult);

    return res.status(201).json({
      message: "Task added successfully",
      success: true,
      task: creationResult,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getTask = async(req,res) =>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message:"login required",success:false});
        }
        const tasks = await Task.find({user:userId});
        if(tasks.length === 0){
            return res.status(200).json({message:"There is no tasks , create one now",success:true,records:[]});
        }
        return res.status(200).json({message:"tasks fetched successfully",success:true,records:tasks});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Error occured while fetching the tasks",success:false});
    }
}

const updateTask = async(req,res) =>{
    try{
      const {taskId} = req.params;
      const {newTask} = req.body;
      const userId = req.user.id;
      console.log(newTask,taskId,userId)
      if(!taskId || !newTask){
          return res.status(400).json({message:"TaskId is required for updating",success:false});
      }
      const updationResult = await Task.updateOne({_id:taskId,user:userId},{$set:{task:newTask}});
      if(updationResult.matchedCount === 0){
         return res.status(404).json({message:"Task not found",success:false});
      }
      console.log("Task Updated",updationResult);
      return res.status(200).json({message:"task updated successfully",success:true});
    }
    catch(err){
      console.log(err);
      return res.status(500).json({message:"error occured while updating the task",success:false});
    }
}
const deleteTask = async(req,res) =>{
  try{
    const { taskId }=  req.params;
    const userId = req.user.id;
    if(!taskId){
          return res.status(400).json({message:"TaskId is required for updating",success:false});
    }
    const deletionResult = await Task.deleteOne({_id:taskId,user:userId});
    if(deletionResult.deletedCount === 0){
      return res.status(404).json({message:"Task not found",success:false});
    }
    console.log("Deletion successsful",deletionResult);
    return res.status(200).json({message:"Task deleted successfully",success:true});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"error occured while deleting the task",success:false});
  }
}

const clearTask = async(req,res) =>{
    try{
      const {taskId} = req.params;
      const userId = req.user.id;
      if(!taskId){
          return res.status(400).json({message:"TaskId is required for updating",success:false});
      }
      const updationResult = await Task.updateOne({_id:taskId,user:userId},{$set:{cleared:true}});
      if(updationResult.matchedCount === 0){
         return res.status(404).json({message:"Task not found",success:false});
      }     
      console.log("Task cleared",updationResult);
      return res.status(200).json({message:"task cleared successfully",success:true});
    }
    catch(err){
      console.log(err);
      return res.status(500).json({message:"error occured while updating the task",success:false});
    }
}

export {addTask,getTask,updateTask,deleteTask,clearTask};
