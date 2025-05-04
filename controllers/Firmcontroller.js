const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : null; // ✅ Handle missing image

        console.log("Vendor ID from request:", req.vendorId); // Debugging

        // 🔹 Ensure req.vendorId is being passed correctly from verifyToken
        if (!req.vendorId) {
            return res.status(403).json({ error: "Unauthorized: Token missing or invalid" });
        }

        // Find vendor
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Create new firm
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id,
        });

        const savedFirm=await firm.save();
        vendor.firm.push(savedFirm._id);  
  
        await vendor.save();       
        return res.status(201).json({ message: "Firm added successfully", firm });
    } catch (error) {
        console.error("Error in addFirm:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteFirmById= async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if (!deletedFirm) {
          return res.status(404).json({ error: "Internal server error" });
        }
      } catch (error) {
        console.error("Error in deleting firm:", error.message);
    
        res.status(500).json({ error: "Internal server error" });
      }
};

module.exports = { addFirm: [upload.single("image"), addFirm],deleteFirmById };