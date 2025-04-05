const {getAllEmployee,
    updateEmployee,
    deleteEmployee} = require('../Controller/EmployeeController');
const express = require('express');
const router = express.Router();

router.get("/",getAllEmployee);
router.patch("/:id",updateEmployee);
router.delete("/:id",deleteEmployee);

module.exports = router;