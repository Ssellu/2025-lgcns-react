import { useState } from 'react';

function Ex01XMLHttpRequest() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setUsers(data);
      }
      setLoading(false);
    };
    
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
    xhr.send();
  };

  return (
    <div>
      <h3>XMLHttpRequest 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      {loading && <p>로딩 중...</p>}
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex01XMLHttpRequest;