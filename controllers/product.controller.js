const APIError = require("../helpers/APIError");
const resPattern = require("../helpers/resPattern");
const httpStatus = require("http-status");
const db = require("../server");
const productColl = db.collection("product");
const query = require("../query/query");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const { ObjectID } = require("mongodb");

const createProduct = async (req, res, next) => {
  try {

    const requestdata = { productNo: req.body.productNo };

    const product = await query.findOne(productColl, requestdata);
    if (product) {
      const message = `Already have this product`;
      return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
    } else {
      const user = req.body;
      user.status = 0;
      
      const insertdata = await query.insert(productColl, product);
      if (insertedData.acknowledged) {
        const obj = resPattern.successPattern(
          httpStatus.OK,
          insertdata,
          `success`
        );
      } else {
        const message = `Something went wrong, Please try again.`;
        return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
      }
    }
}
   catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
  };


  module.exports = {
    createProduct,
  };