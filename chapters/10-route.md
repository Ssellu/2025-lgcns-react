# Chapter 10: React Router

**[수업 목표]**
- React Router의 기본 개념과 설치 방법을 이해한다.
- 기본 라우팅 설정과 페이지 간 이동을 구현할 수 있다.
- 중첩 라우트와 동적 라우트를 활용할 수 있다.
- Link와 NavLink의 차이점을 이해하고 네비게이션을 구현한다.
- 404 페이지와 보호된 라우트를 만들 수 있다.
- 프로그래밍 방식으로 페이지 이동을 제어할 수 있다.

## 라우터란?
- React Router는 React 애플리케이션에서 페이지 간 이동을 관리하는 라이브러리
- SPA(Single Page Application)에서 URL에 따라 다른 컴포넌트를 보여줄 수 있도록 함

## 주요 특징

1. **선언적 라우팅**: JSX로 라우트를 정의
2. **중첩 지원**: 복잡한 레이아웃을 쉽게 
3. **동적 라우팅**: URL 파라미터를 활용
4. **히스토리 관리**: 브라우저의 뒤로/앞으로 버튼을 지원

## 기본 설치

```bash
npm install react-router-dom
```

## 1. 기본 라우팅

가장 기본적인 라우팅 설정입니다.

### 기본 사용법
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 2. 중첩 라우트

상위 라우트 안에 하위 라우트를 만드는 방법

### 기본 사용법
```jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav>메뉴</nav>
      <Outlet /> {/* 하위 컴포넌트가 여기 표시됩니다 */}
    </div>
  );
}

/**
 * Outlet이란?
 * - 중첩 라우트에서 하위 컴포넌트가 렌더링될 위치를 지정하는 특수 컴포넌트
 * - 부모 Route의 element 컴포넌트 안에서 자식 Route의 element가 표시될 자리를 만듦
 * - Vue.js의 <router-view>나 Angular의 <router-outlet>과 비슷한 역할
 * - 반드시 중첩 라우트의 부모 컴포넌트에서 사용해야 함
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 3. 동적 라우트

URL 파라미터를 사용하는 라우트

### 기본 사용법
```jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  return <div>상품 ID: {id}</div>;
}

// 라우트 설정
<Route path="/product/:id" element={<ProductDetail />} />
```

## 4. 네비게이션

Link와 NavLink를 사용한 페이지 이동입니다.

### 기본 사용법
```jsx
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">홈</Link>
      <NavLink 
        to="/about" 
        className={({ isActive }) => isActive ? "active" : ""}
      >
        소개
      </NavLink>
    </nav>
  );
}
```

## 5. 404 페이지

존재하지 않는 페이지 처리

### 기본 사용법
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## 6. 보호된 라우트

로그인이 필요한 페이지를 만드는 방법

### 기본 사용법
```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// 사용법
<Route 
  path="/profile" 
  element={
    <ProtectedRoute isAuthenticated={true}>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

## 7. 프로그래밍 방식 네비게이션

코드로 페이지를 이동하는 방법

### 기본 사용법
```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 처리 후
    navigate('/dashboard');
  };

  return (
    <button onClick={handleLogin}>로그인</button>
  );
}
```
