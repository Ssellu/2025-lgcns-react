import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Login({ onLogin, isAuthenticated }) {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div>
      <h4>로그인</h4>
      <p>로그인이 필요합니다.</p>
      <button onClick={onLogin}>로그인하기</button>
    </div>
  );
}

function Dashboard({ onLogout, user }) {
  return (
    <div>
      <h4>대시보드</h4>
      <p>안녕하세요, {user}님!</p>
      <p>로그인 후에만 볼 수 있는 페이지입니다.</p>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
}

function Profile({ user }) {
  return (
    <div>
      <h4>프로필</h4>
      <p>사용자: {user}</p>
      <p>이것도 보호된 페이지입니다.</p>
    </div>
  );
}

function PublicPage() {
  return (
    <div>
      <h4>공개 페이지</h4>
      <p>누구나 볼 수 있는 페이지입니다.</p>
    </div>
  );
}

function Ex06Protected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user] = useState('김사용자');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      <h2>보호된 라우트 예제</h2>
      <p>로그인 상태: {isAuthenticated ? '로그인됨' : '로그아웃됨'}</p>
      
      <BrowserRouter>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/public">공개 페이지</Link> | {' '}
          <Link to="/login">로그인</Link> | {' '}
          <Link to="/dashboard">대시보드</Link> | {' '}
          <Link to="/profile">프로필</Link>
        </nav>
        
        <Routes>
          <Route path="/public" element={<PublicPage />} />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile user={user} />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/public" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex06Protected;