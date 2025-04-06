const express = require("express");
const router = express.Router();
const leaveController = require("../Controller/LeaveController");


router.get("/present-employees", leaveController.getPresentEmployees);


router.post("/add/:attendanceId", leaveController.addLeave);


router.get("/", leaveController.getAllLeaves);

router.patch("/:leaveId/status", leaveController.updateLeaveStatus);

module.exports = router;
