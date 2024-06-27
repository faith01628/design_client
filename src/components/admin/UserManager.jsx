import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Pagination, Input, Button, Space, Modal, Form } from 'antd';
import PropTypes from 'prop-types';
import LayoutAdmin from './LayoutAdmin';

const UserManager = ({ accessToken }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateData, setUpdateData] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!accessToken) {
                    console.error('Access token không có sẵn.');
                    return;
                }

                const response = await fetch('http://192.168.10.156:3000/users', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu từ máy chủ');
                }

                const responseData = await response.json();

                if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
                    console.error('Dữ liệu trả về từ server không hợp lệ:', responseData);
                    throw new Error('Dữ liệu trả về từ server không hợp lệ.');
                }

                const filteredUsers = responseData.data.filter(user => user.role === 'user');
                setUsers(filteredUsers);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                setError('Không thể lấy dữ liệu người dùng từ server. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [accessToken]);

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            sorter: true,
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 400,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 250,
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleUpdate(record)}>Update</Button>
                    <Button type="danger" onClick={() => confirmDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const pageSize = 6;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const usersToShow = filteredUsers.slice(startIndex, endIndex);

    const handleUpdate = (record) => {
        setSelectedUser(record);
        setUpdateData({ username: record.username, email: record.email, password: record.password });
        setModalVisible(true);
    };

    const confirmDelete = (record) => {
        setSelectedUser(record);
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa người dùng ${record.username}?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await fetch(`http://192.168.10.156:3000/deleteuser/${record.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error('Lỗi khi xóa người dùng từ máy chủ.');
                    }
    
                    const updatedUsers = users.filter(user => user.id !== record.id);
                    setUsers(updatedUsers);
                    setSelectedUser(null); // Đặt lại selectedUser về null
                } catch (error) {
                    console.error('Lỗi khi xóa người dùng:', error);
                    setError('Không thể xóa người dùng từ server. Vui lòng thử lại sau.');
                }
            },
        });
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedUser(null);
        setUpdateData({ username: '', email: '', password: '' });
    };

    const handleUpdateUser = async () => {
        try {
            if (!selectedUser) {
                console.error('Không có người dùng được chọn để cập nhật.');
                return;
            }

            const response = await fetch(`http://192.168.10.156:3000/updateuser/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật người dùng từ máy chủ.');
            }

            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        username: updateData.username,
                        email: updateData.email,
                        password: updateData.password,
                    };
                }
                return user;
            });

            setUsers(updatedUsers);
            setModalVisible(false);
            setSelectedUser(null);
            setUpdateData({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            setError('Không thể cập nhật người dùng từ server. Vui lòng thử lại sau.');
        }
    };

    return (
        <LayoutAdmin accessToken={accessToken}>
            <div style={{ padding: '20px', width: '100%' }}>
                <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Quản lý Người dùng
                    <Input
                        placeholder="Tìm kiếm theo tên"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300 }}
                    />
                </h2>
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message={error} type="error" showIcon />
                ) : (
                    <>
                        <Table
                            dataSource={usersToShow}
                            columns={columns}
                            pagination={false}
                            onChange={(_, __, sorter) => {
                                const { order } = sorter;
                                if (order === "ascend") {
                                    setUsers([...filteredUsers].sort((a, b) => a.username.localeCompare(b.username)));
                                } else if (order === "descend") {
                                    setUsers([...filteredUsers].sort((a, b) => b.username.localeCompare(a.username)));
                                }
                            }}
                        />
                        <Pagination
                            current={currentPage}
                            total={filteredUsers.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            style={{ marginTop: '20px', textAlign: 'right' }}
                        />
                    </>
                )}
            </div>

            <Modal
                title={`Cập nhật thông tin người dùng ${selectedUser ? selectedUser.username : ''}`}
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Hủy
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdateUser}>
                        Cập nhật
                    </Button>,
                ]}
            >
                {selectedUser && (
                    <Form layout="vertical">
                        <Input
                            value={updateData.username}
                            onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })}
                            hidden
                        />
                        <Form.Item label="Email">
                            <Input
                                value={updateData.email}
                                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Password">
                            <Input.Password
                                value={updateData.password}
                                onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </LayoutAdmin>
    );
};

UserManager.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

export default UserManager;
