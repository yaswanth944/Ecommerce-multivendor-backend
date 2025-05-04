const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization; // ✅ Get "Authorization" header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token is required" });
    }

    const token = authHeader.split(" ")[1]; // ✅ Extract token after "Bearer"
    
    try {
        const decoded = jwt.verify(token, secretKey);
        req.vendorId = decoded.vendorId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;
