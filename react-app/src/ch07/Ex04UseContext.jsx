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