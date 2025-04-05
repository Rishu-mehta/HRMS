const express = require("express");
const router = express.Router();
const userRouter = require("../Routes/UserRoute");
const candidateRouter = require("../Routes/CandidateRoute");
const employeeRouter = require("../Routes/EmployeeRoute");

router.use("/user", userRouter);
router.use("/candidate",candidateRouter);
router.use("/employee",employeeRouter);

module.exports = router;  