# 8. AJAX

**[수업 목표]**

- AJAX의 개념을 이해한다.
- XMLHttpRequest, Fetch API, Axios의 차이점을 학습한다.
- React에서 AJAX를 사용하는 방법을 익힌다.
- 에러 처리 방법을 학습한다.

# 1. AJAX란?

**AJAX (Asynchronous JavaScript And XML)**는 웹페이지를 새로고침하지 않고 서버와 데이터를 주고받는 기술

# 2. HTTP 클라이언트 비교

## 2.1. XMLHttpRequest (레거시)

```jsx
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
```

## 2.2. Fetch API (모던)

```jsx
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
```

## 2.3. Axios 라이브러리

### **설치**
```bash
npm install axios
```

```jsx
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
```

# 3. 에러 처리

```jsx
import { useState } from 'react';
import axios from 'axios';

function Ex04ErrorHandling() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    }
    
    setLoading(false);
  };

  return (
    <div>
      <h3>에러 처리 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      
      {loading && <p>로딩 중...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex04ErrorHandling;
```

# 4. Axios 인터셉터

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log('요청 시작:', config.url);
    return config;
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log('응답 성공:', response.status);
    return response;
  },
  (error) => {
    console.log('응답 에러:', error.message);
    return Promise.reject(error);
  }
);

function Ex05AxiosInterceptors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Axios 인터셉터 예제</h3>
      <button onClick={fetchUsers}>사용자 목록 가져오기</button>
      {loading && <p>로딩 중...</p>}
      <p>콘솔을 열어 인터셉터 로그를 확인하세요!</p>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

export default Ex05AxiosInterceptors;
```

# 5. React 통합 패턴

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// 커스텀 Hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    }
    
    setLoading(false);
  };

  return { users, loading, error, fetchUsers };
}

function Ex06ReactIntegration() {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers(); // 컴포넌트 마운트 시 자동 로드
  }, []);

  return (
    <div>
      <h3>React 통합 예제</h3>
      <button onClick={fetchUsers}>새로고침</button>
      
      {loading && <p>로딩 중...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ex06ReactIntegration;
```

# 6. 베스트 프랙티스

1. **에러 처리**: 항상 try-catch 또는 .catch() 사용
2. **로딩 상태**: 사용자에게 로딩 상태 표시
3. **사용자 경험**: 적절한 에러 메시지 제공
4. **성능**: 불필요한 API 호출 방지
5. **보안**: 민감한 데이터는 환경변수 사용