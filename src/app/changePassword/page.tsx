"use client"
import React, { useState, FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getCookie } from '@/getCookie/getCookie';
import { useRouter } from 'next/navigation'
import deleteCookie from '@/getCookie/deleteCookie';
import { config } from '@/config/config';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
const Body = styled.div`
background: #f6f5f7;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
font-family: "Montserrat", sans-serif;
height: 100vh;
margin: -20px 0 50px;
`;
function BasicExample() {
  const router = useRouter();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
  
    const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // Gửi thông tin mật khẩu đến API
    try {
        
      const token = getCookie('token');
      const response = await fetch(`${config.apiUrl}/admin/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi cập nhật mật khẩu');
      }
      alert('Mật khẩu đã được cập nhật thành công');
      deleteCookie('token')
      router.push('/login')
    } catch (error) {
      alert("Mật khẩu cũ không đúng")
    }
  };
  const handleCancel = () => {
    router.push("/admin")
  };
  return (
    <Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicOldPassword">
        <Form.Label>Nhập mật khẩu cũ</Form.Label>
        <Form.Control 
          type={showPassword ? "text" : "password"} 
          placeholder="Nhập mật khẩu cũ" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicNewPassword">
        <Form.Label>Nhập mật khẩu mới</Form.Label>
        <Form.Control 
          type={showPassword ? "text" : "password"} 
          placeholder="Nhập mật khẩu mới" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicConfirmNewPassword">
        <Form.Label>Nhập lại mật khẩu mới</Form.Label>
        <Form.Control 
          type={showPassword ? "text" : "password"} 
          placeholder="Nhập lại mật khẩu mới" 
          value={confirmNewPassword} 
          onChange={(e) => setConfirmNewPassword(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check 
          type="checkbox" 
          label="Hiển thị mật khẩu" 
          checked={showPassword} 
          onChange={(e) => setShowPassword(e.target.checked)} />
      </Form.Group>

      <>
        <Button variant="danger" onClick={handleCancel}>
          Hủy
        </Button>{' '}
        <Button variant="primary" onClick={handleSubmit}>
          Xác nhận
        </Button>
      </>
    </Form>
    </Body>
  );
}

export default BasicExample;
