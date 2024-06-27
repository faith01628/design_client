import { useEffect, useState } from 'react';
import { Button, Typography, Dropdown, Menu, Input } from 'antd';
import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;

const CustomHeader = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = '/login';
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" className="custom-menu-item">
                <a href="#">Thông tin cá nhân</a>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Title level={3} type="secondary">
                Welcome back, {userName}
            </Typography.Title>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Search placeholder="Search Dashboard" allowClear />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageOutlined className="header-icon" />
                    <NotificationOutlined className="header-icon" />
                </div>

                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" className="avatar-button">
                        <UserOutlined className="header-icon" />
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default CustomHeader;