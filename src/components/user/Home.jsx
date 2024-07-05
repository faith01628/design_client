import { useState, useEffect } from 'react';
import { Card, Spin, Alert } from 'antd';
import LayoutUser from './LayoutUser';
import { Link } from 'react-router-dom'; // Import Link từ React Router
import '../../assets/css/user/home.scss';
const Home = () => {
  const serverUrl = 'http://192.168.10.156:3000';

  const [bios, setBios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBios = async () => {
      try {
        const response = await fetch(`${serverUrl}/bio`, {
          method: "GET",
          headers: {
            // Thêm headers nếu cần
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
  }, []);

  // Hàm kiểm tra title và xác định URL
  const getUrlFromTitle = (title) => {
    const match = title.match(/bio (\d+)/i); // Tìm "bio" theo sau là số
    if (match && match[1]) {
      return `/user/bio${match[1].padStart(2, '0')}`; // Tạo URL dạng /user/bio01, /user/bio02, ...
    }
    return '/user/bio01'; // URL mặc định nếu không tìm thấy pattern trong title
  };

  return (
    <LayoutUser>
      <div style={{ padding: '20px', height: '91.5vh' }}>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {bios.map(bio => (
              <Link key={bio.id} to={getUrlFromTitle(bio.title)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card
                  style={{ width: 300, height: 400, margin: '10px' }}
                  cover={<img alt={bio.title} src={`${serverUrl}/${bio.imgbio}`} />}
                >
                  {/* <Card.Meta title={bio.title} /> */}
                </Card>
                <div className='title'>{bio.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </LayoutUser>
  );
};

export default Home;
