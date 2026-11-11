import { Project } from "../models/projects.model.js";
import { Tasks } from "../models/task.model.js";
import { SubTask } from "../models/subTask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const tasks = await Tasks.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully."));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Tasks.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status: status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully."));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Tasks.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assinedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBY",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully."));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    throw new ApiError(400, "Invalid project or task ID.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const task = await Tasks.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  // Perform the update logic here
  const updatedTask = await Tasks.findByIdAndUpdate(taskId, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully."));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    throw new ApiError(400, "Invalid project or task ID.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const task = await Tasks.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully."));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, isCompleted } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const task = await Tasks.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const subTask = await SubTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    isCompleted: isCompleted || false,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "Sub-task created successfully."));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(subTaskId)
  ) {
    throw new ApiError(400, "Invalid project or sub-task ID.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId });

  if (!subTask) {
    throw new ApiError(404, "Sub-task not found.");
  }

  const task = await Tasks.findOne({
    _id: subTask.task,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Sub-task not found in this project.");
  }

  // Perform the update logic here
  const updatedSubTask = await SubTask.findByIdAndUpdate(subTaskId, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSubTask, "Sub-task updated successfully."),
    );
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(subTaskId)
  ) {
    throw new ApiError(400, "Invalid project or sub-task ID.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId });

  if (!subTask) {
    throw new ApiError(404, "Sub-task not found.");
  }

  const task = await Tasks.findOne({
    _id: subTask.task,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Sub-task not found in this project.");
  }

  await subTask.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Sub-task deleted successfully."));
});

export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
