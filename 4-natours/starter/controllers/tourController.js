const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const mockDataFilePath = path.resolve("dev-data/data/tours-simple.json");

const tours = JSON.parse(fs.readFileSync(mockDataFilePath));

const checkIdMiddleware = (req, res, next, value) => {
  const tour = tours.find(({ id }) => +value === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found!"
    });
  }

  next();
};

const validateBodyMiddleware = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.number(),
    maxGroupSize: Joi.number(),
    difficulty: Joi.string(),
    ratingsAverage: Joi.number(),
    ratingsQuantity: Joi.number(),
    summary: Joi.string(),
    description: Joi.string(),
    imageCover: Joi.string(),
    images: Joi.array().items(Joi.string()),
    startDates: Joi.array().items(Joi.string())
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message
    });
  }

  next();
};

class TourController {
  getAllTours(req, res) {
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours }
    });
  }

  getTour(req, res) {
    const tour = tours.find(({ id }) => +req.params.id === id);

    res.status(200).json({
      status: "success",
      data: { tour }
    });
  }

  updateTour(req, res) {
    const tour = tours.find(({ id }) => +req.params.id === id);

    const updatedTour = {
      ...tour,
      ...req.body
    };

    const newTours = [
      ...tours.filter(({ id }) => +req.params.id !== id),
      updatedTour
    ];

    fs.writeFile(mockDataFilePath, JSON.stringify(newTours), () => {
      res.status(201).json({
        status: "success",
        data: { tour: updatedTour }
      });
    });
  }

  deleteTour(req, res) {
    const newTours = tours.filter(({ id }) => +req.params.id !== id);

    fs.writeFile(mockDataFilePath, JSON.stringify(newTours), () => {
      res.status(204).json({
        status: "success",
        data: null
      });
    });
  }

  createTour(req, res) {
    const newTour = {
      ...req.body,
      id: tours[tours.length - 1].id + 1
    };
    tours.push(newTour);
    fs.writeFile(mockDataFilePath, JSON.stringify(tours), () => {
      res.status(201).json({
        status: "success",
        data: { tour: newTour }
      });
    });
  }
}

module.exports = {
  TourController: new TourController(),
  checkIdMiddleware,
  validateBodyMiddleware
};
