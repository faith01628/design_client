import { useState } from 'react';
import { Modal, Button } from 'antd';

const ActionProfile = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button onClick={showModal} className='action-button'>Action</Button>
            <Modal title="Edit Profile" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Button key="edit">Edit</Button>
                <Button key="delete">Delete</Button>
                <Button key="add">Add</Button>
            </Modal>
        </>
    );
};

export default ActionProfile;
