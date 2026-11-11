import { Router } from "express";
import {
  getProjectNotes,
  createProjectNote,
  getProjectNoteById,
  updateProjectNote,
  deleteProjectNote,
} from "../controllers/projectNote.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectNoteValidator,
  updateProjectNoteValidator,
} from "../validators/index.js";
import {
  verifyJwt,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJwt);

router
  .route("/:projectId")
  .get(getProjectNotes)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectNoteValidator(),
    validate,
    createProjectNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(getProjectNoteById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateProjectNoteValidator(),
    validate,
    updateProjectNote,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProjectNote);

export default router;
