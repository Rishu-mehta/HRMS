const express = require("express");
const router = express.Router();
const userRouter = require("../Routes/UserRoute");
const candidateRouter = require("../Routes/CandidateRoute");

router.use("/user", userRouter);
router.use("/candidate",candidateRouter);

module.exports = router;  