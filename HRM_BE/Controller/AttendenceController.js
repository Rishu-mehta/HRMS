const Attendence = require("../Models/AttendenceModel");
const Candidate = require("../Models/CandidateModel");

// Fetch attendance records with candidate details
const getAttendenceWithCandidate = async (req, res) => {
  try {
    // Fetch only selected employees
    const employees = await Candidate.find({ status: "selected" }).select(
      "fullName email phoneNumber position experience"
    );

    // Fetch all attendance records
    const attendenceRecords = await Attendence.find().populate(
      "candidate",
      "fullName email phoneNumber position experience"
    );

    const attendanceMap = new Map();
    attendenceRecords.forEach((record) => {
      if (record.candidate && record.candidate._id) {
        attendanceMap.set(record.candidate._id.toString(), record);
      }
    });

    // Merge employees with attendance data
    const result = employees.map((employee) => {
      const attendance = attendanceMap.get(employee._id.toString());
      return {
        employee: {
          _id: employee._id,
          fullName: employee.fullName,
          email: employee.email,
          phoneNumber: employee.phoneNumber ,
          position: employee.position,
          experience: employee.experience,
        },
        attendance: attendance
          ? {
              task: attendance.task,
              status: attendance.status,
            }
          : {
              task: "No task assigned",
              status: "No attendance recorded",
            },
      };
    });

    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAttendence = async (req, res) => {
  const { id } = req.params; 
  const { task, status } = req.body; 

  try {
    // Find the employee in the Candidate table
    const employee = await Candidate.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if an attendance record already exists for this employee
    let attendanceRecord = await Attendence.findOne({ candidate: id });

    if (attendanceRecord) {
      // Update the existing attendance record
      attendanceRecord.task = task || attendanceRecord.task;
      attendanceRecord.status = status || attendanceRecord.status;
      await attendanceRecord.save();
    } else {
      // Create a new attendance record for the employee
      attendanceRecord = await Attendence.create({
        candidate: id,
        task: task || "No task assigned",
        status: status || "No attendance recorded",
      });
    }

    // Send the updated or newly created attendance record as a response
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAttendenceWithCandidate,
  updateAttendence,
};
