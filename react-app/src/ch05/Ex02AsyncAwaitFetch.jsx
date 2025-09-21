// Ex02AsyncAwaitFetch.jsx - async/await를 사용한 깔끔한 fetch
import { useState, useEffect } from 'react';

export default function Ex02AsyncAwaitFetch() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // async/await를 사용한 fetch 함수
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching posts with async/await...');
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched posts:', data);
      setPosts(data);
      
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refreshPosts = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Ex02: Async/Await Fetch</h3>
        <div>⏳ 포스트를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Ex02: Async/Await를 사용한 Fetch</h3>
      <p>Promise 체인 대신 async/await를 사용하여 더 읽기 쉬운 비동기 코드를 작성했습니다.</p>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={refreshPosts}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 새로고침
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          ❌ 에러: {error}
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <strong>📝 포스트 목록 ({posts.length}개)</strong>
        <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
          {posts.map(post => (
            <div key={post.id} style={{ 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                {post.id}. {post.title}
              </h4>
              <p style={{ 
                margin: 0, 
                color: '#666', 
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {post.body}
              </p>
              <small style={{ color: '#888' }}>작성자 ID: {post.userId}</small>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>🎯 async/await의 장점:</strong>
        <ul>
          <li>Promise 체인보다 직관적이고 읽기 쉬운 코드</li>
          <li>try/catch로 통일된 에러 처리</li>
          <li>동기 코드처럼 작성할 수 있어 디버깅이 쉬움</li>
          <li>여러 비동기 작업을 순차적으로 처리하기 좋음</li>
        </ul>
      </div>
    </div>
  );
}