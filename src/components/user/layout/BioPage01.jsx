import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Layout, Typography, Row, Col, Avatar, Button, Modal, Input, Select, Popconfirm, message } from 'antd';
import { UserOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../../assets/css/user/index.css';
=======
import { Layout, Typography, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../../assets/css/user/index.css'; // Ensure the correct path
import '../../../assets/css/user/bioPage01.scss';
import ActionProfile from '../ModalButton';
>>>>>>> huy

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

            // Lấy danh sách label từ thông tin hồ sơ
            const labelsFromProfile = Object.keys(data.data).filter(key => key !== 'avata' && key !== 'backgroundavata' && !key.includes('id'));
            // Lọc những label chưa có trong modal
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
        // Lặp qua các label được chọn từ Select
        labels.forEach(label => {
            // Tìm label được chọn trong availableLabels
            const selectedLabel = availableLabels.find(item => item === label);
    
            if (selectedLabel) {
                // Thêm label vào additionalInfo với giá trị mặc định là ''
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
<<<<<<< HEAD

                    <Col xs={24} sm={12} md={8} className="info-col">
                        <Button className="profile-button" block onClick={showModal}>
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
=======
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
>>>>>>> huy
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
                        onChange={addInput} // Gọi hàm addInput khi có thay đổi trong Select
                    >
                        {availableLabels.map((label, index) => (
                            <Option key={index} value={label}>{label}</Option>
                        ))}
                    </Select>
                </Modal>
            </div>
            <div className='action-container'>
                <ActionProfile />
            </div>
        </Content>
    );
};

UserProfile.propTypes = {
<<<<<<< HEAD
    currentInterface: PropTypes.string.isRequired,
=======
    currentInterface: PropTypes.string.isRequired, // Ensure currentInterface is required
>>>>>>> huy
};

export default UserProfile;
