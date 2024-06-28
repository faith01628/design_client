import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LayoutUser from './LayoutUser';

const PersonalInfo = ({ accessToken }) => {
    const [id, setId] = useState(null);
    const [avata, setAvata] = useState(null);
    const [backgroundavata, setBackgroundavata] = useState(null);
    const [fullname, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [bod, setBod] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [isExistingProfile, setIsExistingProfile] = useState(false); // State to check if user has existing profile
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return '';

        // Assuming dateString is in "dd/MM/yyyy" format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const year = parts[2];
            const month = parts[1];
            const day = parts[0];
            return `${year}-${month}-${day}`;
        }

        return dateString; // Return original string if format is unexpected
    };

    const formatInputDate = (dateString) => {
        if (!dateString) return '';

        // Assuming dateString is in "yyyy-MM-dd" format
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            return `${day}/${month}/${year}`;
        }

        return dateString; // Return original string if format is unexpected
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken');
            const accountId = localStorage.getItem('id');

            try {
                // Kiểm tra thông tin cá nhân của người dùng bằng accountId
                const response = await fetch('http://192.168.10.156:3000/profilebyid', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'AccountId': accountId
                    }
                });

                if (response.status === 200) {
                    const profileData = await response.json();
                    console.log(profileData);
                    if (profileData) {
                        setId(profileData.data.id);
                        setAvata(profileData.data.avata || null);
                        setBackgroundavata(profileData.data.backgroundavata || null);
                        setFullName(profileData.data.fullname || '');
                        setPhone(profileData.data.phone || '');
                        setAddress(profileData.data.address || '');
                        setBod(formatDate(profileData.data.bod || ''));
                        setIntroduce(profileData.data.introduce || '');
                        setIsExistingProfile(true); // Đã có thông tin cá nhân
                    }
                } else if (response.status === 404) {
                    setIsExistingProfile(false); // Chưa có thông tin cá nhân
                } else {
                    console.error('Lỗi khi lấy thông tin cá nhân:', response.statusText);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin cá nhân:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        const accountId = localStorage.getItem('id');

        const formData = new FormData();
        formData.append('accountid', accountId);
        formData.append('avata', avata);
        formData.append('backgroundavata', backgroundavata);
        formData.append('fullname', fullname);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('bod', formatInputDate(bod));
        formData.append('introduce', introduce);

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        try {
            let apiUrl = 'http://192.168.10.156:3000/createprofile';
            let method = 'POST';

            if (isExistingProfile) {
                apiUrl = `http://192.168.10.156:3000/updateprofile/${id}`;
                method = 'PUT';
            }

            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            
            console.log(apiUrl);

            if (response.status === 200) {
                console.log('Cập nhật thông tin cá nhân thành công');
                navigate('/user'); // Chuyển hướng đến trang thông tin người dùng
            } else {
                console.error('Lỗi khi cập nhật thông tin cá nhân:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <LayoutUser accessToken={accessToken}>
            <div className="container">
                <h2>Thông tin cá nhân</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="form-group">
                        <label>avata</label>
                        <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setAvata)} />
                    </div>
                    <div className="form-group">
                        <label>Background avata</label>
                        <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setBackgroundavata)} />
                    </div>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" className="form-control" value={fullname} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh</label>
                        <input type="date" className="form-control" value={bod} onChange={(e) => setBod(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Giới thiệu</label>
                        <textarea className="form-control" value={introduce} onChange={(e) => setIntroduce(e.target.value)} required></textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </LayoutUser>
    );
};

PersonalInfo.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

export default PersonalInfo;
