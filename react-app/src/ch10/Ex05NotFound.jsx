import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h4>홈 페이지</h4>
      <p>정상적인 페이지입니다.</p>
    </div>
  );
}

function Products() {
  return (
    <div>
      <h4>상품 페이지</h4>
      <p>상품 목록을 보여줍니다.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h3>404 - 페이지를 찾을 수 없습니다</h3>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}

function Ex05NotFound() {
  return (
    <div>
      <h2>404 페이지 예제</h2>
      <BrowserRouter>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">홈</Link> | {' '}
          <Link to="/products">상품</Link> | {' '}
          <Link to="/invalid">존재하지 않는 페이지</Link> | {' '}
          <Link to="/also-invalid/123">잘못된 경로</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex05NotFound;