
import { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Avatar, Button } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import { FaLeaf } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../../assets/css/user/index.css'; // Đảm bảo đúng đường dẫn


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
            const response = await axios.get('http://192.168.1.7:3000/profilebyid', {
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
                                src={`http://192.168.1.7:3000/${profile.avatar}`}
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} className="info-col">
                        <Button className="profile-button" block>
                            About Me
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} className="info-col">
                        <Button className="profile-button" block>
                            Portfolio
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} className="info-col">
                        <Button className="profile-button" block>
                            Review
                        </Button>
                    </Col>
                    <Col span={24} className="info-col">
                        <Title level={3} className="title">{profile.fullname}</Title>
                        <Text strong>Phone:</Text> <Text className="ant-typography">{profile.phone}</Text>
                        <br />
                        <Text strong>Address:</Text> <Text className="ant-typography">{profile.address}</Text>
                    </Col>
                </Row>
            </div>
        </Content>
    );
};

UserProfile.propTypes = {
    currentInterface: PropTypes.string.isRequired, // Kiểm tra và đánh dấu currentInterface là bắt buộc
};

export default UserProfile;
