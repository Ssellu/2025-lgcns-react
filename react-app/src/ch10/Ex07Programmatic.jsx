import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function NavigationDemo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState('');

  const handleSubmit = () => {
    if (formData.trim()) {
      // 폼 제출 후 성공 페이지로 이동
      navigate('/success', { 
        state: { message: `제출된 데이터: ${formData}` }
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 뒤로 가기
  };

  const handleGoForward = () => {
    navigate(1); // 앞으로 가기
  };

  const handleReplace = () => {
    navigate('/replaced', { replace: true }); // 현재 히스토리 교체
  };

  return (
    <div>
      <h4>프로그래밍 네비게이션</h4>
      <p>현재 경로: {location.pathname}</p>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="데이터 입력"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
        />
        <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
          제출하고 이동
        </button>
      </div>

      <div style={{ margin: '10px 0' }}>
        <button onClick={handleGoBack} style={{ margin: '5px' }}>뒤로 가기</button>
        <button onClick={handleGoForward} style={{ margin: '5px' }}>앞으로 가기</button>
        <button onClick={handleReplace} style={{ margin: '5px' }}>페이지 교체</button>
        <button onClick={() => navigate('/about')} style={{ margin: '5px' }}>
          소개 페이지로
        </button>
      </div>
    </div>
  );
}

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || '데이터가 없습니다';

  return (
    <div>
      <h4>제출 성공!</h4>
      <p>{message}</p>
      <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
  );
}

function About() {
  const navigate = useNavigate();

  return (
    <div>
      <h4>소개 페이지</h4>
      <p>프로그래밍 방식으로 이동한 페이지입니다.</p>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}

function Replaced() {
  const navigate = useNavigate();

  return (
    <div>
      <h4>교체된 페이지</h4>
      <p>이전 페이지가 히스토리에서 교체되었습니다.</p>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}

function Ex07Programmatic() {
  return (
    <div>
      <h2>프로그래밍 방식 네비게이션 예제</h2>
      <BrowserRouter>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">홈</Link> | {' '}
          <Link to="/about">소개</Link> | {' '}
          <Link to="/success">성공</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<NavigationDemo />} />
          <Route path="/success" element={<Success />} />
          <Route path="/about" element={<About />} />
          <Route path="/replaced" element={<Replaced />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex07Programmatic;