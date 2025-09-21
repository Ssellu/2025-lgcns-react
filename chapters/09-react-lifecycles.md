# 9. React Lifecycles

**[수업 목표]**

- React 컴포넌트 생명주기를 이해한다.
- useEffect로 생명주기를 관리하는 방법을 익힌다.
- 컴포넌트 마운트, 업데이트, 언마운트를 이해한다.
- 메모리 누수를 방지하는 방법을 학습한다.

# 1. 생명주기란?

React 컴포넌트는 **생성 → 업데이트 → 소멸**의 생명주기를 가진다.

## 1.1. 생명주기 3단계

1. **마운트(Mount)**: 컴포넌트가 화면에 나타남
2. **업데이트(Update)**: 컴포넌트가 다시 렌더링됨
3. **언마운트(Unmount)**: 컴포넌트가 화면에서 사라짐

# 2. useEffect로 생명주기 관리

## 2.1. 마운트 시에만 실행

```jsx
import { useState, useEffect } from 'react';

function Ex01Mount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('컴포넌트가 마운트됨');
  }, []); // 빈 배열 = 마운트 시에만

  return (
    <div>
      <h3>마운트 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

export default Ex01Mount;
```

## 2.2. 업데이트 시마다 실행

```jsx
import { useState, useEffect } from 'react';

function Ex02Update() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('컴포넌트가 업데이트됨');
  }); // 의존성 배열 없음 = 매번 실행

  return (
    <div>
      <h3>업데이트 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

export default Ex02Update;
```

## 2.3. 언마운트 시 실행 (클린업)

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('타이머 시작');
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      console.log('타이머 정리');
      clearInterval(timer);
    };
  }, []);

  return <p>타이머: {seconds}초</p>;
}

function Ex03Cleanup() {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div>
      <h3>클린업 예제</h3>
      <button onClick={() => setShowTimer(!showTimer)}>
        {showTimer ? '타이머 숨기기' : '타이머 보이기'}
      </button>
      {showTimer && <Timer />}
    </div>
  );
}

export default Ex03Cleanup;
```

## 2.4. 특정 값 변경 시에만 실행

```jsx
import { useState, useEffect } from 'react';

function Ex04Dependency() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('count가 변경됨:', count);
  }, [count]); // count가 변경될 때만

  return (
    <div>
      <h3>의존성 배열 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
      
      <p>이름: {name}</p>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 입력"
      />
    </div>
  );
}

export default Ex04Dependency;
```

# 3. 실전 활용 예제

## 3.1. 데이터 가져오기

```jsx
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
```

## 3.2. 이벤트 리스너

```jsx
import { useState, useEffect } from 'react';

function Ex06EventListener() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <h3>이벤트 리스너 예제</h3>
      <p>창 너비: {windowWidth}px</p>
      <p>창 크기를 조절해보세요!</p>
    </div>
  );
}

export default Ex06EventListener;
```

## 3.3. 조건부 실행

```jsx
import { useState, useEffect } from 'react';

function Ex07Conditional() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <h3>조건부 실행 예제</h3>
      <select 
        value={userId} 
        onChange={(e) => setUserId(Number(e.target.value))}
      >
        <option value={1}>사용자 1</option>
        <option value={2}>사용자 2</option>
        <option value={3}>사용자 3</option>
      </select>

      {loading ? (
        <p>로딩 중...</p>
      ) : user ? (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
        </div>
      ) : (
        <p>사용자 정보 없음</p>
      )}
    </div>
  );
}

export default Ex07Conditional;
```

# 4. 주의사항

## 4.1. 메모리 누수 방지

- 타이머는 반드시 `clearInterval`, `clearTimeout`으로 정리
- 이벤트 리스너는 반드시 `removeEventListener`로 제거
- 구독은 반드시 해제하기

## 4.2. 무한 루프 방지

- 의존성 배열을 올바르게 설정
- 객체나 배열을 의존성에 넣을 때 주의

## 4.3. 비동기 처리 주의

- useEffect에 직접 async 함수 사용 금지
- 컴포넌트 언마운트 후 setState 방지

# 5. 좀 더 자세히 알아보기 

- 우리는 함수형 컴포넌트만 사용했지만, 클래스형 컴포넌트를 활용한 생명주기 관리도 읽어보는 것이 좋다.
- [React 라이프사이클 블로그](https://velog.io/@johnque/React-LifeCycle-Method)