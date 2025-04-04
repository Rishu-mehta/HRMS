import React from 'react';
import { MoreVertical } from 'lucide-react';
import './Employee.css';

const Employees = () => {
  // Sample employee data
  const employees = [
    {
      id: 1,
      name: 'Jane Copper',
      email: 'jane.copper@example.com',
      phone: '(704) 555-0127',
      position: 'Intern',
      department: 'Designer',
      joinDate: '10/06/13',
      avatar: '/avatars/jane.jpg'
    },
    {
      id: 2,
      name: 'Arlene McCoy',
      email: 'arlene.mccoy@example.com',
      phone: '(302) 555-0107',
      position: 'Full Time',
      department: 'Designer',
      joinDate: '11/07/16',
      avatar: '/avatars/arlene.jpg'
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'deanna.curtis@example.com',
      phone: '(252) 555-0126',
      position: 'Senior',
      department: 'Backend Development',
      joinDate: '08/15/17',
      avatar: '/avatars/cody.jpg'
    },
    {
      id: 4,
      name: 'Janney Wilson',
      email: 'janney.wilson@example.com',
      phone: '(252) 555-0126',
      position: 'Junior',
      department: 'Backend Development',
      joinDate: '12/04/17',
      avatar: '/avatars/janney.jpg'
    },
    {
      id: 5,
      name: 'Leslie Alexander',
      email: 'willie.jennings@example.com',
      phone: '(207) 555-0119',
      position: 'Team Lead',
      department: 'Human Resource',
      joinDate: '05/30/14',
      avatar: '/avatars/leslie.jpg'
    }
  ];

  return (
    <div className="employees-container">
      <div className="employees-table">
        <div className="table-header">
          <div className="header-cell profile">Profile</div>
          <div className="header-cell name">Employee Name</div>
          <div className="header-cell email">Email Address</div>
          <div className="header-cell phone">Phone Number</div>
          <div className="header-cell position">Position</div>
          <div className="header-cell department">Department</div>
          <div className="header-cell join-date">Date of Joining</div>
          <div className="header-cell action">Action</div>
        </div>
        
        <div className="table-body">
          {employees.map(employee => (
            <div key={employee.id} className="table-row">
              <div className="cell profile">
                <div className="employee-avatar">
                  <img src={employee.avatar} alt={employee.name} />
                </div>
              </div>
              <div className="cell name">{employee.name}</div>
              <div className="cell email">{employee.email}</div>
              <div className="cell phone">{employee.phone}</div>
              <div className="cell position">{employee.position}</div>
              <div className="cell department">{employee.department}</div>
              <div className="cell join-date">{employee.joinDate}</div>
              <div className="cell action">
                <button className="action-button">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;