// Ex03PostRequest.jsx - POST 요청으로 데이터 생성하기
import { useState } from 'react';

export default function Ex03PostRequest() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setResponse(null);

    try {
      console.log('Sending POST request:', formData);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`POST 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log('POST response:', data);
      
      setResponse(data);
      
      // 폼 초기화 (선택적)
      setFormData({
        title: '',
        body: '',
        userId: 1
      });
      
    } catch (err) {
      console.error('POST error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Ex03: POST 요청으로 데이터 생성</h3>
      <p>새로운 포스트를 서버에 전송하는 POST 요청 예제입니다.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📝 제목:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="포스트 제목을 입력하세요"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📄 내용:
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="포스트 내용을 입력하세요"
            rows={5}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            👤 사용자 ID:
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {[1, 2, 3, 4, 5].map(id => (
              <option key={id} value={id}>사용자 {id}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: submitting ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? '📤 전송 중...' : '📤 포스트 생성'}
        </button>
      </form>

      {/* 에러 표시 */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          marginBottom: '15px'
        }}>
          <strong>❌ 오류:</strong> {error}
        </div>
      )}

      {/* 성공 응답 표시 */}
      {response && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>✅ 포스트가 성공적으로 생성되었습니다!</h4>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            <strong>서버 응답:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li><strong>ID:</strong> {response.id}</li>
              <li><strong>제목:</strong> {response.title}</li>
              <li><strong>내용:</strong> {response.body}</li>
              <li><strong>사용자 ID:</strong> {response.userId}</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <strong>💡 POST 요청 핵심 사항:</strong>
        <ul>
          <li><code>method: 'POST'</code> 설정 필수</li>
          <li><code>Content-Type: application/json</code> 헤더 설정</li>
          <li><code>JSON.stringify()</code>로 데이터 직렬화</li>
          <li>폼 검증과 로딩 상태 관리</li>
          <li>서버 응답 데이터 처리 및 사용자 피드백</li>
        </ul>
      </div>
    </div>
  );
}