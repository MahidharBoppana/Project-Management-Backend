import { Project } from "../models/projects.model.js";
import { ProjectNote } from "../models/notes.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjectNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const notes = await ProjectNote.find({ project: projectId }).populate(
    "createdBy",
    "fullName username email avatar",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Project notes fetched successfully."));
});

const createProjectNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID.");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const newNote = await ProjectNote.create({
    project: projectId,
    createdBy: req.user._id,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newNote, "Project note created successfully."));
});

const getProjectNoteById = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(noteId)
  ) {
    throw new ApiError(400, "Invalid project ID or note ID.");
  }

  const note = await ProjectNote.findOne({
    _id: noteId,
    project: projectId,
  }).populate("createdBy", "fullName username email avatar");

  if (!note) {
    throw new ApiError(404, "Project note not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Project note fetched successfully."));
});

const updateProjectNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { content } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(noteId)
  ) {
    throw new ApiError(400, "Invalid project ID or note ID.");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required.");
  }

  const note = await ProjectNote.findOne({ _id: noteId, project: projectId });

  if (!note) {
    throw new ApiError(404, "Project note not found.");
  }

  // Check if the user is the creator of the note or has admin role
  if (
    !note.createdBy.equals(req.user._id) &&
    req.user.role !== UserRolesEnum.ADMIN
  ) {
    throw new ApiError(403, "You are not authorized to update this note.");
  }

  const updatedNote = await ProjectNote.findByIdAndUpdate(
    noteId,
    { content: content.trim() },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedNote, "Project note updated successfully."),
    );
});

const deleteProjectNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(noteId)
  ) {
    throw new ApiError(400, "Invalid project ID or note ID.");
  }

  const note = await ProjectNote.findOne({ _id: noteId, project: projectId });

  if (!note) {
    throw new ApiError(404, "Project note not found.");
  }

  // Check if the user is the creator of the note or has admin role

  if (
    !note.createdBy.equals(req.user._id) &&
    req.user.role !== UserRolesEnum.ADMIN
  ) {
    throw new ApiError(403, "You are not authorized to delete this note.");
  }

  await ProjectNote.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project note deleted successfully."));
});

export {
  getProjectNotes,
  createProjectNote,
  getProjectNoteById,
  updateProjectNote,
  deleteProjectNote,
};
