import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Search } from 'lucide-react';

const LeaveModal = ({ isOpen, onClose, onSave, presentEmployees }) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        attendanceId: '',
        designation: '',
        leavedate: '',
        document: null,
        reason: '',
    });
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    const fileInputRef = useRef(null);
    const employeeInputRef = useRef(null);

    // Reset form data when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                employeeId: '',
                employeeName: '',
                attendanceId: '',
                designation: '',
                leavedate: '',
                document: null,
                reason: '',
            });
            setFilteredEmployees(presentEmployees);
        }
    }, [isOpen, presentEmployees]);

    const handleClose = () => {
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'document') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else if (name === 'employeeName') {
            setFormData(prev => ({ ...prev, [name]: value }));
            // Filter employees based on search input
            const filtered = presentEmployees.filter(emp => 
                emp.candidate?.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEmployeeSelect = (employee) => {
        setFormData(prev => ({
            ...prev,
            employeeId: employee.candidate?._id || '',
            employeeName: employee.candidate?.name || '',
            attendanceId: employee._id || '',
            designation: employee.candidate?.jobTitle || '',
        }));
        setShowEmployeeDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (employeeInputRef.current && !employeeInputRef.current.contains(event.target)) {
                setShowEmployeeDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="candidate-modal">
                <div className="modal-header">
                    <div></div>
                    <h2>Add New Leave</h2>
                    <button className="close-button" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            {/* Employee Name with Search Icon and Dropdown */}
                            <div style={{ position: 'relative', marginBottom: '1rem' }} ref={employeeInputRef}>
                                <input
                                    type="text"
                                    name="employeeName"
                                    placeholder="Search Employee Name*"
                                    style={{
                                        width: '100%',
                                        padding: '10px 8px 10px 32px',
                                        border: '1px solid #ccc',
                                        borderRadius: '12px',
                                    }}
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    onClick={() => setShowEmployeeDropdown(true)}
                                    required
                                />
                                <Search
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '10px',
                                        transform: 'translateY(-50%)',
                                        color: '#888',
                                        pointerEvents: 'none',
                                    }}
                                />
                                
                                {/* Employee Dropdown */}
                                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        zIndex: 1000,
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {filteredEmployees.map(employee => (
                                            <div 
                                                key={employee._id}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                onClick={() => handleEmployeeSelect(employee)}
                                            >
                                                <div style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    background: '#f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '8px'
                                                }}>
                                                    {employee.candidate?.name ? employee.candidate.name.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{employee.candidate?.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{employee.candidate?.jobTitle || 'No title'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Designation */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="Designation*"
                                    className="form-input"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Leave Date */}
                            <div className="form-group">
                                <input
                                    type="date"
                                    name="leavedate"
                                    className="form-input"
                                    value={formData.leavedate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Document Upload with Upload Icon */}
                            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="document"
                                    accept=".pdf, .png, .jpg, .jpeg, .doc, .docx"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                                <div
                                    onClick={triggerFileUpload}
                                    style={{
                                        width: '100%',
                                        padding: '8px 8px 8px 32px',
                                        border: '1px solid #ccc',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    {formData.document ? formData.document.name : 'Upload Document'}
                                    <Upload
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '10px',
                                            transform: 'translateY(-50%)',
                                            color: '#888',
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Reason */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="reason"
                                    placeholder="Reason*"
                                    className="form-input"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="submit"
                            className='save-button'
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveModal;