import { useState } from 'react';
import axios from 'axios';

function Ex03AxiosBasics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Axios error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Axios 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      {loading && <p>로딩 중...</p>}
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex03AxiosBasics;