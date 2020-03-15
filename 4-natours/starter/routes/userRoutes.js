const { Router } = require("express");
const {
  UserController,
  checkIdMiddleware,
  validateBodyMiddleware
} = require("../controllers/userController");

const router = Router();

router.param("id", checkIdMiddleware);

router
  .route("/")
  .get(UserController.getAllUsers)
  .post(validateBodyMiddleware, UserController.createUser);

router
  .route("/:id")
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
