import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Avatar, Button, Modal, Input, Popconfirm, Select, message } from 'antd';
import { UserOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';
import SketchPicker from 'react-color';
import axios from 'axios';
import PropTypes from 'prop-types';
// import ActionProfile from '../ModalButton';
// import '../../../assets/css/user/index.css';
import LayoutUser from './LayoutUser';

const { Content } = Layout;
const { Title } = Typography;

const IconComponent = ({ title }) => {
    switch (title.toLowerCase()) {
        case 'facebook':
            return <FaFacebook />;
        case 'instagram':
            return <FaInstagram />;
        case 'youtube':
            return <FaYoutube />;
        case 'twitter':
            return <FaTwitter />;
        case 'tiktok':
            return <FaTiktok />;
        default:
            return null;
    }
};

IconComponent.propTypes = {
    title: PropTypes.string.isRequired,
};

const View = ({ currentInterface }) => {
    const { herfid } = useParams();
    const [profile, setProfile] = useState({
        fullname: '',
        phone: '',
        address: '',
        avatar: '',
        backgroundavatar: '',
        bod: '',
        introduce: ''
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [availableLabels, setAvailableLabels] = useState([]);
    const [profileId, setProfileId] = useState(null);
    const [links, setLinks] = useState([]);
    const [linkCount, setLinkCount] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [colorModalVisible, setColorModalVisible] = useState(false);

    useEffect(() => {
        if (herfid) {
            fetchProfileByHerfid(herfid);
        }
    }, [herfid]);

    useEffect(() => {
        if (profileId) {
            fetchLinks(profileId);
        }
    }, [profileId]);

    const fetchProfileByHerfid = async (herfid) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('Access token không tìm thấy.');
            return;
        }

        try {
            console.log('Fetching user profile by herfid:', herfid);
            const response = await axios.get(`http://192.168.10.156:3000/viewuser/${herfid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('API Response:', response);
            const data = response.data;
            if (data.result === 1 && data.data.profile.length > 0) {
                const profileData = data.data.profile[0];

                console.log('Profile data:', profileData);
                setProfile({
                    fullname: profileData.fullname,
                    phone: profileData.phone,
                    address: profileData.address,
                    avatar: profileData.avata,
                    backgroundavatar: profileData.backgroundavata,
                    bod: profileData.bod,
                    introduce: profileData.introduce,
                });
                if (profileData.id) {
                    setProfileId(profileData.id); // Save profileId from response into state
                } else {
                    console.error('Không tìm thấy profileId trong phản hồi API.');
                }

                // Get labels from profile data
                const labelsFromProfile = Object.keys(profileData).filter(key => key !== 'avatar' && key !== 'backgroundavatar' && !key.includes('id'));
                // Filter labels not in modal
                const labelsNotInModal = labelsFromProfile.filter(label => !Object.keys(profile).includes(label));
                setAvailableLabels(labelsNotInModal);
            } else {
                console.error('Invalid data returned by API:', data);
            }
        } catch (error) {
            console.error('Error while fetching user profile:', error);
        }
    };

    const fetchLinks = async (profileId) => {
        if (!profileId) {
            console.error('profileId không tồn tại.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`http://192.168.10.156:3000/link/${profileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.result === 1 && Array.isArray(data.data)) {
                setLinks(data.data);
            } else {
                console.error('API returned invalid data:', data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin link:', error);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const addInput = (labels) => {
        labels.forEach(label => {
            const selectedLabel = availableLabels.find(item => item === label);

            if (selectedLabel) {
                const newInfo = [...additionalInfo, { label: selectedLabel, value: '' }];
                setAdditionalInfo(newInfo);
            }
        });
    };

    const showColorModal = () => {
        setColorModalVisible(true);
    };

    const handleColorModalCancel = () => {
        setColorModalVisible(false);
    };

    const removeInput = (index) => {
        const newInfo = [...additionalInfo];
        newInfo.splice(index, 1);
        setAdditionalInfo(newInfo);
    };

    const removeAllInputs = () => {
        setAdditionalInfo([]);
    };

    const confirmDelete = (index) => {
        message.success('Đã xóa');
        removeInput(index);
    };

    const cancelDelete = () => {
        message.error('Đã hủy');
    };

    const handleRemoveAll = () => {
        if (additionalInfo.length > 0) {
            Modal.confirm({
                title: 'Xác nhận xóa toàn bộ?',
                content: 'Bạn có chắc chắn muốn xóa tất cả các label và giá trị?',
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => removeAllInputs(),
            });
        }
    };

    const handleRemoveItem = (index) => {
        Modal.confirm({
            title: 'Xác nhận xóa?',
            content: 'Bạn có chắc chắn muốn xóa label và giá trị này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => confirmDelete(index),
        });
    };

    const handleInputChange = (index, key, value) => {
        const newInfo = [...additionalInfo];
        newInfo[index][key] = value;
        setAdditionalInfo(newInfo);
    };

    const handleLinkCreation = async (title, link) => {
        try {
            const token = localStorage.getItem('accessToken');
            const existingLink = links.find(l => l.title === title);

            if (existingLink) {
                const response = await axios.put(
                    `http://192.168.10.156:3000/updatelink/${existingLink.id}`,
                    {
                        profileid: profileId,
                        title: title,
                        link: link,
                        indexid: existingLink.indexid,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.status === 200) {
                    message.success('Đã cập nhật đường link thành công');
                    fetchLinks(profileId);
                } else {
                    message.error('Lỗi khi cập nhật đường link:', response.statusText);
                }
            } else {
                const response = await axios.post(
                    'http://192.168.10.156:3000/createlink',
                    {
                        profileid: profileId,
                        title: title,
                        link: link,
                        indexid: linkCount + 4,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.status === 200) {
                    message.success('Đã tạo đường link thành công');
                    setLinkCount(prevCount => prevCount + 1);
                    fetchLinks(profileId);
                } else {
                    message.error('Lỗi khi tạo đường link:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Lỗi khi tạo hoặc cập nhật đường link:', error.message);
        }
    };

    return (
        <LayoutUser>
            <Content className="content">
                <div className="profile-container" style={{ backgroundColor, transition: 'background-color 0.3s ease' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} className="avatar-col">
                            <div className="avatar-background">
                                <img className="background-avatar" src={`http://192.168.10.156:3000/${profile.backgroundavatar}`} alt="Background Avatar" />
                            </div>
                            <div className="avatar-wrapper">
                                <Avatar size={120} src={`http://192.168.10.156:3000/${profile.avatar}`} icon={<UserOutlined />} />
                            </div>
                        </Col>
                        <Col span={24}>
                            <Title level={2}>{profile.fullname}</Title>
                            <p>{profile.phone}</p>
                            <p>{profile.address}</p>
                            <p>{profile.bod}</p>
                            <p>{profile.introduce}</p>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} justify="center">
                        {links.map((link, index) => (
                            <Col key={index} className="link-col">
                                <Button className="link-button" type="link" href={link.link} target="_blank">
                                    <IconComponent title={link.title} />
                                    {link.title}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                    <Row gutter={[16, 16]} justify="center">
                        <Col>
                            <Button type="primary" onClick={showModal}>
                                Thêm thông tin
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={showColorModal}>
                                Đổi màu nền
                            </Button>
                        </Col>
                    </Row>
                    <Modal
                        title="Thêm thông tin"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Hủy
                            </Button>,
                            <Button
                                key="add"
                                type="primary"
                                onClick={() => {
                                    handleRemoveAll();
                                    setIsModalVisible(false);
                                }}
                            >
                                Thêm
                            </Button>
                        ]}
                    >
                        {additionalInfo.map((info, index) => (
                            <div key={index} className="additional-info-row">
                                <Input
                                    placeholder="Label"
                                    value={info.label}
                                    onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                                />
                                <Input
                                    placeholder="Giá trị"
                                    value={info.value}
                                    onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                                />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa?"
                                    onConfirm={() => handleRemoveItem(index)}
                                    onCancel={cancelDelete}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button type="danger" icon={<MinusOutlined />} />
                                </Popconfirm>
                            </div>
                        ))}
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Chọn label"
                            onChange={addInput}
                            options={availableLabels.map(label => ({ value: label, label }))}
                        />
                    </Modal>
                    <Modal
                        title="Chọn màu nền"
                        visible={colorModalVisible}
                        onCancel={handleColorModalCancel}
                        footer={[
                            <Button key="cancel" onClick={handleColorModalCancel}>
                                Hủy
                            </Button>
                        ]}
                    >
                        <SketchPicker
                            color={backgroundColor}
                            onChangeComplete={(color) => setBackgroundColor(color.hex)}
                        />
                    </Modal>
                </div>
            </Content>
        </LayoutUser>
    );
};

export default View;
