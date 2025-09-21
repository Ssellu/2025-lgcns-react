import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h3>홈 페이지</h3>
      <p>메인 페이지입니다.</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h3>소개 페이지</h3>
      <p>회사 소개 페이지입니다.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h3>연락처 페이지</h3>
      <p>문의사항은 여기로 연락주세요.</p>
    </div>
  );
}

function Ex01Basic() {
  return (
    <div>
      <h2>기본 라우팅 예제</h2>
      <BrowserRouter>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">홈</Link> | {' '}
          <Link to="/about">소개</Link> | {' '}
          <Link to="/contact">연락처</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex01Basic;