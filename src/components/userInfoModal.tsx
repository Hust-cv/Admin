import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
  user: UserData | null;
  show: boolean;
  handleClose: () => void;
}

const getRoleName = (role_id: number): string => {
  return role_id === 1 ? 'Nhà tuyển dụng' : role_id === 2 ? 'Người dùng' : '';
};

const UserInfoModal: React.FC<Props> = ({ user, show, handleClose }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tài khoản: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Phone Number: {user.phoneNumber}</p>
        <p>Birthday: {user.birthDay}</p>
        <p>Ngày tạo tài khoản: {user.createdAt}</p>
        <p>Ngày thay đổi thông tin gần nhất: {user.updatedAt}</p>
        <p>Chức vụ: {getRoleName(user.role_id)}</p>
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
