// Ex01BasicFetch.jsx - fetch API 기본 사용법
import { useState, useEffect } from 'react';

export default function Ex01BasicFetch() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 기본 fetch 사용법 시연
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
        setError(null);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Ex01: 기본 Fetch API</h3>
        <div>🔄 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h3>Ex01: 기본 Fetch API</h3>
        <div style={{ color: 'red' }}>❌ 에러: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Ex01: 기본 Fetch API 사용법</h3>
      <p>JSONPlaceholder API에서 사용자 목록을 가져오는 기본적인 fetch 예제입니다.</p>
      
      <div style={{ marginTop: '15px' }}>
        <strong>총 {users.length}명의 사용자</strong>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {users.slice(0, users.length).map(user => (
            <li key={user.id} style={{ 
              padding: '8px', 
              margin: '5px 0', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px' 
            }}>
              <strong>{user.name}</strong> ({user.username})
              <br />
              <small>📧 {user.email} | 🏢 {user.company.name}</small>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
        <strong>💡 학습 포인트:</strong>
        <ul>
          <li>fetch()의 기본 문법과 Promise 체인</li>
          <li>response.ok를 통한 HTTP 상태 확인</li>
          <li>로딩, 에러, 성공 상태 관리</li>
          <li>finally를 활용한 로딩 상태 정리</li>
        </ul>
      </div>
    </div>
  );
}