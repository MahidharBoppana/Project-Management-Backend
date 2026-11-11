import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
} from "../validators/index.js";
import {
  verifyJwt,
  validatePorjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJwt);

router
  .route("/:projectId")
  .get(getTasks)
  .post(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(getTaskById)
  .put(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createSubTaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/t/:taskId/st/:subTaskId")
  .put(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    updateSubTaskValidator(),
    validate,
    updateSubTask,
  )
  .delete(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    deleteSubTask,
  );
