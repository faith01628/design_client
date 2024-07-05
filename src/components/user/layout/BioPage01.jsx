import { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Avatar, Button, Modal, Input, Popconfirm, Select, message } from 'antd';
import { UserOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';
import SketchPicker from 'react-color';
import axios from 'axios';
import PropTypes from 'prop-types';
import ActionProfile from '../ModalButton';
import '../../../assets/css/user/index.css';
import LayoutUser from '../LayoutUser';

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


const UserProfile = ({ currentInterface }) => {
    const [profile, setProfile] = useState({
        fullname: '',
        phone: '',
        address: '',
        avatar: '',
        backgroundavatar: '',
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [availableLabels, setAvailableLabels] = useState([]);
    const [profileId, setProfileId] = useState(null); // State to store profileId
    const [links, setLinks] = useState([]); // State to store links and icons
    const [linkCount, setLinkCount] = useState(0); // State to count number of links
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Màu nền mặc định là trắng
    const [colorModalVisible, setColorModalVisible] = useState(false); // Trạng thái hiển thị của Modal chỉnh màu


    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (profileId) {
            fetchLinks(profileId);
        }
    }, [profileId]);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        const accountid = localStorage.getItem('id');

        if (!token || !accountid) {
            console.error('Access token hoặc accountid không tìm thấy.');
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
                avatar: data.data.avata,
                backgroundavatar: data.data.backgroundavata,
            });

            if (data.data.id) {
                setProfileId(data.data.id); // Save profileId from response into state
            } else {
                console.error('Không tìm thấy profileId trong phản hồi API.');
            }

            // Get labels from profile data
            const labelsFromProfile = Object.keys(data.data).filter(key => key !== 'avatar' && key !== 'backgroundavatar' && !key.includes('id'));
            // Filter labels not in modal
            const labelsNotInModal = labelsFromProfile.filter(label => !Object.keys(profile).includes(label));
            setAvailableLabels(labelsNotInModal);

        } catch (error) {
            console.error('Lỗi khi lấy thông tin hồ sơ:', error);
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
                setLinks(data.data); // Cập nhật links với dữ liệu từ phản hồi API
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
            const existingLink = links.find(l => l.title === title); // Tìm link đã tồn tại với title

            if (existingLink) {
                // Nếu link đã tồn tại, thực hiện cập nhật
                const response = await axios.put(
                    `http://192.168.10.156:3000/updatelink/${existingLink.id}`,
                    {
                        profileid: profileId,
                        title: title,
                        link: link,
                        indexid: existingLink.indexid, // Giữ nguyên indexid cũ
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
                    fetchLinks(profileId); // Refresh links after update
                } else {
                    message.error('Lỗi khi cập nhật đường link:', response.statusText);
                }
            } else {
                // Nếu link không tồn tại, thực hiện tạo mới
                const response = await axios.post(
                    'http://192.168.10.156:3000/createlink',
                    {
                        profileid: profileId,
                        title: title,
                        link: link,
                        indexid: linkCount + 4, // Incremental indexid starting from 4
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
                    setLinkCount(prevCount => prevCount + 1); // Increment link count after successful creation
                    fetchLinks(profileId); // Refresh links after creation
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
                            <div className="avatar-container">
                                <Avatar
                                    size={currentInterface === 'desktop' ? 120 : 120}
                                    icon={<UserOutlined />}
                                    src={`http://192.168.10.156:3000/${profile.avatar}`}
                                />
                            </div>
                        </Col>
                        <Col span={24} className="info-col">
                            <Title level={3} className="name-title">{profile.fullname}</Title>
                            <p className="job-title">INTERIOR DESIGNER</p>
                            <Button className="profile-buttons" block onClick={showModal}>ABOUT ME</Button>
                            <Button className="profile-buttons" block>PORTFOLIO</Button>
                            <Button className="profile-buttons" block>WEBSITE</Button>
                            <Button className="profile-buttons" block>REVIEWS</Button>
                        </Col>
                        <Col span={24} className="info-col">
                            <div className="contact-section">
                                <Title level={5}>Liên hệ</Title>
                                <div className="social-icons">
                                    {Array.isArray(links) && links.length > 0 ? (
                                        links.map((link, index) => (
                                            <Button
                                                key={index}
                                                icon={<IconComponent title={link.title} />}
                                                onClick={() => window.open(link.link, '_blank')}
                                                style={{ marginRight: '10px' }}
                                            />
                                        ))
                                    ) : (
                                        <p>Không có link nào được tìm thấy.</p>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Button onClick={showColorModal}>Chỉnh màu nền</Button>
                <ActionProfile
                    profileId={profileId}
                    onLinkCreation={handleLinkCreation}
                    linkCount={linkCount}
                />
                <Modal title="About Me" visible={isModalVisible} onCancel={handleCancel} footer={null}>

                    <div className="form-group">
                        <label className="form-label">Name:</label>
                        <Input
                            className="form-control"
                            value={profile.fullname}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone:</label>
                        <Input
                            className="form-control"
                            value={profile.phone}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address:</label>
                        <Input
                            className="form-control"
                            value={profile.address}
                            readOnly
                        />
                    </div>

                    {additionalInfo.map((info, index) => (
                        <div key={index} style={{ marginTop: '10px' }}>
                            <label className="form-label">{info.label}:</label>
                            <Input
                                className="form-control"
                                value={info.value}
                                onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                            />
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa?"
                                onConfirm={() => handleRemoveItem(index)}
                                onCancel={cancelDelete}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="link" icon={<MinusOutlined />} />
                            </Popconfirm>
                        </div>
                    ))}

                    <div style={{ marginTop: '10px' }}>
                        <Select
                            placeholder="Select a label"
                            style={{ width: '50%' }}
                            onChange={(value) => addInput([value])}
                            options={availableLabels.map(label => ({ label, value: label }))}
                        />
                        <Button type="link" icon={<DeleteOutlined />} onClick={handleRemoveAll} />
                    </div>
                </Modal>

                <Modal
                    title="Chỉnh màu nền"
                    visible={colorModalVisible}
                    onCancel={handleColorModalCancel}
                    footer={null}
                >
                    <SketchPicker
                        color={backgroundColor}
                        onChangeComplete={(color) => setBackgroundColor(color.hex)}
                    />
                </Modal>

            </Content>
        </LayoutUser>
    );
};

UserProfile.propTypes = {
    currentInterface: PropTypes.string.isRequired,
};

export default UserProfile;
