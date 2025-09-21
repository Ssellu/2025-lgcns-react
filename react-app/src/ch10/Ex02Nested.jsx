import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
        <Link to="/">홈</Link> | {' '}
        <Link to="/products">상품</Link>
      </nav>
      <div style={{ padding: '10px', border: '1px solid #eee' }}>
        <Outlet />
      </div>
    </div>
  );
}

function Home() {
  return <div><h4>홈 페이지</h4></div>;
}

function Products() {
  return (
    <div>
      <h4>상품 목록</h4>
      <nav style={{ margin: '10px 0' }}>
        <Link to="/products/laptop">노트북</Link> | {' '}
        <Link to="/products/phone">스마트폰</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Laptop() {
  return <div>노트북 상품들</div>;
}

function Phone() {
  return <div>스마트폰 상품들</div>;
}

function Ex02Nested() {
  return (
    <div>
      <h2>중첩 라우트 예제</h2>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />}>
              <Route path="laptop" element={<Laptop />} />
              <Route path="phone" element={<Phone />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex02Nested;