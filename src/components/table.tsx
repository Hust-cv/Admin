import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import './tableStyles.css'; // CSS file import
import UserInfoModal from './userInfoModal';
import { getCookie } from '@/getCookie/getCookie';

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

interface FilterState {
  username: string;
  email: string;
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
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // State cho bộ lọc
  const [filters, setFilters] = useState<FilterState>({
    username: '',
    email: '',
    phoneNumber: '',
  });

  // Hàm cập nhật giá trị bộ lọc
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

// Định nghĩa trước endpoint của API
const API_ENDPOINT = 'http://localhost:6868/api/admin';

// Hàm xử lý khi nhấn tìm kiếm
const handleSearch = async () => {
  const { username, email, phoneNumber } = filters;
  try {
    let endpoint = '';
    let body = {};
    if(username&&email&&phoneNumber){
      endpoint = '/allUserCheck';
      body = {username,email,phoneNumber}
    }
    else if (username&&email){
      endpoint = '/allEmailUserName';
      body = {username,email}
    }
    else if(email&&phoneNumber){
      endpoint = '/allEmailPhoneNumber';
      body = {email,phoneNumber}
    }
    else if(username&&phoneNumber){
      endpoint = '/allUsernamePhoneNumber'
      body = {username,phoneNumber}
    }
    else if (username) {
      endpoint = '/allUserByUsername';
      body = { username };
    } else if (email) {
      endpoint = '/allUserByEmail';
      body = { email };
    } else if (phoneNumber) {
      endpoint = '/allUserBySDT';
      body = { phoneNumber };
    } else {
      alert("Vui lòng nhập nội dung tìm kiếm")
      return;
    }

    const token = getCookie('token');

    const response = await fetch(`${API_ENDPOINT}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert('Không tìm thấy tài khoản')
    }
    else{
    const data = await response.json();
    setFilteredUsers(data);
    setIsFiltering(true);
    }

  } catch (error) {
    console.error('Error during fetch:', error);
  }
};



  // Hàm xử lý khi nhấn reset
  const handleReset = () => {
    setFilters({ username: '', email: '', phoneNumber: '' });
    setIsFiltering(false);
    customFunction();
  };


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
      <div className='filter-container'>
        Tài khoản: <input name="username" value={filters.username} onChange={handleFilterChange} />
        Email: <input name="email" value={filters.email} onChange={handleFilterChange} />
        Số điện thoại: <input name="phoneNumber" value={filters.phoneNumber} onChange={handleFilterChange} />
        <button onClick={handleSearch}>Tìm kiếm</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Chức vụ</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
  {isFiltering
    ? filteredUsers.map((blog, index) => (
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
      ))
    : blogs.map((blog, index) => (
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
