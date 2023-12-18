import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import './tableStyles.css'; // CSS file import
import UserInfoModal from './userInfoModal';
interface UserData {
  id: number;
  username: string;
  email: string;
  status: boolean;
  role_id: number;
  birthDay: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
}

interface Props {
  blogs: UserData[];
  customFunction: () => void;
}
const getRoleName = (role_id: number): string => {
  return role_id === 1 ? 'Nhà tuyển dụng' : role_id === 2 ? 'Người dùng' : '';
};
const Apptable: React.FC<Props> = (props) => {
  const { blogs, customFunction } = props;
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  // console.log("checkBlog: ", blogs);

  const handleUserNameClick = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleButtonEvent = (e: React.MouseEvent, blog: UserData) => {
    e.stopPropagation(); // Prevents the row click event from being triggered
    const userConfirmed = window.confirm(`Bạn có chắc khóa tài khoản ${blog.username}`);
    if (!userConfirmed) {
      return; // User canceled the deletion
    }
    console.log(`Bạn có chắc khóa tài khoản ${blog.username}`);
  };

  const handleButtonEvent2 = (e: React.MouseEvent, blog: UserData) => {
    e.stopPropagation(); // Prevents the row click event from being triggered
    const userConfirmed = window.confirm(`Bạn có chắc mở khóa tài khoản ${blog.username}`);
  
    if (!userConfirmed) {
      return; // User canceled the deletion
    }
    console.log(`Bạn có chắc mở khóa tài khoản ${blog.username}`);
  };
  return (
    <>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Chức vụ</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={index} onClick={() => handleUserNameClick(blog)}>
              <td>{index + 1}</td>
              <td>{blog.username}</td>
              <td>{blog.email}</td>
              <td>{blog.phoneNumber}</td>
              <td>{getRoleName(blog.role_id)}</td>
              <td>
                {blog.status ? (
                  <Button className="button-success" onClick={(e) => handleButtonEvent(e, blog)}>Active</Button>
                ) : (
                  <Button className="button-danger" onClick={(e) => handleButtonEvent2(e, blog)}>Inactive</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <UserInfoModal user={selectedUser} show={selectedUser !== null} handleClose={handleCloseModal} />
    </>
  );
};

export default Apptable;
