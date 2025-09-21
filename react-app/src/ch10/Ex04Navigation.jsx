import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function Home() {
  return <div><h4>홈 페이지</h4><p>환영합니다!</p></div>;
}

function About() {
  return <div><h4>회사 소개</h4><p>우리 회사에 대해 알아보세요.</p></div>;
}

function Services() {
  return <div><h4>서비스</h4><p>제공하는 서비스를 확인하세요.</p></div>;
}

function Contact() {
  return <div><h4>연락처</h4><p>언제든지 연락주세요!</p></div>;
}

function Ex04Navigation() {
  const activeStyle = {
    color: 'red',
    fontWeight: 'bold',
    textDecoration: 'none'
  };
  
  const normalStyle = {
    color: 'blue',
    textDecoration: 'none',
    margin: '0 10px'
  };

  return (
    <div>
      <h2>네비게이션 예제</h2>
      <BrowserRouter>
        <nav style={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>일반 Link:</strong><br />
            <Link to="/" style={normalStyle}>홈</Link>
            <Link to="/about" style={normalStyle}>소개</Link>
            <Link to="/services" style={normalStyle}>서비스</Link>
            <Link to="/contact" style={normalStyle}>연락처</Link>
          </div>
          
          <div>
            <strong>NavLink (활성 상태 표시):</strong><br />
            <NavLink 
              to="/" 
              style={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              홈
            </NavLink>
            <NavLink 
              to="/about" 
              style={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              소개
            </NavLink>
            <NavLink 
              to="/services" 
              style={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              서비스
            </NavLink>
            <NavLink 
              to="/contact" 
              style={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              연락처
            </NavLink>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex04Navigation;