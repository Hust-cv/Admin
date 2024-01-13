"use client"
import React, { useState, useEffect } from 'react';
import { config } from '@/config/config';
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/getCookie/getCookie';
import deleteCookie from '@/getCookie/deleteCookie';
import Apptable from '@/components/table';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
interface TeacherData {
  fullName: string;
  maGv: BigInteger;
  sdt: string;
  userName: string;
}
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Trang HustCV', '1', <HomeOutlined />),
  getItem('Admin', 'sub1', <UserOutlined />, [
    getItem('Đăng xuất', '3', <LogoutOutlined />),
    getItem('Đổi mật khẩu', '4', <UserSwitchOutlined />),
  ]),
  getItem('Menu', 'sub2', <TeamOutlined />, [getItem('Người dùng', '5', <SolutionOutlined />)]),
];
interface AdminData {
    id: BigInteger;
    email: string;
    username: string;
    phoneNumber: string;
    fullName: string;
  }
const App: React.FC = () => {
  const router = useRouter();
  const [usersData, setUsersData] = useState(null);
  const [sumData, setSumData] = useState(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Function to check the token
    const checkTokenValidity = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${config.apiUrl}/admin/auth/me`,{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // console.log(data)
        if (response.ok) {
          setAdminData(data.admin);
        } else {
          router.push('/login');
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
    await fetch(`${config.apiUrl}/admin/allUser`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      if (data) {
        // console.log(data)
        setUsersData(data.users);
        setSumData(data.sum);
      }
    })
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = ({ key }: { key: React.Key }) => {
    if (key == 3) {
      deleteCookie('token');
      router.push('/login');
    }
    else if (key == 5) {
      reloadTableData();
    }
    else if (key == 4) {
      router.push('/changePassword');
    }
    else{
      window.location.href ='https://google.com';
    };

  };
  return (
    <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: '60px',display: 'flex', justifyContent: 'center' }}>
          <h1>CV</h1>
        </div>
        <Menu onClick={handleClick}
          theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '10px 20px', background: colorBgContainer }}><h3>Chào mừng {adminData?.fullName} đến với trang quản trị</h3></Header>

        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '10px 0' }}>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 60,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {usersData ? (
              <Apptable blogs={usersData} sumData={sumData} customFunction={reloadTableData} />
            ) : (
              <h3>Trang chủ</h3>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về (HustCV)</Footer>
      </Layout>
    </Layout>
    </>
  );
};

export default App;