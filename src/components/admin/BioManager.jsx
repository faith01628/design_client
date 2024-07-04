import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Pagination, Input, Modal, Button, Form, message, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import LayoutAdmin from './LayoutAdmin';

const BioManager = ({ accessToken }) => {
    const serverUrl = 'http://192.168.10.156:3000';

    const [bios, setBios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBio, setSelectedBio] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [createData, setCreateData] = useState({ title: '', imgbio: null });
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({ id: '', title: '', imgbio: null, hot: false }); // Thêm trường hot vào đây

    useEffect(() => {
        const fetchBios = async () => {
            try {
                if (!accessToken) {
                    console.error('Access token không có sẵn.');
                    return;
                }

                const response = await fetch(`${serverUrl}/bio`, {
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

                setBios(responseData.data);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bio:', error);
                setError('Không thể lấy dữ liệu bio từ server. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchBios();
    }, [accessToken]);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            width: 300,
        },
        {
            title: 'Image',
            key: 'imgbio',
            render: (text, record) => (
                <img src={`${serverUrl}/${record.imgbio}`} alt={record.title} style={{ width: '20%', maxWidth: 300 }} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button.Group>
                    <Button type="primary" onClick={() => handleUpdateModalOpen(record)}>Update</Button>
                    <Button type="danger" onClick={() => handleDeleteBio(record)}>Delete</Button>
                </Button.Group>
            ),
        },
    ];

    const pageSize = 6;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const filteredBios = bios.filter(bio =>
        bio.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const biosToShow = filteredBios.slice(startIndex, endIndex);

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedBio(null);
    };

    const handleCreateModalOpen = () => {
        setCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setCreateModalVisible(false);
        setCreateData({ title: '', imgbio: null });
    };

    const handleCreateBio = async () => {
        try {
            const formData = new FormData();
            formData.append('title', createData.title);
            formData.append('imgbio', createData.imgbio);

            const response = await fetch(`${serverUrl}/createbio`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Lỗi khi tạo mới bio từ máy chủ.');
            }

            const responseData = await response.json();

            if (!responseData || !responseData.data) {
                throw new Error('Dữ liệu trả về từ server không hợp lệ.');
            }

            setBios([...bios, responseData.data]);
            message.success('Tạo mới bio thành công.');
            setCreateModalVisible(false);
            setCreateData({ title: '', imgbio: null });
        } catch (error) {
            console.error('Lỗi khi tạo mới bio:', error);
            message.error('Không thể tạo mới bio từ server. Vui lòng thử lại sau.');
        }
    };

    const handleUpdateModalOpen = (bio) => {
        setUpdateData({ id: bio.id, title: bio.title, imgbio: bio.imgbio, hot: bio.hot }); // Đặt giá trị cho trường hot
        setUpdateModalVisible(true);
    };

    const handleUpdateModalClose = () => {
        setUpdateModalVisible(false);
        setUpdateData({ id: '', title: '', imgbio: null, hot: false }); // Đặt lại giá trị trường hot khi đóng modal
    };

    const handleUpdateBio = async () => {
        try {
            const formData = new FormData();
            formData.append('title', updateData.title);
            formData.append('imgbio', updateData.imgbio);
            formData.append('hotbio', updateData.hotbio); // Thêm trường hot vào FormData

            const response = await fetch(`${serverUrl}/updatebio/${updateData.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật bio từ máy chủ.');
            }

            const updatedBio = await response.json();

            if (!updatedBio || !updatedBio.data) {
                throw new Error('Dữ liệu trả về từ server không hợp lệ.');
            }

            const updatedBios = bios.map(bio =>
                bio.id === updatedBio.data.id ? updatedBio.data : bio
            );

            setBios(updatedBios);
            message.success('Cập nhật bio thành công.');
            setUpdateModalVisible(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật bio:', error);
            message.error('Không thể cập nhật bio từ server. Vui lòng thử lại sau.');
        }
    };

    const handleDeleteBio = async (bio) => {
        try {
            const response = await fetch(`${serverUrl}/deletebio/${bio.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Lỗi khi xóa bio từ máy chủ.');
            }

            // Xóa thành công, cập nhật danh sách bios bằng cách loại bỏ bio đã xóa
            setBios(bios.filter(item => item.id !== bio.id));
            message.success('Xóa bio thành công.');
        } catch (error) {
            console.error('Lỗi khi xóa bio:', error);
            message.error('Không thể xóa bio từ server. Vui lòng thử lại sau.');
        }
    };

    return (
        <LayoutAdmin accessToken={accessToken}>
            <div style={{ padding: '20px', width: '100%' }}>
                <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Quản lý Bio
                    <Button type="primary" onClick={handleCreateModalOpen}>
                        Tạo mới
                    </Button>
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề"
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
                            dataSource={biosToShow}
                            columns={columns}
                            pagination={false}
                        />
                        <Pagination
                            current={currentPage}
                            total={filteredBios.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            style={{ marginTop: '20px', textAlign: 'right' }}
                        />
                    </>
                )}
                <Modal
                    title={`Thông tin chi tiết: ${selectedBio ? selectedBio.title : ''}`}
                    visible={modalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" onClick={handleCloseModal}>
                            Đóng
                        </Button>,
                    ]}
                >
                    {selectedBio && (
                        <div>
                            <p><strong>Title:</strong> {selectedBio.title}</p>
                            <p><strong>Image:</strong></p>
                            <img src={`${serverUrl}/${selectedBio.imgbio}`} alt={selectedBio.title} style={{ maxWidth: '100%' }} />
                            <p><strong>Hot:</strong> {selectedBio.hot ? 'Có' : 'Không'}</p>
                        </div>
                    )}
                </Modal>
                <Modal
                    title="Tạo mới Bio"
                    visible={createModalVisible}
                    onCancel={handleCreateModalClose}
                    footer={[
                        <Button key="cancel" onClick={handleCreateModalClose}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleCreateBio}>
                            Tạo mới
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="Title">
                            <Input
                                value={createData.title}
                                onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                                placeholder="Nhập tiêu đề"
                            />
                        </Form.Item>
                        <Form.Item label="Image">
                            <Input
                                type="file"
                                onChange={(e) => setCreateData({ ...createData, imgbio: e.target.files[0] })}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Cập nhật Bio"
                    visible={updateModalVisible}
                    onCancel={handleUpdateModalClose}
                    footer={[
                        <Button key="cancel" onClick={handleUpdateModalClose}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleUpdateBio}>
                            Cập nhật
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="Title">
                            <Input
                                value={updateData.title}
                                onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                                placeholder="Nhập tiêu đề"
                            />
                        </Form.Item>
                        <Form.Item label="Image">
                            <Input
                                type="file"
                                onChange={(e) => setUpdateData({ ...updateData, imgbio: e.target.files[0] })}
                            />
                        </Form.Item>
                        <Form.Item label="Hot">
                            <Checkbox
                                checked={updateData.hotbio}
                                onChange={(e) => setUpdateData({ ...updateData, hotbio: e.target.checked })}
                            >
                                Có
                            </Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </LayoutAdmin>
    );
};

BioManager.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

export default BioManager;
