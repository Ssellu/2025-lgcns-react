// Ex05CustomHook.jsx - API 호출을 위한 커스텀 훅 만들기
import { useState, useEffect } from 'react';

// 커스텀 Hook: useApi
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (fetchUrl = url) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching data from: ${fetchUrl}`);
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Fetched data:', result);
      setData(result);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = () => fetchData();
  const fetchFromUrl = (newUrl) => fetchData(newUrl);

  return { 
    data, 
    loading, 
    error, 
    refetch,
    fetchFromUrl
  };
}

// 커스텀 Hook: useFetch (더 고급 버전)
function useFetch(initialUrl, options = {}) {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    setUrl,
    refetch: fetchData
  };
}

// 메인 컴포넌트
export default function Ex05CustomHook() {
  // 기본 useApi Hook 사용
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError, 
    refetch: refetchUsers 
  } = useApi('https://jsonplaceholder.typicode.com/users?_limit=4');

  // 고급 useFetch Hook 사용
  const { 
    data: posts, 
    loading: postsLoading, 
    error: postsError, 
    setUrl: setPostsUrl,
    refetch: refetchPosts 
  } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=4');

  // URL 변경 테스트
  const loadDifferentPosts = () => {
    const randomUserId = Math.floor(Math.random() * 5) + 1;
    setPostsUrl(`https://jsonplaceholder.typicode.com/posts?userId=${randomUserId}&_limit=3`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h3>Ex05: 커스텀 Hook을 활용한 API 관리</h3>
      <p>useApi와 useFetch 커스텀 훅을 만들어 API 호출 로직을 재사용하고 관리를 쉽게 했습니다.</p>

      {/* useApi Hook 사용 예제 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <h4 style={{ margin: 0 }}>👥 사용자 목록 (useApi Hook)</h4>
          <button 
            onClick={refetchUsers}
            disabled={usersLoading}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: usersLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {usersLoading ? '⏳' : '🔄'} 새로고침
          </button>
        </div>

        {usersLoading && (
          <div style={{ color: '#6c757d' }}>🔄 사용자 정보를 불러오는 중...</div>
        )}

        {usersError && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            ❌ 에러: {usersError}
          </div>
        )}

        {users && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {users.map(user => (
              <div key={user.id} style={{ 
                padding: '10px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '6px' 
              }}>
                <strong>{user.name}</strong>
                <div style={{ fontSize: '13px', color: '#6c757d' }}>
                  {user.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* useFetch Hook 사용 예제 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <h4 style={{ margin: 0 }}>📝 포스트 목록 (useFetch Hook)</h4>
          <button 
            onClick={refetchPosts}
            disabled={postsLoading}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: postsLoading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 새로고침
          </button>
          <button 
            onClick={loadDifferentPosts}
            disabled={postsLoading}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#ffc107', 
              color: '#000', 
              border: 'none', 
              borderRadius: '4px',
              cursor: postsLoading ? 'not-allowed' : 'pointer'
            }}
          >
            🎲 랜덤 사용자 포스트
          </button>
        </div>

        {postsLoading && (
          <div style={{ color: '#6c757d' }}>⏳ 포스트를 불러오는 중...</div>
        )}

        {postsError && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            ❌ 에러: {postsError.message}
          </div>
        )}

        {posts && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {posts.map(post => (
              <div key={post.id} style={{ 
                padding: '12px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#856404' }}>
                  {post.title}
                </h5>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '14px', 
                  color: '#6c757d',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {post.body}
                </p>
                <small style={{ color: '#6c757d' }}>
                  포스트 #{post.id} | 작성자 ID: {post.userId}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
        <strong>🎯 커스텀 Hook의 장점:</strong>
        <ul>
          <li><strong>재사용성:</strong> 여러 컴포넌트에서 동일한 API 로직 사용</li>
          <li><strong>관심사 분리:</strong> UI와 데이터 로직 분리</li>
          <li><strong>테스트 용이성:</strong> Hook만 별도로 테스트 가능</li>
          <li><strong>유지보수:</strong> API 로직 변경 시 한 곳에서만 수정</li>
          <li><strong>상태 관리:</strong> loading, error, data 상태를 일관되게 관리</li>
        </ul>
      </div>
    </div>
  );
}