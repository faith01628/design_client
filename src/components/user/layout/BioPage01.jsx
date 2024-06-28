import { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../../assets/css/user/index.css'; // Ensure the correct path
import '../../../assets/css/user/bioPage01.scss';
import ActionProfile from '../ModalButton';

const { Content } = Layout;
const { Title, Text } = Typography;

const UserProfile = ({ currentInterface }) => {
    const [profile, setProfile] = useState({
        fullname: '',
        phone: '',
        address: '',
        avatar: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        const accountid = localStorage.getItem('id');

        if (!token || !accountid) {
            console.error('Access token or accountid not found.');
            return;
        }

        try {
            const response = await axios.get('http://192.168.10.156:3000/profilebyid', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accountid: accountid,
                },
            });
            const data = response.data;

            console.log(data);

            setProfile({
                fullname: data.data.fullname,
                phone: data.data.phone,
                address: data.data.address,
                avatar: data.data.avata,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    return (
        <Content className="content">
            <div className="profile-container">
                <Row gutter={[16, 16]}>
                    <Col span={24} className="avatar-col">
                        <div className="avatar-container">
                            <Avatar
                                size={currentInterface === 'desktop' ? 120 : 120}
                                icon={<UserOutlined />}
                                src={`http://192.168.10.156:3000/${profile.avatar}`}
                            />
                        </div>
                    </Col>
                    <Col span={24} className="info-col">
                        <div className='profile-button-container'>
                            <Button className="profile-button" block>
                                About Me
                            </Button>
                            <Button className="profile-button" block>
                                Portfolio
                            </Button>
                            <Button className="profile-button" block>
                                Review
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='action-container'>
                <ActionProfile />
            </div>
        </Content>
    );
};

UserProfile.propTypes = {
    currentInterface: PropTypes.string.isRequired, // Ensure currentInterface is required
};

export default UserProfile;
