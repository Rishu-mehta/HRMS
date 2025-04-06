const express = require("express");
const router = express.Router();
const userRouter = require("./UserRoute");
const candidateRouter = require("./CandidateRoute");
const employeeRouter = require("./EmployeeRoute");
const leaveRouter = require("./LeaveRoute");

router.use("/user", userRouter);
router.use("/candidate",candidateRouter);
router.use("/employee",employeeRouter);
router.use("/leave",leaveRouter);

module.exports = router;  