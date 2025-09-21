# 6. JSON Server

**[수업 목표]**

- JSON Server의 개념과 장점을 이해한다.
- JSON Server를 설치하고 설정하는 방법을 익힌다.
- Mock API를 구축하여 프론트엔드 개발을 효율적으로 진행할 수 있다.
- JSON Server의 다양한 기능(필터링, 정렬, 페이지네이션)을 활용할 수 있다.
- 실제 백엔드처럼 동작하는 REST API를 구축할 수 있다.
- React와 JSON Server를 연동하여 실용적인 애플리케이션을 개발할 수 있다.

# 1. JSON Server란?

## 1.1. JSON Server 개념

**JSON Server**는 간단한 JSON 파일을 사용하여 완전한 REST API를 구축할 수 있게 해주는 도구

### **주요 특징**
- **Zero Coding**: 코딩 없이 REST API 구축
- **Real REST API**: 실제 HTTP 메서드와 상태 코드 지원
- **빠른 프로토타이핑**: 프론트엔드 개발 시 백엔드 없이 개발 가능
- **실제 서버처럼 동작**: CORS, 에러 처리, 지연 시뮬레이션 등

### **언제 사용하나요?**
- 프론트엔드 개발 초기 단계
- API 설계 및 프로토타이핑
- 백엔드 개발 전 프론트엔드 개발
- 학습 및 테스트 용도
- 데모 및 프레젠테이션

## 1.2. 기존 방식 vs JSON Server

```javascript
// ❌ 기존 방식: Mock 데이터를 하드코딩
const mockUsers = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

// ✅ JSON Server: 실제 HTTP 요청
fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => console.log(users));
```

# 2. JSON Server 설치 및 설정

## 2.1. 설치 방법

### **글로벌 설치**
```bash
# npm을 사용하는 경우
npm install -g json-server

# yarn을 사용하는 경우
yarn global add json-server

# 버전 확인
json-server --version
```

### **프로젝트 로컬 설치**
```bash
# 개발 의존성으로 설치
npm install --save-dev json-server

# 또는
yarn add --dev json-server
```

## 2.2. 기본 JSON 파일 생성

### **db.json 파일 생성**
```json
{
  "users": [
    {
      "id": 1,
      "name": "홍길동",
      "email": "hong@example.com",
      "age": 25,
      "city": "서울"
    },
    {
      "id": 2,
      "name": "김영희",
      "email": "kim@example.com",
      "age": 30,
      "city": "부산"
    },
    {
      "id": 3,
      "name": "이철수",
      "email": "lee@example.com",
      "age": 28,
      "city": "대구"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "첫 번째 포스트",
      "content": "JSON Server는 정말 유용한 도구입니다.",
      "authorId": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "tags": ["javascript", "react", "json-server"]
    },
    {
      "id": 2,
      "title": "두 번째 포스트",
      "content": "프론트엔드 개발이 더 쉬워졌습니다.",
      "authorId": 2,
      "createdAt": "2024-01-16T14:20:00Z",
      "tags": ["frontend", "development"]
    }
  ],
  "comments": [
    {
      "id": 1,
      "postId": 1,
      "authorId": 2,
      "content": "좋은 내용이네요!",
      "createdAt": "2024-01-15T11:00:00Z"
    },
    {
      "id": 2,
      "postId": 1,
      "authorId": 3,
      "content": "동감합니다.",
      "createdAt": "2024-01-15T11:30:00Z"
    }
  ],
  "categories": [
    { "id": 1, "name": "기술", "description": "개발 관련 내용" },
    { "id": 2, "name": "일상", "description": "일상적인 이야기" }
  ]
}
```

## 2.3. 서버 실행

### **기본 실행**
```bash
# 기본 포트 3000에서 실행
json-server --watch db.json

# 포트 변경 (가장 일반적)
json-server --watch db.json --port 3001

# 다른 호스트에서 접근 허용
json-server --watch db.json --host 0.0.0.0

# 지연 시뮬레이션 (네트워크 지연 테스트용)
json-server --watch db.json --port 3001 --delay 1000
```

### **package.json 스크립트 설정 (선택사항)**
**개인 학습이나 간단한 테스트라면 위의 직접 명령어만으로 충분합니다!**

팀 프로젝트나 반복 사용시에 설정:

```json
{
  "scripts": {
    "json-server": "json-server --watch db.json --port 3001",
    "json-server:dev": "json-server --watch db.json --port 3001 --delay 1000"
  }
}
```
```bash
npm run json-server
npm run json-server:dev
```

# 3. JSON Server API 기본 사용법

## 3.1. REST API 엔드포인트

JSON Server는 자동으로 RESTful API를 생성:

| 메서드 | 엔드포인트 | 설명 | 예시 |
|--------|------------|------|------|
| **GET** | `/users` | 모든 사용자 조회 | `GET /users` |
| **GET** | `/users/1` | ID가 1인 사용자 조회 | `GET /users/1` |
| **POST** | `/users` | 새 사용자 생성 | `POST /users` |
| **PUT** | `/users/1` | ID가 1인 사용자 전체 수정 | `PUT /users/1` |
| **PATCH** | `/users/1` | ID가 1인 사용자 부분 수정 | `PATCH /users/1` |
| **DELETE** | `/users/1` | ID가 1인 사용자 삭제 | `DELETE /users/1` |

## 3.2. 기본 CRUD 예제

### **1. 조회 (GET)**
```javascript
// 모든 사용자 조회
fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => console.log('All users:', users));

// 특정 사용자 조회
fetch('http://localhost:3000/users/1')
  .then(response => response.json())
  .then(user => console.log('User 1:', user));
```

### **2. 생성 (POST)**
```javascript
const newUser = {
  name: '박민수',
  email: 'park@example.com',
  age: 32,
  city: '인천'
};

fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
})
  .then(response => response.json())
  .then(user => console.log('Created user:', user));
```

### **3. 수정 (PUT/PATCH)**
```javascript
// PUT: 전체 수정 (모든 필드 필요)
const updatedUser = {
  name: '홍길동 수정',
  email: 'hong.updated@example.com',
  age: 26,
  city: '서울'
};

fetch('http://localhost:3000/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedUser)
})
  .then(response => response.json())
  .then(user => console.log('Updated user:', user));

// PATCH: 부분 수정 (일부 필드만)
const partialUpdate = {
  age: 27
};

fetch('http://localhost:3000/users/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(partialUpdate)
})
  .then(response => response.json())
  .then(user => console.log('Partially updated user:', user));
```

### **4. 삭제 (DELETE)**
```javascript
fetch('http://localhost:3000/users/1', {
  method: 'DELETE'
})
  .then(response => {
    if (response.ok) {
      console.log('User deleted successfully');
    }
  });
```

# 4. 고급 기능

## 4.1. 필터링 (Filtering)

### **필드별 필터링**
```javascript
// 나이가 30인 사용자들
fetch('http://localhost:3000/users?age=30')

// 서울에 사는 사용자들
fetch('http://localhost:3000/users?city=서울')

// 여러 조건 (AND)
fetch('http://localhost:3000/users?age=25&city=서울')
```

### **검색 (Full-text search)**
```javascript
// 이름에 '홍'이 포함된 사용자 검색
fetch('http://localhost:3000/users?q=홍')

// 모든 필드에서 검색
fetch('http://localhost:3000/posts?q=javascript')
```

### **범위 필터링**
```javascript
// 나이가 25 이상인 사용자
fetch('http://localhost:3000/users?age_gte=25')

// 나이가 30 이하인 사용자  
fetch('http://localhost:3000/users?age_lte=30')

// 나이가 25 이상 30 이하인 사용자
fetch('http://localhost:3000/users?age_gte=25&age_lte=30')
```

## 4.2. 정렬 (Sorting)

```javascript
// 나이 오름차순 정렬
fetch('http://localhost:3000/users?_sort=age&_order=asc')

// 나이 내림차순 정렬
fetch('http://localhost:3000/users?_sort=age&_order=desc')

// 여러 필드 정렬 (도시별, 그 다음 나이별)
fetch('http://localhost:3000/users?_sort=city,age&_order=asc,desc')
```

## 4.3. 페이지네이션 (Pagination)

```javascript
// 첫 번째 페이지 (2개씩)
fetch('http://localhost:3000/users?_page=1&_limit=2')

// 두 번째 페이지 (2개씩)
fetch('http://localhost:3000/users?_page=2&_limit=2')

// offset을 이용한 페이지네이션
fetch('http://localhost:3000/users?_start=0&_limit=5') // 첫 5개
fetch('http://localhost:3000/users?_start=5&_limit=5') // 다음 5개
```

## 4.4. 관계 데이터 (Relationships)

### **Embed (중첩 데이터 포함)**
```javascript
// 포스트와 함께 댓글도 가져오기
fetch('http://localhost:3000/posts?_embed=comments')

// 사용자와 함께 작성한 포스트들도 가져오기
fetch('http://localhost:3000/users?_embed=posts')
```

### **Expand (참조 데이터 확장)**
```javascript
// 댓글과 함께 해당 포스트 정보도 가져오기
fetch('http://localhost:3000/comments?_expand=post')

// 포스트와 함께 작성자 정보도 가져오기
fetch('http://localhost:3000/posts?_expand=author')
```

- `_embed`: "내가 가진 것들도 같이 보여줘" (부모 → 자식들)
- `_expand`: "나와 관련된 정보도 같이 보여줘" (자식들 → 부모)

# 5. 설정 파일 활용

## 5.1. json-server.json 설정 파일

```json
{
  "port": 3001,
  "watch": true,
  "static": "./public",
  "read-only": false,
  "no-cors": false,
  "no-gzip": false,
  "routes": "routes.json",
  "delay": 1000
}
```

## 5.2. 커스텀 라우트 (routes.json)

```json
{
  "/api/*": "/$1",
  "/users/:id/posts": "/posts?authorId=:id",
  "/users/:id/comments": "/comments?authorId=:id",
  "/posts/:id/comments": "/comments?postId=:id"
}
```

이제 다음과 같이 접근할 수 있습니다:
```javascript
// /api/users → /users
fetch('http://localhost:3000/api/users')

// 특정 사용자의 포스트들
fetch('http://localhost:3000/users/1/posts')
```

# 6. React와 JSON Server 연동

## 6.1. 기본 연동 예제

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>사용자 목록</h2>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>이메일: {user.email}</p>
          <p>나이: {user.age}, 도시: {user.city}</p>
        </div>
      ))}
    </div>
  );
}
```

## 6.2. CRUD 기능이 포함된 완전한 예제

```jsx
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: ''
  });
  const [editingId, setEditingId] = useState(null);

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 추가/수정
  const saveUser = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `${API_BASE}/users/${editingId}` 
      : `${API_BASE}/users`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        })
      });

      if (response.ok) {
        fetchUsers();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // 사용자 삭제
  const deleteUser = async (id) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        await fetch(`${API_BASE}/users/${id}`, {
          method: 'DELETE'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // 수정 모드
  const editUser = (user) => {
    setFormData(user);
    setEditingId(user.id);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({ name: '', email: '', age: '', city: '' });
    setEditingId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>사용자 관리 시스템</h2>
      
      {/* 사용자 추가/수정 폼 */}
      <form onSubmit={saveUser}>
        <input
          type="text"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="나이"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="도시"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          required
        />
        <button type="submit">
          {editingId ? '수정' : '추가'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            취소
          </button>
        )}
      </form>

      {/* 사용자 목록 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div>
          {users.map(user => (
            <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h3>{user.name}</h3>
              <p>이메일: {user.email}</p>
              <p>나이: {user.age}, 도시: {user.city}</p>
              <button onClick={() => editUser(user)}>수정</button>
              <button onClick={() => deleteUser(user.id)}>삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManager;
```
