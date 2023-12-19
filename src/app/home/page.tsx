// home/page.tsx
"use client"
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import Apptable from '@/components/table';
import "./page.css";
import { useRouter } from 'next/navigation'
import { getCookie } from '@/getCookie/getCookie';
import useSWR, { Fetcher } from 'swr'
import deleteCookie from '@/getCookie/deleteCookie';
interface AdminData {
    id: BigInteger;
    email: string;
    username: string;
    phoneNumber: string;
    fullName: string;
  }


export default function Page() {
    const router = useRouter();
    const [classroomsData, setClassroomsData] = useState(null);
    const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [adminData, setTeacherData] = useState<AdminData | null>(null);

  useEffect(() => {
    // Function to check the token
    const checkTokenValidity = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch('http://localhost:6868/api/admin/auth/me',{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          // Token is valid
          setIsValidToken(true);
          setTeacherData(data.admin); // Set teacher data here
        } else {
          router.push('/login');
          // Token is invalid, redirect to login or handle accordingly
          setIsValidToken(false);
          // You can redirect to the login page or show a login modal here
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    // Call the function to check token validity
    checkTokenValidity();
  }, []); // Empty dependency array to run only once on component mount

  const reloadTableData = async () => {
    const token = getCookie('token');
    await fetch('http://localhost:6868/api/admin/allUser', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log('Classrooms data:', data);
      if (data) {
        setClassroomsData(data);
        console.log('Classrooms data:', data);
      }
    })
  }

  async function handleLogout() {
    deleteCookie('token')
    router.push('/login')
  }
  async function handleChangePassword() {
    router.push('/changePassword')
  }

  async function handleShowClassrooms() {
    if (adminData && adminData.id) {
      reloadTableData();
    }
  }


  return (
    <div className="main-container">
    <div className="sidebar-container">
      {isValidToken ? (
        <div>
          <div className='logo-big'>HustCV</div>
          <div className='logo-small'>Ứng dụng tìm kiếm việc làm</div>
          {adminData && ( // Check if teacherData is not null
        <div className='menu'>
          <div className='menu-item' onClick={() => setIsMenuExpanded(!isMenuExpanded)}>
            Chào {adminData.fullName}
          </div>
          {isMenuExpanded && (
            <div className='menu-container'>
              <div className='menu-item children' onClick={() => handleLogout()}>Đăng xuất</div>
              <div className='menu-item children' onClick={() => handleChangePassword()}>Đổi mật khẩu</div>
            </div>
          )}
          {/* Other menu items */}
        </div>
      )}
          <div className='menu'>
            <div className='menu-item' onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}>Menu</div>
            {isCoursesExpanded && (
              <div className='menu-container'>
                <div className='menu-item children' onClick={() => handleShowClassrooms()}>Danh sách người dùng</div>
              </div>
            )}
            {/* Other menu items */}
          </div>
          
        </div>
        
      ) : (
        // Redirect to login or show login message
        <div>
          <p>You are not logged in. Redirecting to login...</p>
          {/* You can use React Router or other methods for redirection */}
        </div>
      )}
    </div>
    <div className="content-container">
        {classroomsData && <Apptable blogs={classroomsData} customFunction={reloadTableData}/>}
      </div>
    </div>
);}