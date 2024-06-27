import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Layout, Typography, Row, Col, Avatar, Divider } from 'antd';
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
            const response = await axios.get('http://192.168.10.156:3000/profilebyid', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accountid: accountid,
                },
            });
            const data = response.data;

            setProfile({
                fullname: data.data.fullname,
                phone: data.data.phone,
                address: data.data.address,
                avatar: data.data.avatar,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    return (
        <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Row gutter={[16, 16]}>
                    <Col span={currentInterface === 'desktop' ? 24 : (currentInterface === 'tablet' ? 12 : 8)} style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div className={`avatar-container`}>
                            <Avatar size={currentInterface === 'desktop' ? 120 : (currentInterface === 'tablet' ? 80 : 60)} icon={<UserOutlined />} src={profile.avatar} />
                        </div>
                    </Col>
                    <Col span={currentInterface === 'desktop' ? 24 : (currentInterface === 'tablet' ? 12 : 16)}>
                        <Title level={3}>{profile.fullname}</Title>
                        <Text strong>Phone:</Text> <Text>{profile.phone}</Text>
                        <br />
                        <Text strong>Address:</Text> <Text>{profile.address}</Text>
                    </Col>
                </Row>
                <Divider />
            </div>
        </Content>
    );
};

export default UserProfile;
