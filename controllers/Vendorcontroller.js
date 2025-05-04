const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const dotenv = require("dotenv");

dotenv.config();

// ✅ Renamed to a meaningful variable & added a fallback
const secretKey = process.env.SECRET_KEY || "fallbackSecretKey"; 

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const vendoremail = await Vendor.findOne({ email });
        if (vendoremail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new vendor
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });

        await newVendor.save();
        res.status(201).json({ message: "Vendor registered successfully" });
        console.log("Vendor registered:", email);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find vendor by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({ success: "Login successful", token });
        console.log(email, "Token generated:", token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllVendors=async(req,res)=>{
    try {
        const vendors= await Vendor.find().populate('firm');
        res.json({vendors})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
};
const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;
    try {
        const vendor=await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor not found" })
        }
        res.status(200).json({vendor})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
};

module.exports = { vendorRegister, vendorLogin,getAllVendors,getVendorById };