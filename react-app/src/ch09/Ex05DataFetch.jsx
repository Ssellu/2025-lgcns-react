import { useState, useEffect } from 'react';

function Ex05DataFetch() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h3>데이터 가져오기 예제</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Ex05DataFetch;