import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMemberToProjectValidator,
} from "../validators/index.js";
import {
  verifyJwt,
  validatePorjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJwt);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(validatePorjectPermission(AvailableUserRole), getProjectById)
  .put(
    validatePorjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validatePorjectPermission([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validatePorjectPermission([UserRolesEnum.ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validatePorjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
  .delete(validatePorjectPermission([UserRolesEnum.ADMIN]), deleteMember);

export default router;
