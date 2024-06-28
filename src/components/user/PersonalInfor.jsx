import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LayoutUser from './LayoutUser';

const PersonalInfo = ({ accessToken }) => {
    const [avata, setAvatar] = useState(null);
    const [backgroundavata, setBackgroundAvatar] = useState(null);
    const [fullname, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [bod, setBod] = useState('');
    const [introduce, setIntroduce] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avata', avata);
        formData.append('backgroundavata', backgroundavata);
        formData.append('fullname', fullname);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('bod', bod);
        formData.append('introduce', introduce);

        console.log('Avata:', avata ? avata.name : 'Not attached');
        console.log('Background Avatar:', backgroundavata ? backgroundavata.name : 'Not attached');

        const token = localStorage.getItem('accessToken');
        const accountId = localStorage.getItem('id');

        try {
            const response = await fetch('http://192.168.1.7:3000/createprofile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'AccountId': accountId
                },
                body: formData,
            });

            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });


            if (response.status === 200) {
                console.log('Profile created successfully');
                navigate('/user'); // Điều hướng tới trang profile
            } else {
                console.error('Error creating profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <LayoutUser accessToken={accessToken}>
            <div className="container">
                <h2>Thông tin cá nhân</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data' >
                    <div className="form-group">
                        <label>Avatar</label>
                        <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setAvatar)} />
                    </div>
                    <div className="form-group">
                        <label>Background Avatar</label>
                        <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setBackgroundAvatar)} />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" className="form-control" value={fullname} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" className="form-control" value={bod} onChange={(e) => setBod(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Introduce</label>
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