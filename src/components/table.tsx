import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter} from '@fortawesome/free-solid-svg-icons';
import UserInfoModal from './userInfoModal';
import { getCookie } from '@/getCookie/getCookie';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
interface UserData{
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
  blogs: {
    id: number;
    username: string;
    email: string;
    status: boolean;
    role_id: number;
    birthDay: string;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string;
  }[];
  customFunction: () => void;
}


const Apptable = (props:Props) => {
  let token = getCookie('token');
  const { blogs, customFunction } = props;
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  const openMessageSuccess = (text:string) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type:'success',
        content: text,
        duration: 2,
      });
    }, 500);
  };
  const openMessageError = (text:string) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type:'error',
        content: text,
        duration: 2,
      });
    }, 500);
  };
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

  const getRoleName = (role_id: number): string => {
    return role_id === 1 ? 'Nhà tuyển dụng' : role_id === 2 ? 'Người dùng' : '';
  };

  // Hàm xử lý khi nhấn tìm kiếm
  const handleSearch = async () => {
    const { username, email, phoneNumber } = filters;
    try {
      let endpoint = '';
      let body = {};
      if (username && email && phoneNumber) {
        endpoint = '/admin/allUserCheck';
        body = { username, email, phoneNumber }
      }
      else if (username && email) {
        endpoint = '/admin/allEmailUserName';
        body = { username, email }
      }
      else if (email && phoneNumber) {
        endpoint = '/admin/allEmailPhoneNumber';
        body = { email, phoneNumber }
      }
      else if (username && phoneNumber) {
        endpoint = '/admin/allUsernamePhoneNumber'
        body = { username, phoneNumber }
      }
      else if (username) {
        endpoint = '/admin/allUserByUsername';
        body = { username };
      } else if (email) {
        endpoint = '/admin/allUserByEmail';
        body = { email };
      } else if (phoneNumber) {
        endpoint = '/admin/allUserBySDT';
        body = { phoneNumber };
      } else {
        openMessageError("Vui lòng nhập nội dung tìm kiếm")
        return;
      }

      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        openMessageError('Không tìm thấy tài khoản')
      }
      else {
        const data = await response.json();
        // openMessageSuccess('Success')
        setFilteredUsers(data);
        setIsFiltering(true);
      }

    } catch (error) {
      openMessageError('Error during fetch');
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

  const handleButtonEvent = async (e: React.MouseEvent, blog: UserData) => {
    e.stopPropagation(); // Prevents the row click event from being triggered
    const status = blog.status;
    const userConfirmed = window.confirm(`Bạn có chắc ${status?'khóa':'mở khóa'} tài khoản ${blog.username}`);
    if (!userConfirmed) {
      return; // User canceled the deletion
    }
    try {
      const response = await fetch(`${config.apiUrl}/admin/updateUser/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !blog.status }),
      });
  
      if (!response.ok) {
        openMessageError(`Request failed`);
      }
  
      const updatedUser = await response.json();
      openMessageSuccess(updatedUser);
      customFunction();
      if(isFiltering){
        handleSearch();
      }
    } catch (error) {
      openMessageError('Đã có lỗi xảy ra')
    }
  };

  return (
    <>{contextHolder}
      <div className="container mb-4">
        <div className="row">
          <div className="col-md-6">
            <FontAwesomeIcon icon={faFilter} />Bộ lọc
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <div>
              <Button variant="primary" size='sm' onClick={handleSearch}>
                Tìm kiếm
              </Button>{' '}
              <Button variant="secondary" size='sm' onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label>Tài khoản:</label>
            <input
              className="form-control"
              name="username"
              value={filters.username}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-md-4">
            <label>Email:</label>
            <input
              className="form-control"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-md-4">
            <label>Số điện thoại:</label>
            <input
              className="form-control"
              name="phoneNumber"
              value={filters.phoneNumber}
              onChange={handleFilterChange}
            />
          </div>
        </div>

      </div>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>STT</div></th>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>Tài khoản</div></th>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>Email</div></th>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>Số điện thoại</div></th>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>Chức vụ</div></th>
            <th><div style={{ display: 'flex', justifyContent: 'center' }}>Trạng thái</div></th>
          </tr>
        </thead>
        <tbody>
          {isFiltering
            ? filteredUsers.map((blog, index) => (
              <tr key={index} onClick={() => handleUserNameClick(blog)}>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{index + 1}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.username}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.email}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.phoneNumber}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{getRoleName(blog.role_id)}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant={blog.status?'success':'danger'} size='sm' onClick={(e) => handleButtonEvent(e, blog)}>{blog.status?'Active':'InActive'}</Button>
                  </div>
                </td>
              </tr>
            ))
            : blogs.map((blog, index) => (
              <tr key={index} onClick={() => handleUserNameClick(blog)}>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{index + 1}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.username}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.email}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.phoneNumber}</div></td>
                <td><div style={{ display: 'flex', justifyContent: 'center' }}>{getRoleName(blog.role_id)}</div></td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button variant={blog.status?'success':'danger'} size='sm' onClick={(e) => handleButtonEvent(e, blog)}>{blog.status?'Active':'InActive'}</Button>
                  </div>
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
