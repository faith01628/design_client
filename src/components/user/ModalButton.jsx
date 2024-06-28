import { useState } from 'react';
import { Modal, Button, Select, Input, message } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const ActionProfile = ({ profileId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [linkValue, setLinkValue] = useState('');
    const [indexId, setIndexId] = useState(4); // Starting indexid from 4
    const token = localStorage.getItem('accessToken');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);

        const formData = {
            profileid: profileId,
            title: selectedOption,
            link: linkValue,
            indexid: indexId, // Include indexid in formData
        };

        try {
            const response = await fetch('http://192.168.10.156:3000/createlink', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Đã tạo đường link thành công');
                // Increment indexid for the next link creation
                setIndexId(prevIndexId => prevIndexId + 1);

                setLinkValue(''); // Clear input after successful creation (if needed)
                message.success('Đã tạo đường link thành công');
            } else {
                const errorMessage = await response.text();
                console.error('Lỗi khi tạo đường link:', errorMessage);
                message.error(`Lỗi khi tạo đường link: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo đường link:', error.message);
            message.error(`Lỗi khi tạo đường link: ${error.message}`);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleLinkChange = (e) => {
        setLinkValue(e.target.value);
    };

    return (
        <>
            <Button onClick={showModal} className='action-button'>Hành động</Button>
            <Modal title="Chỉnh sửa hồ sơ" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Select
                    placeholder="Chọn loại link"
                    style={{ width: '100%', marginBottom: '1rem' }}
                    onChange={handleOptionChange}
                    value={selectedOption}
                >
                    <Option value="facebook">Facebook</Option>
                    <Option value="instagram">Instagram</Option>
                    <Option value="tiktok">TikTok</Option>
                    <Option value="youtube">YouTube</Option>
                    <Option value="twitter">Twitter</Option>
                </Select>
                <Input
                    placeholder="Nhập đường link"
                    value={linkValue}
                    onChange={handleLinkChange}
                />
            </Modal>
        </>
    );
};

ActionProfile.propTypes = {
    profileId: PropTypes.any.isRequired,
};

export default ActionProfile;
