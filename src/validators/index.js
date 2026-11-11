import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatues } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("fullname").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email invalid"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid."),
    body("role")
      .notEmpty()
      .withMessage("Role is required.")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid."),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(AvailableTaskStatues)
      .withMessage("Status is invalid"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title").optional().notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatues)
      .withMessage("Status is invalid"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  ];
};

const createSubTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean value"),
  ];
};

const updateSubTaskValidator = () => {
  return [
    body("title").optional().notEmpty().withMessage("Title is required"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean value"),
  ];
};

const createProjectNoteValidator = () => {
  return [
    body("content").apply().notEmpty().withMessage("Content is required"),
  ];
};

const updateProjectNoteValidator = () => {
  return [
    body("content").optional().notEmpty().withMessage("Content is required"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMemberToProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  createProjectNoteValidator,
  updateProjectNoteValidator,
};
