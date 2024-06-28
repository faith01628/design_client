import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css'; // File CSS riêng để tùy chỉnh giao diện
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://192.168.10.156:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                const data = await response.json();

                if (data.data.user && (data.data.user.role === 'admin' || data.data.user.role === 'user')) {
                    // Lưu thông tin đăng nhập vào Local Storage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('accessToken', data.data.token);
                    localStorage.setItem('id', data.data.user.id);
                    localStorage.setItem('userRole', data.data.user.role);
                    localStorage.setItem('userName', data.data.user.username);

                    // Cập nhật trạng thái đăng nhập
                    onLogin(true, data.data.user.role, data.data.token);
                    if (data.data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/user');
                    }
                } else {
                    setError('Vai trò người dùng không hợp lệ.');
                }
            } else if (response.status === 401 || response.status === 403) {
                setError('Email hoặc mật khẩu không đúng.');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                console.error('There was an error!', response.statusText);
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('There was an error!', error);
        }
    };

    const handleForgotPassword = () => {
        alert('Xử lý quên mật khẩu');
        // Có thể thêm logic xử lý quên mật khẩu ở đây
    };

    const handleRegister = () => {
        navigate('/register'); // Chuyển hướng sang trang đăng ký
    };

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form">
                    <h2>Đăng nhập</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <div className="forgot-password">
                                <a href="#" onClick={handleForgotPassword}>Quên mật khẩu?</a>
                            </div>
                        </div>
                        <div className="form-group loginBtn">
                            <input
                                type="submit"
                                className="btn btn-primary btn-block"
                                value="Đăng nhập"
                            />
                        </div>
                        <div className="register-link">
                            <p>Bạn chưa có tài khoản? <a href="#" onClick={handleRegister}>Đăng ký ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
