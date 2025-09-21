# 5. API 통신하기

**[수업 목표]**

- API와 REST API의 개념을 이해한다.
- HTTP 메서드(GET, POST, PUT, DELETE)의 역할과 사용법을 학습한다.
- JavaScript의 fetch API를 활용하여 서버와 통신할 수 있다.
- API 응답 데이터를 처리하고 React 컴포넌트에서 활용할 수 있다.
- 에러 처리와 로딩 상태 관리 방법을 익힌다.
- Public API를 활용한 실용적인 예제를 구현할 수 있다.

# 1. API란 무엇인가?

## 1.1. API (Application Programming Interface) 개념

**API**는 서로 다른 소프트웨어 애플리케이션이 서로 통신할 수 있게 해주는 인터페이스

### **일상생활의 API 비유**
- **레스토랑**: 메뉴판(API 문서) → 웨이터(API) → 주방(서버)
- **은행 ATM**: 화면과 버튼(API) → ATM 기계(서버) → 은행 시스템

### **웹 개발에서의 API**
- 프론트엔드와 백엔드 간의 데이터 교환
- 외부 서비스(날씨, 뉴스, 소셜미디어 등)와의 연동
- 마이크로서비스 간의 통신

## 1.2. REST API

`REST (Representational State Transfer)`는 웹 서비스 설계의 아키텍처 스타일

### **REST의 특징**
1. **무상태성(Stateless)**: 서버는 클라이언트의 상태를 저장하지 않음
2. **자원 중심**: URL로 자원을 식별
3. **HTTP 메서드 활용**: GET, POST, PUT, DELETE 등
4. **JSON 형식**: 주로 JSON으로 데이터 교환

### **REST API의 구조 예시**
```
GET    /api/users      → 모든 사용자 조회
GET    /api/users/1    → ID가 1인 사용자 조회
POST   /api/users      → 새로운 사용자 생성
PUT    /api/users/1    → ID가 1인 사용자 수정
DELETE /api/users/1    → ID가 1인 사용자 삭제
```

# 2. HTTP 메서드

## 2.1. 주요 HTTP 메서드

| 메서드 | 목적 | 특징 | 예시 |
|--------|------|------|------|
| **GET** | 데이터 조회 | 안전, 멱등성 | 사용자 목록 가져오기 |
| **POST** | 데이터 생성 | 안전하지 않음 | 새 사용자 등록 |
| **PUT** | 데이터 전체 수정 | 멱등성 | 사용자 정보 전체 업데이트 |
| **PATCH** | 데이터 부분 수정 | - | 사용자 이름만 변경 |
| **DELETE** | 데이터 삭제 | 멱등성 | 사용자 계정 삭제 |

### **멱등성이란?**
같은 요청을 여러 번 보내도 결과가 동일한 성질
- GET /users/1 → 여러 번 호출해도 같은 결과
- DELETE /users/1 → 여러 번 호출해도 결과 동일 (이미 삭제됨)

# 3. Fetch API 사용하기

## 3.1. Fetch API 기본 문법

```javascript
fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### **기본 GET 요청**

```javascript
// 기본 GET 요청
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Users:', data);
  })
  .catch(error => {
    console.error('There was a problem:', error);
  });
```

## 3.2. POST 요청

```javascript
// POST 요청으로 새 데이터 생성
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '010-1234-5678'
};

fetch('https://jsonplaceholder.typicode.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newUser)
})
  .then(response => response.json())
  .then(data => {
    console.log('Created user:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## 3.3. PUT과 DELETE 요청

```javascript
// PUT 요청으로 데이터 수정
const updatedUser = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '010-5678-9012'
};

fetch('https://jsonplaceholder.typicode.com/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatedUser)
})
  .then(response => response.json())
  .then(data => console.log('Updated user:', data));

// DELETE 요청으로 데이터 삭제
fetch('https://jsonplaceholder.typicode.com/users/1', {
  method: 'DELETE'
})
  .then(response => {
    if (response.ok) {
      console.log('User deleted successfully');
    }
  });
```

# 4. React에서 API 사용하기

## 4.1. 기본 API 호출 예제

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div>
      <h2>사용자 목록</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 4.2. 데이터 생성 (POST) 예제

```jsx
import { useState } from 'react';

function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newUser = await response.json();
        setMessage(`사용자가 생성되었습니다! ID: ${newUser.id}`);
        setFormData({ name: '', email: '', phone: '' }); // 폼 초기화
      }
    } catch (error) {
      setMessage('사용자 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>새 사용자 추가</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="전화번호"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '사용자 생성'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
```

## 4.3. 커스텀 Hook으로 API 로직 분리

```jsx
import { useState, useEffect } from 'react';

// 커스텀 Hook
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// 커스텀 Hook 사용하는 컴포넌트
function PostList() {
  const { data: posts, loading, error, refetch } = useApi('https://jsonplaceholder.typicode.com/posts');

  if (loading) return <div>포스트를 불러오는 중...</div>;
  if (error) return <div>에러: {error} <button onClick={refetch}>재시도</button></div>;

  return (
    <div>
      <h2>포스트 목록 <button onClick={refetch}>새로고침</button></h2>
      {posts?.slice(0, 5).map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

# 5. 에러 처리와 로딩 상태

```jsx
import { useState, useEffect } from 'react';

function RobustApiComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataWithErrorHandling = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      // HTTP 상태 코드별 에러 처리
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error('데이터를 찾을 수 없습니다.');
          case 500:
            throw new Error('서버 내부 오류가 발생했습니다.');
          case 403:
            throw new Error('접근 권한이 없습니다.');
          default:
            throw new Error(`HTTP 에러: ${response.status}`);
        }
      }

      const result = await response.json();
      setData(result);

    } catch (err) {
      if (err.name === 'TypeError') {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchDataWithErrorHandling('https://jsonplaceholder.typicode.com/users');
  };

  useEffect(() => {
    retry();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div>로딩 중...</div>
        <div style={{ marginTop: '10px' }}>⭕ 데이터를 가져오고 있습니다</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        border: '2px solid #ff4444', 
        borderRadius: '8px',
        backgroundColor: '#ffebee'
      }}>
        <h3>❌ 오류 발생</h3>
        <p>{error}</p>
        <button 
          onClick={retry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 성공 상태
  return (
    <div>
      <h2>✅ 데이터 로드 성공</h2>
      <p>총 {data?.length}개의 사용자 정보를 가져왔습니다.</p>
      <ul>
        {data?.slice(0, 3).map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

# 6. Public API 활용 예제: GitHub API 사용자 검색

```jsx
import { useState } from 'react';

function GitHubUserSearch() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUser = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 사용자 정보 가져오기
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      const userData = await userResponse.json();
      setUser(userData);

      // 저장소 정보 가져오기 (최근 5개)
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
      const reposData = await reposResponse.json();
      setRepos(reposData);

    } catch (err) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>GitHub 사용자 검색</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub 사용자명을 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && searchUser()}
          style={{ padding: '8px', width: '70%' }}
        />
        <button 
          onClick={searchUser} 
          disabled={loading}
          style={{ padding: '8px 16px', marginLeft: '8px' }}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          에러: {error}
        </div>
      )}

      {user && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <img 
              src={user.avatar_url} 
              alt={user.login} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '15px' }}
            />
            <div>
              <h3>{user.name || user.login}</h3>
              <p>{user.bio}</p>
              <p>팔로워: {user.followers} | 팔로잉: {user.following}</p>
            </div>
          </div>

          <h4>최근 저장소:</h4>
          {repos.map(repo => (
            <div key={repo.id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <strong>{repo.name}</strong>
              {repo.description && <p>{repo.description}</p>}
              <small>⭐ {repo.stargazers_count} | 언어: {repo.language || 'N/A'}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

# 7. 베스트 프랙티스

## 7.1. API 호출 최적화

1. **중복 요청 방지**: debounce나 throttle 활용
2. **캐싱**: 동일한 데이터는 캐싱하여 재사용
3. **에러 재시도**: 네트워크 오류 시 자동 재시도
4. **로딩 상태 관리**: 사용자 경험 개선

## 7.2. 보안 고려사항

1. **API 키 보호**: 환경변수 사용, 프론트엔드에 민감한 키 노출 금지
2. **CORS 이해**: Cross-Origin Resource Sharing 정책
3. **입력값 검증**: 사용자 입력값 검증 후 API 호출

## 7.3. 코드 구조화

```jsx
// 서비스 레이어 분리 (services/api.js)
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = {
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`).then(res => res.json()),
  post: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  // PUT, DELETE 등...
};

// 컴포넌트에서 사용
import { api } from './services/api';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/users').then(setData);
  }, []);

  // ...
}
```

