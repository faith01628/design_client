import { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Avatar, Button, Select, message, Modal, Input, Popconfirm } from 'antd';
import { UserOutlined, MinusOutlined, DeleteOutlined, FacebookOutlined, InstagramOutlined, TikTokOutlined, YoutubeOutlined, TwitterOutlined } from '@ant-design/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../../assets/css/user/index.css'; // Ensure the correct path
import '../../../assets/css/user/bioPage01.scss';
import ActionProfile from '../ModalButton';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
    const [linkCount, setLinkCount] = useState(0); // State to count number of links

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            console.log(data);

            setProfile({
                fullname: data.data.fullname,
                phone: data.data.phone,
                address: data.data.address,
                avatar: data.data.avata,
                backgroundavatar: data.data.backgroundavata,
            });

            setProfileId(data.data.id); // Save profileId from response into state

            // Get labels from profile data
            const labelsFromProfile = Object.keys(data.data).filter(key => key !== 'avata' && key !== 'backgroundavata' && !key.includes('id'));
            // Filter labels not in modal
            const labelsNotInModal = labelsFromProfile.filter(label => !Object.keys(profile).includes(label));
            setAvailableLabels(labelsNotInModal);

        } catch (error) {
            console.error('Lỗi khi lấy thông tin hồ sơ:', error);
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

    const handleLinkCreation = async (title, link, indexid) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(
                'http://192.168.10.156:3000/createlink',
                {
                    profileid: profileId,
                    title: title,
                    link: link,
                    indexid: indexid, // Include indexid in the request
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
            } else {
                message.error('Lỗi khi tạo đường link:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi tạo đường link:', error.message);
        }
    };

    return (
        <Content className="content">
            <div className="profile-container">
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
                        <div className='profile-button-container'>
                            <Button className="profile-button" block onClick={showModal}>
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
                <Modal title="About Me" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Title level={3} className="title">{profile.fullname}</Title>

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
                                title="Bạn có chắc muốn xóa?"
                                onConfirm={() => handleRemoveItem(index)}
                                onCancel={cancelDelete}
                                okText="Có"
                                cancelText="Không"
                                placement="topRight"
                            >
                                <Button
                                    icon={<MinusOutlined />}
                                    style={{ marginLeft: '10px' }}
                                />
                            </Popconfirm>
                        </div>
                    ))}

                    <Button
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveAll}
                        style={{ marginTop: '10px' }}
                    >
                        Xóa toàn bộ
                    </Button>

                    <Select
                        placeholder="Chọn label để thêm"
                        style={{ width: '100%', marginTop: '10px' }}
                        mode="multiple"
                        allowClear={false}
                        onChange={addInput}
                    >
                        {availableLabels.map((label, index) => (
                            <Option key={index} value={label}>{label}</Option>
                        ))}
                    </Select>
                </Modal>
            </div>
            <div className='action-container'>
                <ActionProfile profileId={profileId} handleLinkCreation={handleLinkCreation} />
            </div>
            <div className="review-icons-container">
                {[...Array(linkCount + 4)].map((_, index) => (
                    <div key={index} className="review-icon">
                        {index === 4 && (
                            <FacebookOutlined
                                onClick={() => handleLinkCreation('Facebook', 'http://facebook.com', index)}
                            />
                        )}
                        {index === 5 && (
                            <InstagramOutlined
                                onClick={() => handleLinkCreation('Instagram', 'http://instagram.com', index)}
                            />
                        )}
                        {index === 6 && (
                            <TikTokOutlined
                                onClick={() => handleLinkCreation('TikTok', 'http://tiktok.com', index)}
                            />
                        )}
                        {index === 7 && (
                            <YoutubeOutlined
                                onClick={() => handleLinkCreation('Youtube', 'http://youtube.com', index)}
                            />
                        )}
                        {index === 8 && (
                            <TwitterOutlined
                                onClick={() => handleLinkCreation('Twitter', 'http://twitter.com', index)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Content>
    );
};

UserProfile.propTypes = {
    currentInterface: PropTypes.string.isRequired,
};

export default UserProfile;
