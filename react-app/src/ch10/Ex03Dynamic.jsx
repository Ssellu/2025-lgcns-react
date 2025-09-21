import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  
  const users = {
    '1': { name: '김철수', age: 25, email: 'kim@example.com' },
    '2': { name: '이영희', age: 30, email: 'lee@example.com' },
    '3': { name: '박민수', age: 28, email: 'park@example.com' }
  };
  
  const user = users[userId];
  
  if (!user) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }
  
  return (
    <div>
      <h4>사용자 프로필</h4>
      <p>ID: {userId}</p>
      <p>이름: {user.name}</p>
      <p>나이: {user.age}</p>
      <p>이메일: {user.email}</p>
    </div>
  );
}

function ProductDetail() {
  const { category, productId } = useParams();
  
  return (
    <div>
      <h4>상품 상세정보</h4>
      <p>카테고리: {category}</p>
      <p>상품 ID: {productId}</p>
    </div>
  );
}

function UserList() {
  return (
    <div>
      <h4>사용자 목록</h4>
      <Link to="/user/1">김철수</Link><br />
      <Link to="/user/2">이영희</Link><br />
      <Link to="/user/3">박민수</Link>
    </div>
  );
}

function Ex03Dynamic() {
  return (
    <div>
      <h2>동적 라우트 예제</h2>
      <BrowserRouter>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">사용자 목록</Link> | {' '}
          <Link to="/product/electronics/123">전자제품 상세</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/product/:category/:productId" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Ex03Dynamic;