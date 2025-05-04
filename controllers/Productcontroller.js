const { request } = require("express");
const Product = require("../models/Product");
const Firm = require("../models/Firm");
const path = require("path");

const multer = require("multer");
const { error } = require("console");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }
    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in addproduct:", error.message);

    res.status(500).json({ error: "Internal server error" });
  }
};
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }
    const restaurantName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error in deleting product:", error.message);

    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm, deleteProductById
};
