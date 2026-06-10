const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAdminAnalytics } = require("../controllers/analyticsController.js");

const router = express.Router();

router.get("/", protect, admin, getAdminAnalytics);

module.exports = router;