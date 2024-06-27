import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'antd';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        // Regex để kiểm tra định dạng email
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail.com$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim() === '') {
            setError('Email không được bỏ trống.');
        } else if (!validateEmail(value)) {
            setError('Email không hợp lệ. Vui lòng nhập đúng định dạng email có đuôi @gmail.com.');
        } else {
            setError('');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email và mật khẩu không được bỏ trống.');
            setNotification(null); // Đặt null để đảm bảo không hiển thị cả hai loại thông báo cùng lúc
            return;
        }

        try {
            const response = await fetch('http://192.168.10.156:3000/createuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role: 'user' }),
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.status === 200) {
                setNotification({
                    type: 'success',
                    message: 'Đăng ký tài khoản thành công!',
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                setNotification(null);
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            setNotification(null);
        }
    };

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form">
                    <h2>Đăng ký</h2>
                    {error && <Alert message={error} type="error" showIcon />}
                    {notification && (
                        <Alert
                            message={notification.message}
                            type={notification.type}
                            showIcon
                            style={{ marginTop: '20px' }}
                        />
                    )}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Tên người dùng</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên người dùng"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group loginBtn">
                            <input
                                type="submit"
                                className="btn btn-primary btn-block"
                                value="Đăng ký"
                                disabled={error !== ''}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
