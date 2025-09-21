import { useState } from 'react';

function Ex02FetchAPI() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Fetch API 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      {loading && <p>로딩 중...</p>}
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex02FetchAPI;