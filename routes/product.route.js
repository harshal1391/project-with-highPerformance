const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");

router.route("/create-product").post(productCtrl.createProduct);

module.exports = router;
