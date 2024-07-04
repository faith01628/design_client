import { useState, useEffect } from 'react';
import { Modal, Button, Select, Input, message } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

const { Option } = Select;

const ActionProfile = ({ profileId }) => {
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [linkValue, setLinkValue] = useState('');
    const [indexId, setIndexId] = useState(5); // Starting indexid from 4
    const [links, setLinks] = useState([]); // State to store existing links
    const [linkToDelete, setLinkToDelete] = useState(null); // State to store link to delete

    const token = localStorage.getItem('accessToken');

    // Fetch existing links on component mount or when profileId changes
    useEffect(() => {
        if (profileId) {
            fetchLinks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    const fetchLinks = async () => {
        try {
            const response = await axios.get(`http://192.168.10.156:3000/link/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.result === 1) {
                setLinks(response.data.data);
                // Calculate the next indexId based on the maximum indexId in existing links
                const maxIndexId = Math.max(...response.data.data.map(link => link.indexid), 0);
                setIndexId(maxIndexId + 1); // Increment for the next link creation
            } else {
                console.error('Error fetching links:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const showActionModal = () => {
        setIsActionModalVisible(true);
    };

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const handleOkAction = async () => {
        setIsActionModalVisible(false);

        const formData = {
            profileid: profileId,
            title: selectedOption,
            link: linkValue,
            indexid: indexId, // Use the calculated indexId
        };

        try {
            const existingLink = links.find(link => link.title === selectedOption);

            if (existingLink) {
                // Update link if it already exists
                const response = await axios.put(
                    `http://192.168.10.156:3000/updatelink/${existingLink.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.status === 200) {
                    message.success('Đã cập nhật đường link thành công');
                    fetchLinks(); // Refresh links after update
                } else {
                    message.error('Lỗi khi cập nhật đường link:', response.statusText);
                }
            } else {
                // Create new link if it does not exist
                const response = await axios.post('http://192.168.10.156:3000/createlink', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    message.success('Đã tạo đường link thành công');
                    fetchLinks(); // Refresh links after creation
                } else {
                    message.error('Lỗi khi tạo đường link:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Lỗi khi tạo hoặc cập nhật đường link:', error.message);
        }
    };

    const handleOkDelete = async () => {
        if (!linkToDelete) return;

        try {
            const response = await axios.delete(`http://192.168.10.156:3000/deletelink/${linkToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                message.success('Đã xóa đường link thành công');
                fetchLinks(); // Refresh links after deletion
            } else {
                message.error('Lỗi khi xóa đường link:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi xóa đường link:', error.message);
        }

        setIsDeleteModalVisible(false);
        setLinkToDelete(null);
    };

    const handleCancelAction = () => {
        setIsActionModalVisible(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setLinkToDelete(null);
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleLinkChange = (e) => {
        setLinkValue(e.target.value);
    };

    const handleDeleteOptionChange = (value) => {
        setLinkToDelete(value);
    };

    return (
        <>
            <Button onClick={showActionModal} className='action-button'>Tạo/Cập nhật link</Button>
            <Button onClick={showDeleteModal} className='action-button'>Xóa link</Button>

            <Modal
                title="Chỉnh sửa hồ sơ"
                visible={isActionModalVisible}
                onOk={handleOkAction}
                onCancel={handleCancelAction}
            >
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

            <Modal
                title="Xóa đường link"
                visible={isDeleteModalVisible}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                okText="Đồng ý"
                cancelText="Hủy"
            >
                <Select
                    placeholder="Chọn loại link để xóa"
                    style={{ width: '100%', marginBottom: '1rem' }}
                    onChange={handleDeleteOptionChange}
                    value={linkToDelete}
                >
                    {links.map(link => (
                        <Option key={link.id} value={link.id}>{link.title}</Option>
                    ))}
                </Select>
            </Modal>
        </>
    );
};

ActionProfile.propTypes = {
    profileId: PropTypes.any.isRequired,
};

export default ActionProfile;
