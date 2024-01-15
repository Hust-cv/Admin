import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  business:{
    businessName: string;
    businessAddress: string;
    businessWebsite: string;
  }
}

interface Props {
  user: UserData | null;
  show: boolean;
  handleClose: () => void;
}

const getRoleName = (role_id: number): string => {
  return role_id === 1 ? 'Nhà tuyển dụng' : role_id === 2 ? 'Người dùng' : '';
};

const UserInfoModal: React.FC<Props> = ({ user, show, handleClose }) => {
  if (!user) return null;
  const moment = require('moment');
  const formattedBirthday = moment(user.birthDay).format('DD/MM/YYYY');
  const formattedCreatedAt = moment(user.createdAt).format('DD/MM/YYYY')
  const formattedUpdateAt = moment(user.updatedAt).format('DD/MM/YYYY')
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tài khoản: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Số điện thoại: {user.phoneNumber}</p>
        <p>Ngày sinh: {formattedBirthday}</p>
        <p>Ngày tạo tài khoản: {formattedCreatedAt}</p>
        <p>Ngày thay đổi thông tin gần nhất: {formattedUpdateAt}</p>
        <p>Chức vụ: {getRoleName(user.role_id)}</p>
        {
          user.business&&(
          <>
          <p>Tên công ty: {user.business.businessName}</p>
          <p>Địa chỉ công ty: {user.business.businessAddress}</p>
          <p>Website công ty: {user.business.businessWebsite}</p>
          </>
          )
        }
        <p>Trạng thái: {user.status ? 'Active' : 'Inactive'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;
