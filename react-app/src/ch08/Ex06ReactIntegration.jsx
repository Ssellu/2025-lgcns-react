import { useState, useEffect } from 'react';
import axios from 'axios';

// 커스텀 Hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    }
    
    setLoading(false);
  };

  return { users, loading, error, fetchUsers };
}

function Ex06ReactIntegration() {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers(); // 컴포넌트 마운트 시 자동 로드
  }, []);

  return (
    <div>
      <h3>React 통합 예제</h3>
      <button onClick={fetchUsers}>새로고침</button>
      
      {loading && <p>로딩 중...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ex06ReactIntegration;