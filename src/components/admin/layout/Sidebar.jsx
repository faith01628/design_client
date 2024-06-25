import { Flex, Menu } from 'antd';
import { FaLeaf } from 'react-icons/fa6';
import { UserOutlined, ProfileOutlined, LogoutOutlined, OrderedListOutlined, CarryOutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        switch (e.key) {
            case '1':
                navigate('/admin');
                break;
            case '2':
                navigate('/admin/user-manager');
                break;
            case '3':
                navigate('/todo');
                break;
            case '4':
                navigate('/my-orders');
                break;
            case '5':
                navigate('/setting');
                break;
            case '6':
                // Xử lý đăng xuất
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('accessToken');
                navigate('/login');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Flex align="center" justify="center">
                <div className="logo">
                    <FaLeaf />
                </div>
            </Flex>

            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                className="menu-bar"
                onClick={handleMenuClick}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: 'Dashboard',
                    },
                    {
                        key: '2',
                        icon: <ProfileOutlined />,
                        label: 'User Manager',
                    },
                    {
                        key: '3',
                        icon: <OrderedListOutlined />,
                        label: 'ToDo',
                    },
                    {
                        key: '4',
                        icon: <CarryOutOutlined />,
                        label: 'My Orders',
                    },
                    {
                        key: '5',
                        icon: <SettingOutlined />,
                        label: 'Setting',
                    },
                    {
                        key: '6',
                        icon: <LogoutOutlined />,
                        label: 'Logout',
                    },
                ]}
            />
        </>
    );
};

export default Sidebar;
