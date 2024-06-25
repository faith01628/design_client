import { useEffect, useState } from 'react';
import { Button, Flex, Typography, Dropdown, Menu } from 'antd';
import Search from 'antd/es/transfer/search';
import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

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
        <Flex align="center" justify="space-between">
            <Typography.Title level={3} type="secondary">
                Welcome back, {userName}
            </Typography.Title>

            <Flex align="center" gap="1.5rem">
                <Search placeholder="Search Dashboard" allowClear />

                <Flex align="center" gap="10px">
                    <MessageOutlined className="header-icon" />
                    <NotificationOutlined className="header-icon" />
                </Flex>

                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" className="avatar-button">
                        <UserOutlined className="header-icon" />
                    </Button>
                </Dropdown>
            </Flex>
        </Flex>
    );
};

export default CustomHeader;
