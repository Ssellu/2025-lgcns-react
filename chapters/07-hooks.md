# 7. Hooks

**[수업 목표]**

- React Hooks의 개념과 장점을 이해한다
- useState, useEffect 외의 고급 Hooks를 학습한다
- useReducer, useContext, useMemo, useCallback의 활용법을 익힌다
- 커스텀 Hooks를 만들어 로직을 재사용할 수 있다
- Hook의 규칙을 이해하고 올바르게 사용할 수 있다
- 성능 최적화를 위한 Hook 활용법을 학습한다
- 실무에서 자주 사용되는 Hook 패턴들을 익힐 수 있다

# 1. React Hooks 개요

## 1.1. Hooks란 무엇인가?

**Hooks**는 React 16.8에서 도입된 기능으로, 함수 컴포넌트에서 React의 상태 관리와 생명주기 기능을 제어할 수 있는 함수들의 총칭

### **Hooks 이전 vs 이후**

```javascript
// ❌ 클래스 컴포넌트 (Hooks 이전)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({count: this.state.count + 1})}>
          +
        </button>
      </div>
    );
  }
}

// ✅ 함수 컴포넌트 + Hooks (Hooks 이후)
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  );
}
```

### **Hooks의 장점**
1. **간결성**: 클래스 보일러플레이트 제거
2. **재사용성**: 로직을 쉽게 재사용 가능
3. **테스트 용이성**: 함수형으로 테스트하기 쉬움
4. **성능**: 클래스보다 가볍고 빠름
5. **조합성**: 여러 Hook을 조합해 복잡한 로직 구성

## 1.2. Hook의 규칙

### **두 가지 핵심 규칙**
1. **최상위에서만 Hook 호출**: 반복문, 조건문, 중첩 함수 내에서 호출 금지
2. **React 함수에서만 Hook 호출**: 함수 컴포넌트나 커스텀 Hook에서만 사용

```javascript
// ❌ 잘못된 사용
function BadComponent() {
  if (someCondition) {
    const [state, setState] = useState(0); // 조건부 호출 금지
  }

  for (let i = 0; i < 3; i++) {
    useEffect(() => {}); // 반복문 내 호출 금지
  }

  function nestedFunction() {
    const [count, setCount] = useState(0); // 중첩 함수 내 호출 금지
  }
}

// ✅ 올바른 사용
function GoodComponent() {
  const [state, setState] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 조건부 로직은 Hook 내부에서
    if (someCondition) {
      setState(1);
    }
  }, []);

  return <div>...</div>;
}
```

# 2. 기본 Hooks 복습

## 2.1. useState

```jsx
import { useState } from 'react';

function StateExample() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: '', email: '' });
  const [items, setItems] = useState([]);

  // 함수형 업데이트
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  // 객체 상태 업데이트
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  // 배열 상태 업데이트
  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  return <div>상태 관리 예제</div>;
}
```

## 2.2. useEffect
```jsx
import { useEffect } from 'react';
```
```jsx
useEffect(() => {
    // 마운트 시 실행할 내용들
    return () => {
        // 언마운트 시 실행할 내용들
    };
}, 의존성_배열);  // 의존성 배열은 선택사항
```
```jsx
import { useState, useEffect } from 'react';

export default function Ex01UseEffect() {
  const [count, setCount] = useState(0);

  // 마운트 시에만 실행
  useEffect(() => {
    console.log('컴포넌트 마운트됨');
    return () => {
      console.log('컴포넌트 언마운트됨');
    };
  }, []);

  // count 변경 시마다 실행
  useEffect(() => {
    console.log(`Counter: ${count}`);
  }, [count]);

  // 매 렌더링마다 실행 (의존성 배열 생략)
  useEffect(() => {
    console.log('렌더링 완료');
    return () => {
      console.log('렌더링 종료');
    };
  });

  const increaseCount = () => {
    setCount(prev => prev + 1);
  };

  const decreaseCount = () => {
    setCount(prev => prev - 1);
  };

  return (
    <div>
        <button onClick={increaseCount}>+</button>
        <span> {count} </span>
        <button onClick={decreaseCount}>-</button>
    </div>
  );
}
```

# 3. 고급 Hooks

## 3.1. useReducer
복잡한 상태 로직을 관리할 때 useState보다 useReducer가 적합   
state와 비슷한 목적이지만, 값 지정 전 유효성 검사 등의 추가 로직(action)이 필요할 때 사용

### **기본 사용법**
1. `useReducer` import 
```jsx
import React, { useReducer } from 'react';
```
2. Reducer 함수 정의(Component 외부에)
```jsx
fuction 리듀서_함수(STATE, NEW_STATE){
    // ... 유효성 검사 등의 추가 로직
    return VALIDATED_NEW_STATE;
};

```
3. Reducer 생성(Component 내부에)
```jsx
const [STATE_GETTER, STATE_SETTER] = useReducer(리듀서_함수, DEFAULT_STATE);
```
4. `state` 값 조회: `STATE_GETTER` 활용
5. `state` 값 수정: `STATE_SETTER(NEW_STATE)`을 호출. 이때 `리듀서_함수(STATE, NEW_STATE)`가 실행

```jsx
import React, { useReducer } from 'react';

// 리듀서 함수
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

export default function Ex02UseReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h3>useReducer 예제</h3>
      <p>Count: {state.count}</p>
      
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

## 3.2. useContext

컴포넌트 트리 전체에 데이터를 공유할 때 사용. Props Drilling을 방지.

**Props Drilling**
- 중첩 Component 관계에서 자식에게 Props를 전달하기 위해 중간 자식 Component에게도 Props를 전달 해야하는 현상


### **기본 사용법**
1. Context 생성쪽
    1. `createContext` import 
    ```jsx
    import React, { createContext } from 'react';
    ```
    2. `Context` 생성(context 생성쪽. context 사용처가 외부 파일일 경우 export도 하기)
    ```jsx
    export const Context_이름 = createContext();
    ```
    3. Context Provider 컴포넌트 전달(context 생성쪽 -> context 사용쪽)
    ```jsx
    <Context_이름.Provider value={전달할_값_혹은_객체}>
        <Context를_전달할_자식_컴포넌트/>
    </Context_이름.Provider>
    ```
2. Context 사용쪽
    1. `useContext`, Context 객체 import 
    ```jsx
    import React, { useContext } from 'react';
    import { Context_이름 } from ...;
    ```
    2. Context 받아오기
    ```jsx
    const 전달_받은_값_혹은_객체 = useContext(Context_이름);
    ```

### 사용 예제 

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Context 생성
const UserContext = createContext();

// 2. Context Provider 컴포넌트
function UserProvider({ children }) {
  const [user, setUser] = useState('홍길동');
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. 최상위 컴포넌트 (App)
function Ex04UseContext() {
  return (
    <UserProvider>
      <div>
        <h3>useContext 예제</h3>
        <Header />
        <Main />
        <Footer />
      </div>
    </UserProvider>
  );
}

// 4. Header 컴포넌트 (중간 컴포넌트)
function Header() {
  return (
    <div>
      <h4>헤더</h4>
      <UserGreeting />
    </div>
  );
}

// 5. Main 컴포넌트 (중간 컴포넌트)
function Main() {
  return (
    <div>
      <h4>메인</h4>
      <UserProfile />
    </div>
  );
}

// 6. Footer 컴포넌트 (중간 컴포넌트)
function Footer() {
  return (
    <div>
      <h4>푸터</h4>
      <UserSettings />
    </div>
  );
}

// 7. 실제로 user 데이터가 필요한 컴포넌트들
function UserGreeting() {
  const { user } = useContext(UserContext);
  return <p>안녕하세요, {user}님!</p>;
}

function UserProfile() {
  const { user } = useContext(UserContext);
  return <p>프로필: {user}</p>;
}

function UserSettings() {
  const { user, setUser } = useContext(UserContext);
  
  return (
    <div>
      <p>설정 페이지 - 현재 사용자: {user}</p>
      <button onClick={() => setUser('김철수')}>김철수로 변경</button>
      <button onClick={() => setUser('이영희')}>이영희로 변경</button>
    </div>
  );
}

export default Ex04UseContext;
```

## 3.3. useMemo
계산 비용이 큰 값을 메모이제이션하여 성능을 최적화
### **기본 사용법**
1. `useMemo` import
```jsx
import { useMemo } from 'react';
```
2. 메모이제이션할 계산 함수 작성 (컴포넌트 내부 또는 외부)
```jsx
function 계산함수(입력값1, 입력값2) {
  // ...비용이 큰 연산
  return 결과값;
}
```
3. useMemo로 값 메모이제이션 (컴포넌트 내부)
```jsx
const memoizedValue = useMemo(() => 계산함수(입력값1, 입력값2), [입력값1, 입력값2]);
```
4. memoizedValue를 일반 변수처럼 사용

### 사용 예제

```jsx
import { useState, useMemo } from 'react';

export default function Ex06UseMemo() {
  const [sortOrder, setSortOrder] = useState('asc');
  const [query, setQuery] = useState('');

  // 샘플 데이터
  const items = [
    { id: 1, name: 'Apple MacBook Pro' },
    { id: 2, name: 'Samsung Galaxy' },
    { id: 3, name: 'iPad Air' },
    { id: 4, name: 'Apple Watch' },
    { id: 5, name: 'AirPods Pro' },
  ];

  // 비용이 큰 계산을 메모이제이션
  const filteredAndSortedItems = useMemo(() => {
    console.log('🔥 필터링 및 정렬 실행 중...'); // 재계산될 때만 실행
    
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [items, query, sortOrder]); // 의존성 배열

  // 복잡한 계산 예제
  const statistics = useMemo(() => {
    console.log('📊 통계 계산 중...');
    return {
      total: items.length,
      filtered: filteredAndSortedItems.length,
      percentage: items.length > 0 ? 
        ((filteredAndSortedItems.length / items.length) * 100).toFixed(1) : '0'
    };
  }, [items.length, filteredAndSortedItems.length]);

  return (
    <div>
      <h3>Ex06 - useMemo 예제</h3>
      
      <div>
        <input 
          type="text"
          placeholder="검색어 입력..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div>
        <button onClick={() => setSortOrder('asc')}>오름차순</button>
        <button onClick={() => setSortOrder('desc')}>내림차순</button>
      </div>
      
      <div>
        <strong>통계:</strong> {statistics.filtered}/{statistics.total} ({statistics.percentage}%)
      </div>
      
      <ul>
        {filteredAndSortedItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 3.4. useCallback

함수를 메모이제이션하여 불필요한 렌더링을 방지합니다.

### **기본 사용법**
1. `useCallback` import
```jsx
import { useCallback } from 'react';
```
2. 메모이제이션할 함수 작성
```jsx
const 메모이제이션된_함수 = useCallback(() => {
  // 함수 로직
}, [의존성1, 의존성2]); // 의존성 배열
```
3. 메모이제이션된 함수를 일반 함수처럼 사용
```jsx
<Button onClick={메모이제이션된_함수} />
```

### 사용 예제

```jsx
import { useState, useCallback, memo } from 'react';

// 자식 컴포넌트 - React.memo로 래핑
const ChildButton = memo(({ label, onClick }) => {
  console.log(`${label} 렌더링됨`);
  return <button onClick={onClick}>{label}</button>;
});

export default function Ex07UseCallback() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [otherValue, setOtherValue] = useState(0);

  // ❌ useCallback 없음 (매번 새 함수 생성)
  const handleClick1 = () => {
    setCount1(count1 + 1);
  };

  // ✅ useCallback 사용 (함수 메모이제이션)
  const handleClick2 = useCallback(() => {
    setCount2(prev => prev + 1);
  }, []);

  return (
    <div>
      <h3>useCallback 예제</h3>
      
      <div>
        <p>다른 값: {otherValue}</p>
        <button onClick={() => setOtherValue(prev => prev + 1)}>
          다른 값 변경
        </button>
      </div>

      <div>
        <h4>❌ useCallback 없음</h4>
        <p>Count1: {count1}</p>
        <ChildButton label="Count1 증가" onClick={handleClick1} />
      </div>

      <div>
        <h4>✅ useCallback 사용</h4>
        <p>Count2: {count2}</p>
        <ChildButton label="Count2 증가" onClick={handleClick2} />
      </div>
    </div>
  );
}
```

# 4. 추가 Hooks

## 4.1. useRef

DOM 요소에 접근하거나 값을 유지할 때 사용합니다.

### **기본 사용법**
1. `useRef` import
```jsx
import { useRef } from 'react';
```
2. ref 객체 생성 (컴포넌트 내부)
```jsx
const ref객체 = useRef(초기값); // 초기값은 선택사항 (기본: null)
```
3. ref 사용
   - DOM 접근: JSX 요소에 `ref={ref객체}` 속성 추가
   - 값 접근/수정: `ref객체.current`로 값 조회/변경

### 사용 예제

```jsx
import { useRef, useEffect, useState } from 'react';

export default function Ex08UseRef() {
  const inputRef = useRef(null);
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  // DOM 조작
  const focusInput = () => {
    inputRef.current.focus();
  };

  // 값 유지 (렌더링 사이에 값 보존)
  useEffect(() => {
    countRef.current += 1;
    console.log(`렌더링 횟수: ${countRef.current}`);
  });

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Input에 포커스</button>
      
      <div>렌더링 횟수: {countRef.current}</div>
      <button onClick={() => setRenderCount(renderCount + 1)}>
        리렌더링 트리거
      </button>
    </div>
  );
};
```


# 5. 커스텀 Hooks

## 5.1. 기본 커스텀 Hook

```jsx
import { useState, useEffect } from 'react';

// 로컬 스토리지와 동기화하는 Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예제
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'ko');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">라이트</option>
        <option value="dark">다크</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

## 5.2. API 호출 커스텀 Hook

```jsx
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, JSON.stringify(options)]);

  const refetch = () => {
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
}

// 사용 예제
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error} <button onClick={refetch}>재시도</button></div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

# 6. 베스트 프랙티스

## 6.1. Hook 사용 가이드라인

1. **Hook 규칙 준수**: 최상위에서만, React 함수에서만
2. **의존성 배열 정확히 명시**: ESLint 규칙 활용
3. **과도한 최적화 피하기**: 필요할 때만 useMemo, useCallback 사용
4. **커스텀 Hook으로 로직 분리**: 재사용성과 테스트 용이성 증대
5. **명확한 네이밍**: Hook의 목적이 명확하게 드러나도록

## 6.2. 성능 최적화 팁

```jsx
// 1. 적절한 의존성 배열 사용
useEffect(() => {
  // expensive operation
}, [specificDependency]); // 모든 의존성 포함, 불필요한 의존성 제외

// 2. 함수형 업데이트 활용
const increment = useCallback(() => {
  setCount(prev => prev + 1); // 의존성에서 count 제외 가능
}, []); // 빈 의존성 배열

// 3. 계산 비용 고려한 메모이제이션
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]); // data가 변경될 때만 재계산
```
