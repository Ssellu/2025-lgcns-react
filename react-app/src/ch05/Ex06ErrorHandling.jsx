// Ex06ErrorHandling.jsx - 포괄적인 API 에러 처리
import { useState, useEffect } from 'react';

// 에러 타입별 메시지 매핑
const getErrorMessage = (error, status) => {
  if (!navigator.onLine) {
    return '🌐 인터넷 연결을 확인해주세요.';
  }
  
  switch (status) {
    case 400:
      return '❌ 잘못된 요청입니다. 입력값을 확인해주세요.';
    case 401:
      return '🔒 인증이 필요합니다. 로그인해주세요.';
    case 403:
      return '🚫 접근 권한이 없습니다.';
    case 404:
      return '🔍 요청한 데이터를 찾을 수 없습니다.';
    case 500:
      return '🔧 서버 내부 오류가 발생했습니다.';
    case 503:
      return '⏰ 서버가 일시적으로 사용할 수 없습니다.';
    default:
      if (error?.name === 'TypeError') {
        return '🌐 네트워크 연결 오류가 발생했습니다.';
      }
      return `⚠️ 알 수 없는 오류: ${error?.message || '요청 실패'}`;
  }
};

export default function Ex06ErrorHandling() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState('users');

  // 다양한 테스트용 엔드포인트
  const endpoints = {
    users: { 
      url: 'https://jsonplaceholder.typicode.com/users',
      label: '✅ 정상 요청 (사용자)'
    },
    posts: { 
      url: 'https://jsonplaceholder.typicode.com/posts?_limit=5',
      label: '✅ 정상 요청 (포스트)'
    },
    notfound: { 
      url: 'https://jsonplaceholder.typicode.com/notfound',
      label: '❌ 404 에러 테스트'
    },
    invalid: { 
      url: 'https://invalid-url-that-does-not-exist.com/api',
      label: '🌐 네트워크 에러 테스트'
    },
    timeout: { 
      url: 'https://httpstat.us/200?sleep=10000',
      label: '⏰ 타임아웃 테스트'
    }
  };

  // 재시도 로직이 포함된 fetch
  const fetchWithRetry = async (url, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1}/${maxRetries + 1}: Fetching ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`, { cause: { status: response.status } });
        }
        
        return await response.json();
        
      } catch (err) {
        lastError = err;
        console.error(`Attempt ${attempt + 1} failed:`, err);
        
        // 마지막 시도가 아니면 잠시 대기
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // 지수 백오프
          setRetryCount(prev => prev + 1);
        }
      }
    }
    
    throw lastError;
  };

  // 데이터 가져오기
  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    setData(null);
    setRetryCount(0);

    try {
      const url = endpoints[endpoint].url;
      const result = await fetchWithRetry(url);
      
      console.log('Fetch successful:', result);
      setData(result);
      
    } catch (err) {
      console.error('All fetch attempts failed:', err);
      
      const status = err.cause?.status;
      const errorMessage = getErrorMessage(err, status);
      
      setError({
        message: errorMessage,
        originalError: err.message,
        status,
        retries: retryCount
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 기본 데이터 로드
  useEffect(() => {
    fetchData('users');
  }, []);

  // 엔드포인트 변경 핸들러
  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint);
    fetchData(endpoint);
  };

  // 재시도 핸들러
  const handleRetry = () => {
    fetchData(selectedEndpoint);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h3>Ex06: 포괄적인 API 에러 처리</h3>
      <p>다양한 에러 상황을 처리하고 재시도 로직을 구현한 예제입니다.</p>

      {/* 엔드포인트 선택 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>🔗 테스트할 엔드포인트 선택:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {Object.entries(endpoints).map(([key, endpoint]) => (
            <button
              key={key}
              onClick={() => handleEndpointChange(key)}
              disabled={loading}
              style={{
                padding: '8px 12px',
                backgroundColor: selectedEndpoint === key ? '#007bff' : '#f8f9fa',
                color: selectedEndpoint === key ? 'white' : '#333',
                border: selectedEndpoint === key ? 'none' : '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {endpoint.label}
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '6px',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>⏳ 데이터를 가져오는 중...</div>
          {retryCount > 0 && (
            <div style={{ fontSize: '14px', color: '#666' }}>
              재시도 횟수: {retryCount}
            </div>
          )}
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '6px', 
          padding: '15px',
          marginBottom: '15px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>
            🚨 요청 실패
          </h4>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>사용자 메시지:</strong>
            <div style={{ color: '#721c24', fontSize: '16px', margin: '5px 0' }}>
              {error.message}
            </div>
          </div>

          <details style={{ marginBottom: '15px' }}>
            <summary style={{ cursor: 'pointer', color: '#856404' }}>
              🔍 기술적 세부정보
            </summary>
            <div style={{ 
              marginTop: '8px', 
              padding: '8px', 
              backgroundColor: '#fff3cd',
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              <div><strong>원본 에러:</strong> {error.originalError}</div>
              {error.status && <div><strong>HTTP 상태:</strong> {error.status}</div>}
              <div><strong>재시도 횟수:</strong> {error.retries}</div>
              <div><strong>선택된 엔드포인트:</strong> {endpoints[selectedEndpoint].url}</div>
            </div>
          </details>

          <button 
            onClick={handleRetry}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 다시 시도
          </button>
        </div>
      )}

      {/* 성공 데이터 표시 */}
      {data && !loading && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '6px', 
          padding: '15px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
            ✅ 데이터 로드 성공
          </h4>
          
          <div style={{ marginBottom: '10px', color: '#155724' }}>
            총 {Array.isArray(data) ? data.length : 1}개의 항목을 가져왔습니다.
          </div>

          <div style={{ 
            maxHeight: '300px', 
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px'
          }}>
            <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(Array.isArray(data) ? data.slice(0, 3) : data, null, 2)}
            </pre>
            {Array.isArray(data) && data.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '8px', color: '#666' }}>
                ... 및 {data.length - 3}개 더
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#ffeaa7', borderRadius: '4px' }}>
        <strong>🛡️ 에러 처리 전략:</strong>
        <ul>
          <li><strong>상태 코드별 처리:</strong> HTTP 상태에 따른 맞춤 메시지</li>
          <li><strong>네트워크 에러 감지:</strong> 연결 상태 확인</li>
          <li><strong>자동 재시도:</strong> 실패 시 지수 백오프로 재시도</li>
          <li><strong>타임아웃 설정:</strong> AbortController로 요청 시간 제한</li>
          <li><strong>사용자 친화적 메시지:</strong> 기술적 에러를 이해하기 쉽게 변환</li>
        </ul>
      </div>
    </div>
  );
}