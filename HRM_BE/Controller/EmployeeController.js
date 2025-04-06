const employeeModel = require("../Models/CandidateModel");

const getAllEmployee = async (req,res) => {
  try {
    const employees = await employeeModel.find({ status: [/^selected$/i] }).sort({ createdAt: -1 });
   
    
        res.status(200).json({
            success: true,
            employees: employees
        })
    
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};


const updateEmployee=async(req    ,res)=>{
    const { id } = req.params;
    const { email,fullName,position,phoneNumber,profile, department, dateofjoining } = req.body;
    try {
        const employee = await employeeModel.findByIdAndUpdate(id, {
            email,
            fullName,
            position,
            phoneNumber,
            profile,
            department,
            dateofjoining
        }, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteEmployee=async(req,res)=>{
    try {
        const employee = await employeeModel.findByIdAndDelete(req.params.id);
        if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

module.exports={
    getAllEmployee,
    updateEmployee,
    deleteEmployee
}