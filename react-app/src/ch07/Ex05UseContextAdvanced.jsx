import React, { createContext, useContext, useReducer } from 'react';

// 테마 컨텍스트 생성
const ThemeContext = createContext();

// 사용자 컨텍스트 생성
const UserContext = createContext();

// 알림 컨텍스트 생성
const NotificationContext = createContext();

// 테마 관련
const THEME_ACTIONS = {
  TOGGLE_THEME: 'toggle_theme',
  SET_PRIMARY_COLOR: 'set_primary_color'
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        isDark: !state.isDark
      };
    case THEME_ACTIONS.SET_PRIMARY_COLOR:
      return {
        ...state,
        primaryColor: action.payload
      };
    default:
      return state;
  }
};

const initialTheme = {
  isDark: false,
  primaryColor: '#007bff'
};

// 사용자 관련
const USER_ACTIONS = {
  SET_USER: 'set_user',
  UPDATE_PROFILE: 'update_profile',
  LOGOUT: 'logout'
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return action.payload;
    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload
      };
    case USER_ACTIONS.LOGOUT:
      return null;
    default:
      return state;
  }
};

const initialUser = {
  name: '김개발',
  email: 'kim@example.com',
  role: 'developer',
  preferences: {
    language: 'ko',
    notifications: true
  }
};

// 알림 관련
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'add_notification',
  REMOVE_NOTIFICATION: 'remove_notification',
  CLEAR_ALL: 'clear_all'
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return [
        ...state,
        {
          id: Date.now(),
          ...action.payload,
          timestamp: new Date()
        }
      ];
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return state.filter(notification => notification.id !== action.payload);
    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return [];
    default:
      return state;
  }
};

// 컨텍스트 프로바이더 컴포넌트
function AppProvider({ children }) {
  const [theme, themeDispatch] = useReducer(themeReducer, initialTheme);
  const [user, userDispatch] = useReducer(userReducer, initialUser);
  const [notifications, notificationDispatch] = useReducer(notificationReducer, []);

  return (
    <ThemeContext.Provider value={{ theme, themeDispatch }}>
      <UserContext.Provider value={{ user, userDispatch }}>
        <NotificationContext.Provider value={{ notifications, notificationDispatch }}>
          {children}
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 커스텀 훅들
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppProvider');
  }
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within AppProvider');
  }
  return context;
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within AppProvider');
  }
  return context;
}

// 헤더 컴포넌트
function Header() {
  const { theme, themeDispatch } = useTheme();
  const { user, userDispatch } = useUser();
  const { notificationDispatch } = useNotifications();

  const headerStyle = {
    padding: '15px 20px',
    backgroundColor: theme.isDark ? '#343a40' : theme.primaryColor,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const handleLogout = () => {
    userDispatch({ type: USER_ACTIONS.LOGOUT });
    notificationDispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        type: 'info',
        message: '로그아웃되었습니다.'
      }
    });
  };

  return (
    <header style={headerStyle}>
      <h2>🌟 Context App</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>안녕하세요, {user?.name}님!</span>
        <button
          onClick={() => themeDispatch({ type: THEME_ACTIONS.TOGGLE_THEME })}
          style={{
            padding: '6px 12px',
            backgroundColor: theme.isDark ? '#ffc107' : '#6c757d',
            color: theme.isDark ? 'black' : 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {theme.isDark ? '🌞 라이트' : '🌙 다크'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}

// 사이드바 컴포넌트
function Sidebar() {
  const { theme, themeDispatch } = useTheme();
  const { user, userDispatch } = useUser();
  const { notificationDispatch } = useNotifications();

  const sidebarStyle = {
    width: '250px',
    height: '400px',
    backgroundColor: theme.isDark ? '#495057' : '#f8f9fa',
    color: theme.isDark ? 'white' : 'black',
    padding: '20px',
    borderRight: `3px solid ${theme.primaryColor}`
  };

  const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'];

  const handleColorChange = (color) => {
    themeDispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: color });
    notificationDispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        type: 'success',
        message: `테마 색상이 변경되었습니다.`
      }
    });
  };

  const updateProfile = () => {
    const newName = prompt('새 이름을 입력하세요:', user.name);
    if (newName && newName.trim()) {
      userDispatch({
        type: USER_ACTIONS.UPDATE_PROFILE,
        payload: { name: newName.trim() }
      });
      notificationDispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: {
          type: 'success',
          message: '프로필이 업데이트되었습니다.'
        }
      });
    }
  };

  return (
    <div style={sidebarStyle}>
      <h3>⚙️ 설정</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>👤 프로필</h4>
        <p><strong>이름:</strong> {user?.name}</p>
        <p><strong>이메일:</strong> {user?.email}</p>
        <p><strong>역할:</strong> {user?.role}</p>
        <button
          onClick={updateProfile}
          style={{
            padding: '6px 12px',
            backgroundColor: theme.primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          프로필 수정
        </button>
      </div>

      <div>
        <h4>🎨 테마 색상</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                border: theme.primaryColor === color ? '3px solid white' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              title={`색상 변경: ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 메인 콘텐츠 컴포넌트
function MainContent() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { notifications, notificationDispatch } = useNotifications();

  const contentStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: theme.isDark ? '#6c757d' : 'white',
    color: theme.isDark ? 'white' : 'black'
  };

  const addTestNotification = () => {
    const types = ['info', 'success', 'warning', 'error'];
    const messages = [
      '새 메시지가 도착했습니다.',
      '작업이 완료되었습니다.',
      '주의: 메모리 사용량이 높습니다.',
      '오류: 서버 연결에 실패했습니다.'
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    notificationDispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        type: randomType,
        message: randomMessage
      }
    });
  };

  return (
    <div style={contentStyle}>
      <h3>📄 메인 콘텐츠</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>현재 설정 상태:</h4>
        <ul>
          <li>테마: {theme.isDark ? '다크 모드' : '라이트 모드'}</li>
          <li>메인 색상: {theme.primaryColor}</li>
          <li>사용자: {user?.name} ({user?.email})</li>
          <li>알림 개수: {notifications.length}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={addTestNotification}
          style={{
            padding: '10px 20px',
            backgroundColor: theme.primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          테스트 알림 추가
        </button>
        
        <button
          onClick={() => notificationDispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL })}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          모든 알림 삭제
        </button>
      </div>

      {user ? (
        <div>
          <h4>🔔 알림 목록:</h4>
          {notifications.length === 0 ? (
            <p style={{ color: theme.isDark ? '#ced4da' : '#6c757d' }}>알림이 없습니다.</p>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: 
                      notification.type === 'error' ? '#f8d7da' :
                      notification.type === 'success' ? '#d4edda' :
                      notification.type === 'warning' ? '#fff3cd' : '#d1ecf1',
                    color: 'black',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>
                    {notification.type === 'error' ? '❌' :
                     notification.type === 'success' ? '✅' :
                     notification.type === 'warning' ? '⚠️' : 'ℹ️'} {notification.message}
                  </span>
                  <button
                    onClick={() => notificationDispatch({ 
                      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, 
                      payload: notification.id 
                    })}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h4>로그아웃되었습니다</h4>
          <p>다시 로그인해주세요.</p>
        </div>
      )}
    </div>
  );
}

// 메인 앱 컴포넌트
function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function Ex05UseContextAdvanced() {
  return (
    <div style={{ padding: '20px', border: '2px solid #6f42c1', borderRadius: '8px', margin: '10px' }}>
      <h3>Ex04 - useContext 전역 상태 관리</h3>
      
      <AppProvider>
        <App />
      </AppProvider>

      <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', marginTop: '15px', fontSize: '14px' }}>
        <strong>학습 포인트:</strong>
        <ul>
          <li>useContext로 전역 상태를 관리할 수 있습니다</li>
          <li>Context와 useReducer를 조합하면 강력한 상태 관리가 가능합니다</li>
          <li>커스텀 훅으로 Context 사용을 간편하게 만들 수 있습니다</li>
          <li>여러 Context를 조합하여 관심사를 분리할 수 있습니다</li>
          <li>Provider 패턴으로 하위 컴포넌트들이 상태에 접근할 수 있습니다</li>
          <li>테마 전환, 프로필 수정, 알림 시스템을 테스트해보세요!</li>
        </ul>
      </div>
    </div>
  );
}

export default Ex05UseContextAdvanced;