const { Router } = require("express");
const {
  TourController,
  checkIdMiddleware,
  validateBodyMiddleware
} = require("../controllers/tourController");

const router = Router();

router.param("id", checkIdMiddleware);

router
  .route("/")
  .get(TourController.getAllTours)
  .post(validateBodyMiddleware, TourController.createTour);

router
  .route("/:id")
  .get(TourController.getTour)
  .patch(TourController.updateTour)
  .delete(TourController.deleteTour);

module.exports = router;
