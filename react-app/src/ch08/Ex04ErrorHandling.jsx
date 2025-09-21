import { useState } from 'react';
import axios from 'axios';

function Ex04ErrorHandling() {
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

  return (
    <div>
      <h3>에러 처리 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      
      {loading && <p>로딩 중...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex04ErrorHandling;