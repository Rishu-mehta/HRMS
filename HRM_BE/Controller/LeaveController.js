const Leave = require("../Models/LeaveModel");
const Attendance = require("../Models/AttendenceModel");


exports.addLeave = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { employee, date, designation, document, reason } = req.body;


    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    if (attendance.status !== "present") {
      return res.status(400).json({ error: "Leave can only be added if employee is present" });
    }

    const leave = new Leave({
      employee,
      attendance: attendanceId,
      date,
      designation,
      document,
      reason,
    });

    await leave.save();
    res.status(201).json({ message: "Leave added successfully", leave });
  } catch (error) {
    res.status(500).json({ error: "Failed to add leave", details: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee attendance");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["approved", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    res.status(200).json({ message: "Leave status updated", leave });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.getPresentEmployees = async (req, res) => {
  try {
    const present = await Attendance.find({ status: "present" }).populate("candidate");
    res.status(200).json(present);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch present employees" });
  }
};
