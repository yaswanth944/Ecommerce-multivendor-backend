const express = require("express");
const firmcontroller = require("../controllers/Firmcontroller"); // Ensure correct import
const verifyToken = require("../middlewares/verifytoken");

const router = express.Router();

// Correct function reference
router.post("/add-firm", verifyToken, firmcontroller.addFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headersSent('content-Type',image/jpge);
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
});

router.delete('/:firmId',firmcontroller.deleteFirmById)


module.exports = router;
