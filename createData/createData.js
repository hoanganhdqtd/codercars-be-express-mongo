// const fs = require("fs");
const csv = require("csvtojson");
require("dotenv").config();

const mongoose = require("mongoose");
const Car = require("../models/Car");
/* DB connection*/
const mongoURI = "mongodb://localhost:27017/template";

mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected ${mongoURI}`))
  .catch((err) => console.log(err));

const createData = async () => {
  let newData = await csv().fromFile("data.csv");

  // array of Cars
  // console.log("newData", newData);

  newData = new Set(newData);
  newData = Array.from(newData);

  // console.log("newData", newData);
  let index = 0;

  newData = newData.forEach((car) => {
    Car.create({
      make: car.Make,
      model: car.Model,
      release_date: car.Year,
      transmission_type: car["Transmission Type"],
      size: car["Vehicle Size"],
      style: car["Vehicle Style"],
      price: car.MSRP,
    });
  });

  // console.log("newData", newData);
  // const cars = { data: newData, totalCars: newData.length };

  // save data to db.json
  // fs.writeFileSync("../db.json", JSON.stringify(newData));
  // fs.writeFileSync("../cars.json", JSON.stringify(cars));

  console.log("done");
};

createData();
