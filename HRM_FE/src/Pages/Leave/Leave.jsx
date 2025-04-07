import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, FileText, ChevronDown } from 'lucide-react';
import './Leaves.css';
import LeaveModal from '../../Modals/LeaveModal';


// Sample data
const initialLeaves = [
    {
        id: 1,
        name: "Rishu",
        position: "Backend Developer",
        date: "05/04/25",
        reason: "Sick Leave",
        status: "Approved",
        hasDocuments: false
    },
    {
        id: 2,
        name: "Shivam",
        position: "Full Time Designer",
        date: "04/04/25",
        reason: "Visiting House",
        status: "Pending",
        hasDocuments: true
    }
];

const Leave = () => {
    const [leaves, setLeaves] = useState(initialLeaves);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Get approved leaves for the selected date
    const getApprovedLeaves = () => {
        if (!selectedDate) return [];

        const formattedSelectedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear().toString().substr(-2)}`;

        return leaves.filter(leave => {
            const [day, month, year] = leave.date.split('/');
            const leaveDate = `${parseInt(day)}/${parseInt(month)}/${year}`;
            return leave.status === "Approved" && leaveDate === formattedSelectedDate;
        });
    };

    // Get leaves for calendar display
    const getLeavesForCalendar = () => {
        const leavesMap = {};

        leaves.forEach(leave => {
            const [day, month, year] = leave.date.split('/');
            if (parseInt(month) === currentDate.getMonth() + 1 &&
                year === currentDate.getFullYear().toString().substr(-2)) {
                if (!leavesMap[parseInt(day)]) {
                    leavesMap[parseInt(day)] = [];
                }
                leavesMap[parseInt(day)].push(leave);
            }
        });

        return leavesMap;
    };

    // Function to change leave status
    const changeLeaveStatus = (id, newStatus) => {
        setLeaves(prevLeaves =>
            prevLeaves.map(leave =>
                leave.id === id ? { ...leave, status: newStatus } : leave
            )
        );
    };

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Format date for display
    const formatMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Build calendar grid
    const buildCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const leavesMap = getLeavesForCalendar();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="lm-calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            const hasLeaves = leavesMap[day] && leavesMap[day].length > 0;
            const leaveCount = hasLeaves ? leavesMap[day].length : 0;

            days.push(
                <div
                    key={`day-${day}`}
                    className={`lm-calendar-day ${isSelected ? 'selected' : ''} ${hasLeaves ? 'has-leaves' : ''}`}
                    onClick={() => setSelectedDate(dayDate)}
                >
                    {day}
                    {hasLeaves && (
                        <span className="lm-leave-indicator">{leaveCount}</span>
                    )}
                </div>
            );
        }

        return days;
    };

    // Filter leaves based on status
    const filteredLeaves = statusFilter === "All"
        ? leaves
        : leaves.filter(leave => leave.status === statusFilter);

    return (
        <div className="lm-container candidate-page">
            <div className="lm-list-container">
                <div className="lm-header">
                    <div className="lm-filter-container">
                        <div className="lm-status-dropdown" onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}>
                            <span>Status</span>
                            <ChevronDown size={16} />
                            {isStatusDropdownOpen && (
                                <div className="lm-status-options">
                                    <div onClick={() => setStatusFilter("All")}>All</div>
                                    <div onClick={() => setStatusFilter("Approved")}>Approved</div>
                                    <div onClick={() => setStatusFilter("Pending")}>Pending</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="lm-search-container">
                        <input type="text" placeholder="Search" className="lm-search-input" />
                    </div>
                    <button onClick={() =>setIsModalOpen(true)}className="lm-add-btn">Add Leave</button>
                </div>
            </div>
           <div className="lm-bottom">
            <div className="lm-applied-leaves">
                <h2>Applied Leaves</h2>
                <div className="lm-table">
                    <div className="lm-table-header">
                        <div className="lm-header-cell profile">Profile</div>
                        <div className="lm-header-cell name">Name</div>
                        <div className="lm-header-cell date">Date</div>
                        <div className="lm-header-cell reason">Reason</div>
                        <div className="lm-header-cell status">Status</div>
                        <div className="lm-header-cell docs">Docs</div>
                    </div>

                    <div className="lm-table-body">
                        {filteredLeaves.map(leave => (
                            <div key={leave.id} className="lm-table-row">
                                <div className="lm-cell profile">
                                    <div className="lm-avatar">
                                        {leave.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="lm-cell name">
                                    <div className="lm-name">{leave.name}</div>
                                    <div className="lm-position">{leave.position}</div>
                                </div>
                                <div className="lm-cell date">{leave.date}</div>
                                <div className="lm-cell reason">{leave.reason}</div>
                                <div className="lm-cell status">
                                    <div className={`lm-status-badge ${leave.status.toLowerCase()}`} onClick={() => {
                                        const newStatus = leave.status === "Approved" ? "Pending" : "Approved";
                                        changeLeaveStatus(leave.id, newStatus);
                                    }}>
                                        {leave.status} <ChevronDown size={16} />
                                    </div>
                                </div>
                                <div className="lm-cell docs">
                                    {leave.hasDocuments && <FileText size={18} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="lm-calendar-container">
                <h2>Leave Calendar</h2>
                <div className="lm-calendar-header">
                    <button className="lm-month-nav" onClick={prevMonth}>
                        <ChevronLeft size={16} />
                    </button>
                    <div className="lm-current-month">{formatMonthYear(currentDate)}</div>
                    <button className="lm-month-nav" onClick={nextMonth}>
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="lm-calendar-grid">
                    <div className="lm-weekday">S</div>
                    <div className="lm-weekday">M</div>
                    <div className="lm-weekday">T</div>
                    <div className="lm-weekday">W</div>
                    <div className="lm-weekday">T</div>
                    <div className="lm-weekday">F</div>
                    <div className="lm-weekday">S</div>

                    {buildCalendarDays()}
                </div>

                <div className="lm-approved-section">
                    <h3>Approved Leaves</h3>
                    <div className="lm-approved-list">
                        {selectedDate ? (
                            getApprovedLeaves().length > 0 ? (
                                getApprovedLeaves().map(leave => (
                                    <div key={leave.id} className="lm-approved-item">
                                        <div className="lm-avatar">
                                            {leave.name.charAt(0)}
                                        </div>
                                        <div className="lm-details">
                                            <div className="lm-name">{leave.name}</div>
                                            <div className="lm-position">{leave.position}</div>
                                        </div>
                                        <div className="lm-date">{leave.date}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="lm-no-leaves">No approved leaves for this date</div>
                            )
                        ) : (
                            <div className="lm-no-date-selected">Select a date to view approved leaves</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <LeaveModal
        onClose={() => {setIsModalOpen(false)}}
        isOpen={isModalOpen}
        onSave={() => {}}

        />
        </div>
    );
}

export default Leave;