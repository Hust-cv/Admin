"use client"
import React, { useState } from "react";
import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { config } from '@/config/config';
import { message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
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
const Container = styled.div`
 background-color: #fff;
 border-radius: 10px;
 box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
 position: relative;
 overflow: hidden;
 width: 678px;
 max-width: 100%;
 min-height: 400px;
 `;

const SignUpContainer = styled.div`
  signinIn: boolean;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.$signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `
    : null}
 `;


const SignInContainer = styled.div`
 position: absolute;
 top: 0;
 height: 100%;
 transition: all 0.6s ease-in-out;
 left: 0;
 width: 50%;
 z-index: 2;
 ${props => (props.$signinIn !== true ? `transform: translateX(100%);` : null)}
 `;

const Form = styled.form`
 background-color: #ffffff;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 padding: 0 50px;
 height: 100%;
 text-align: center;
 `;

const Title = styled.h1`
 font-size: 40px;
 font-weight: bold;
 margin: 0;
 `;
const InputContainer = styled.div`
 position: relative;
 width: 100%;
`;

const Input = styled.input`
 font-size: 14px;
 background-color: #eee;
 border: none;
 padding: 10px 15px;
 margin: 5px 0;
 width: 100%;
 color: black;
 `;

const Icon = styled.div`
 position: absolute;
 right: 10px;
 top: 50%;
 transform: translateY(-50%);
 cursor: pointer;
`;

const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active{
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
 `;
const GhostButton = styled(Button)`
 background-color: transparent;
 border-color: #ffffff;
 `;

const Anchor = styled.a`
 color: #333;
 font-size: 14px;
 text-decoration: none;
 margin: 15px 0;
 `;
const OverlayContainer = styled.div`
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
${props =>
    props.$signinIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
background: #ff416c;
background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
background: linear-gradient(to right, #ff4b2b, #ff416c);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #ffffff;
position: relative;
left: -100%;
height: 100%;
width: 200%;
transform: translateX(0);
transition: transform 0.6s ease-in-out;
${props => (props.$signinIn !== true ? `transform: translateX(50%);` : null)}
`;

const OverlayPanel = styled.div`
     position: absolute;
     display: flex;
     align-items: center;
     justify-content: center;
     flex-direction: column;
     padding: 0 40px;
     text-align: center;
     top: 0;
     height: 100%;
     width: 50%;
     transform: translateX(0);
     transition: transform 0.6s ease-in-out;
 `;

const LeftOverlayPanel = styled(OverlayPanel)`
   transform: translateX(-20%);
   ${props => props.$signinIn !== true ? `transform: translateX(0);` : null}
 `;

const RightOverlayPanel = styled(OverlayPanel)`
     right: 0;
     transform: translateX(0);
     ${props => props.$signinIn !== true ? `transform: translateX(20%);` : null}
 `;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px
 `;


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

export default function Page() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [showPassword, setShowPassword] = useState(false);
  const key = 'updatable';

  const openMessageSuccess = (text) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: text,
        duration: 2,
      });
    }, 500);
  };
  const openMessageError = (text) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'error',
        content: text,
        duration: 2,
      });
    }, 500);
  };
  useEffect(() => {
    // Function to check the token
    const checkTokenValidity = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${config.apiUrl}/admin/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          router.push('/');
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    // Call the function to check token validity
    checkTokenValidity();
  }, []); // Empty dependency array to run only once on component mount

  const [formData, setFormData] = useState({
    userName: '',
    passWord: '',
    email: '',
    fullName: '',
    confirmPassWord: '',
  });
  const isPasswordMatch = () => {
    return formData.passWord === formData.confirmPassWord;
  };
  const [signIn, setSignIn] = useState(true);

  const handleToggle = () => {
    setSignIn(!signIn);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!signIn && !isPasswordMatch()) {
      openMessageError('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
    if (!signIn && (!formData.fullName || !formData.email || !formData.userName || !formData.passWord || !formData.confirmPassWord || !isPasswordMatch())) {
      openMessageError('Vui lòng điền đầy đủ tất cả các trường thông tin!');
      return;
    }
    if (signIn && (!formData.userName || !formData.passWord)) {
      openMessageError('Vui lòng điền đầy đủ tất cả các trường thông tin!');
      return;
    }
    try {
      const url = signIn
        ? `${config.apiUrl}/admin/login`
        : `${config.apiUrl}/admin/register`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // console.log('Phản hồi từ máy chủ:', response);
      const { statusText } = response;
      if (statusText == 'Conflict') {
        openMessageError('Tài khoản hoặc email đã tồn tại')
      }
      else if (statusText == 'Created') {
        openMessageSuccess('Đăng ký tài khoản thành công')
        setSignIn(true)
      }
      else if (statusText == 'Unauthorized') {
        openMessageError('Tài khoản hoặc mật khẩu không đúng')
      }
      else if (statusText == 'OK') {
        const responseData = await response.json();
        setCookie('token', responseData.token, 1);
        openMessageSuccess('Đăng nhập thành công, tự động chuyển trang admin');
        router.push('/');
      }
    } catch (error) {
      openMessageError('Lỗi');
    }
  };

  return (
    <>{contextHolder}
      <Body>
        <Container>
          <SignUpContainer $signinIn={signIn}>
            <Form onSubmit={handleFormSubmit}>
              <Title>{signIn ? 'Đăng nhập' : 'Tạo tài khoản'}</Title>
              {!signIn && (
                <Input
                  type='fullName'
                  name='fullName'
                  placeholder='Họ và tên'
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              )}
              {!signIn && (
                <Input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              )}
              <Input
                type='userName'
                name='userName'
                placeholder='Tài khoản'
                value={formData.userName}
                onChange={handleInputChange}
              />
              <Input
                type='passWord'
                name='passWord'
                placeholder='Mật khẩu'
                value={formData.passWord}
                onChange={handleInputChange}
              />
              <Input
                type='password'
                name='confirmPassWord'
                placeholder='Xác nhận lại mật khẩu'
                value={formData.confirmPassWord}
                onChange={handleInputChange}
                style={{ borderColor: isPasswordMatch() ? 'initial' : 'red' }}
              />
              <Button type='submit'>{signIn ? 'Đăng nhập' : 'Đăng ký'}</Button>
            </Form>
          </SignUpContainer>

          <SignInContainer $signinIn={signIn}>
            <Form onSubmit={handleFormSubmit}>
              <Title>Đăng nhập</Title>
              <Input
                type='userName'
                name='userName'
                placeholder='Tài khoản'
                value={formData.userName}
                onChange={handleInputChange}
              />
              <InputContainer>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name='passWord'
                  placeholder='Mật khẩu'
                  value={formData.passWord}
                  onChange={handleInputChange}
                  style={{ borderColor: isPasswordMatch() ? 'initial' : 'red' }}
                />
                <Icon onClick={handleTogglePassword}>
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </Icon>
              </InputContainer>
              <Button type='submit'>Đăng nhập</Button>
            </Form>
          </SignInContainer>

          <OverlayContainer $signinIn={signIn}>
            <Overlay $signinIn={signIn}>
              <LeftOverlayPanel $signinIn={signIn}>
                <Title>Chào mừng trở lại!</Title>
                <Paragraph>
                  Để kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                </Paragraph>
                <GhostButton onClick={handleToggle}>
                  Đăng nhập
                </GhostButton>
              </LeftOverlayPanel>

              <RightOverlayPanel $signinIn={signIn}>
                <Title>Chào mừng bạn trở lại HustCV</Title>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
        </Container>
      </Body>
    </>
  );
}

