const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const mockDataFilePath = path.resolve("dev-data/data/users.json");

const users = JSON.parse(fs.readFileSync(mockDataFilePath));

const checkIdMiddleware = (req, res, next, value) => {
  const user = users.find(({ _id }) => value === _id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found!"
    });
  }

  next();
};

const validateBodyMiddleware = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
    role: Joi.string(),
    active: Joi.boolean(),
    photo: Joi.string(),
    password: Joi.string()
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

class UserController {
  getAllUsers(req, res) {
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users }
    });
  }

  createUser(req, res) {
    const newUser = {
      ...req.body,
      id: users[users.length - 1]._id + 1
    };
    users.push(newUser);
    fs.writeFile(mockDataFilePath, JSON.stringify(users), () => {
      res.status(201).json({
        status: "success",
        data: { user: newUser }
      });
    });
  }

  getUser(req, res) {
    const user = users.find(({ _id }) => req.params.id === _id);

    res.status(200).json({
      status: "success",
      data: { user }
    });
  }

  updateUser(req, res) {
    const user = users.find(({ _id }) => req.params.id === _id);

    const updatedUser = {
      ...user,
      ...req.body
    };

    const newUsers = [
      ...users.filter(({ _id }) => req.params.id !== _id),
      updatedUser
    ];

    fs.writeFile(mockDataFilePath, JSON.stringify(newUsers), () => {
      res.status(201).json({
        status: "success",
        data: { user: updatedUser }
      });
    });
  }

  deleteUser(req, res) {
    const newUsers = users.filter(({ _id }) => req.params.id !== _id);

    fs.writeFile(mockDataFilePath, JSON.stringify(newUsers), () => {
      res.status(204).json({
        status: "success",
        data: null
      });
    });
  }
}

module.exports = {
  UserController: new UserController(),
  checkIdMiddleware,
  validateBodyMiddleware
};
