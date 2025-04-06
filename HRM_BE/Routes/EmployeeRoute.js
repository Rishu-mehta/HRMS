const {
    getAttendenceWithCandidate, // Destructure the function
    updateAttendence,
  } = require("../Controller/AttendenceController");
  
  const {
    getAllEmployee,
    updateEmployee,
    deleteEmployee,
  } = require("../Controller/EmployeeController");
  
  const express = require("express");
  const router = express.Router();
  
  router.get("/", getAllEmployee);
  router.patch("/:id", updateEmployee);
  router.delete("/:id", deleteEmployee);
  
  router.get("/attendance", getAttendenceWithCandidate);
  router.patch("/attendance/:id", updateAttendence);
  
  module.exports = router;
  