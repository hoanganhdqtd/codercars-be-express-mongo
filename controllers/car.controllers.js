const { sendResponse, AppError } = require("../helpers/utils.js");

const mongoose = require("mongoose");
const Car = require("../models/Car");

const carController = {};

//Create a car
carController.createCar = async (req, res, next) => {
  //in real project you will getting info from req
  try {
    //always remember to control your inputs
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    ) {
      throw new Error("Missing required info!");
    }

    // const newCar = await new Car({}).save();
    const newCar = await Car.create({
      make,
      model,
      release_date,
      transmission_type,
      size,
      style,
      price,
    });

    return res
      .status(200)
      .send({ message: "Create Car Successfully!", car: newCar });
  } catch (err) {
    // res.status(400).send({ message: err.message });
    next(err);
  }
};

//Get all cars
carController.getCars = async (req, res, next) => {
  //in real project you will getting condition from req then construct the filter object for query
  // empty filter mean get all
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;
    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Car.countDocuments({ isDeleted: false });
    console.log("cars:", cars);
    return res.status(200).json({
      message: "Get Car List Successfully!",
      data: { cars, total: Math.ceil(total / limit), page },
    });
  } catch (err) {
    // res.status(400).send({ message: err.message });
    next(err);
  }
};

//Update a car
carController.editCar = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  //you will also get updateInfo from req
  // empty target and info mean update nothing
  // const targetId = null;
  // const updateInfo = "";

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  // const options = { new: true, runValidators: true };
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");

    //mongoose query
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { ...req.body },
      options
    );

    if (!updatedCar) {
      throw new Error("Car not found!");
    }
    return res
      .status(200)
      .send({ message: "Update Car Successfully!", updatedCar });
  } catch (err) {
    // res.status(400).send({ message: err.message });
    next(err);
  }
};

//Delete car
carController.deleteCar = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

  // empty target mean delete nothing
  // const targetId = null;

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  // const options = { new: true, runValidators: true };

  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid ID");
    }

    //mongoose query
    const deletedCar = await Car.findByIdAndDelete(
      id,
      { isDeleted: true },
      options
    );
    if (!deletedCar) {
      throw new Error("Car not found!");
    }

    sendResponse(
      res,
      200,
      true,
      { car: deletedCar },
      null,
      "Delete Car Successfully!"
    );
  } catch (err) {
    // res.status(400).send({ message: err.message });
    next(err);
  }
};

//export
module.exports = carController;
