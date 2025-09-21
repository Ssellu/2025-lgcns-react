import { useState } from 'react';
import axios from 'axios';

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log('요청 시작:', config.url);
    return config;
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log('응답 성공:', response.status);
    return response;
  },
  (error) => {
    console.log('응답 에러:', error.message);
    return Promise.reject(error);
  }
);

function Ex05AxiosInterceptors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Axios 인터셉터 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      {loading && <p>로딩 중...</p>}
      <p>콘솔을 열어 인터셉터 로그를 확인하세요!</p>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex05AxiosInterceptors;