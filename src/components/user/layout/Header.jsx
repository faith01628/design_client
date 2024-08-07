import { useEffect, useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { FaLeaf } from 'react-icons/fa';
import PropTypes from 'prop-types'; // Import PropTypes từ thư viện prop-types
import '../../../assets/css/user/index.css'; // Đảm bảo đúng đường dẫn

const UserHeader = ({ onInterfaceChange }) => {
    const [currentInterface, setCurrentInterface] = useState('desktop');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleInterfaceChange = (interfaceType) => {
        setCurrentInterface(interfaceType);
        onInterfaceChange(interfaceType); // Gửi sự kiện lên component cha (LayoutUser)
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const menu = (
        <Menu>
            {isLoggedIn ? (
                <>
                    <Menu.Item key="profile" className="custom-menu-item">
                        <a href="/user/personal-info">Thông tin cá nhân</a>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={handleLogout}>
                        Đăng xuất
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="login" className="custom-menu-item">
                    <a href="/login">Đăng nhập</a>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <div className="header-container">
            <a className="logo" href="http://localhost:5173/">
                <FaLeaf />
            </a>

            <div className="navbar">
                <Button className={`nav-button ${currentInterface === 'desktop' ? 'active' : ''}`} onClick={() => handleInterfaceChange('desktop')}>
                    GIAO DIỆN DESKTOP
                </Button>
                <Button className={`nav-button ${currentInterface === 'tablet' ? 'active' : ''}`} onClick={() => handleInterfaceChange('tablet')}>
                    GIAO DIỆN TABLET
                </Button>
                <Button className={`nav-button ${currentInterface === 'mobile' ? 'active' : ''}`} onClick={() => handleInterfaceChange('mobile')}>
                    GIAO DIỆN MOBILE
                </Button>
            </div>

            <div className="loginbtn">
                <Button type="link" className="use-this">
                    SỬ DỤNG GIAO DIỆN NÀY
                </Button>
            </div>

            <div className="maticon">
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" className="avatar-button">
                        <UserOutlined className="header-icon" />
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

UserHeader.propTypes = {
    onInterfaceChange: PropTypes.func.isRequired, // Kiểm tra kiểu và bắt buộc tồn tại
};

export default UserHeader;
