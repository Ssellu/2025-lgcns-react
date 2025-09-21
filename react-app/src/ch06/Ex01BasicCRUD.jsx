import { useState, useEffect } from 'react';

// JSON Server 기본 CRUD 예제
function Ex01BasicCRUD() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logIdCounter, setLogIdCounter] = useState(1);

    const API_BASE = 'http://localhost:3000';

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const uniqueId = `${Date.now()}-${logIdCounter}`;
        setLogIdCounter(prev => prev + 1);
        setLogs(prev => [...prev, { id: uniqueId, message, type, timestamp }].slice(-10));
    };

    // 전체 사용자 조회 (GET)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/users`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setUsers(data);
            addLog(`✅ ${data.length}명의 사용자 조회 완료`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 조회 실패: ${error.message}`, 'error');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 특정 사용자 조회 (GET /users/:id)
    const fetchUser = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/users/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const user = await response.json();
            addLog(`✅ 사용자 조회: ${user.name}`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 조회 실패: ${error.message}`, 'error');
        }
    };

    // 사용자 생성 (POST)
    const createUser = async () => {
        const newUser = {
            name: `사용자${Date.now().toString().slice(-4)}`,
            email: `user${Date.now().toString().slice(-4)}@example.com`,
            age: Math.floor(Math.random() * 40) + 20,
            city: ['서울', '부산', '대구', '인천'][Math.floor(Math.random() * 4)]
        };

        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const createdUser = await response.json();
            setUsers(prev => [...prev, createdUser]);
            addLog(`✅ 사용자 생성: ${createdUser.name}`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 생성 실패: ${error.message}`, 'error');
        }
    };

    // 사용자 수정 (PUT)
    const updateUser = async (id) => {
        const updatedData = {
            name: `수정된사용자${Date.now().toString().slice(-3)}`,
            email: `updated${Date.now().toString().slice(-3)}@example.com`,
            age: Math.floor(Math.random() * 40) + 20,
            city: '수정된도시'
        };

        try {
            const response = await fetch(`${API_BASE}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const updatedUser = await response.json();
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            addLog(`✅ 사용자 수정: ${updatedUser.name}`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 수정 실패: ${error.message}`, 'error');
        }
    };

    // 사용자 부분 수정 (PATCH)
    const patchUser = async (id) => {
        const patchData = {
            age: Math.floor(Math.random() * 40) + 20
        };

        try {
            const response = await fetch(`${API_BASE}/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patchData)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const updatedUser = await response.json();
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            addLog(`✅ 사용자 나이 수정: ${updatedUser.age}세`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 수정 실패: ${error.message}`, 'error');
        }
    };

    // 사용자 삭제 (DELETE)
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/users/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setUsers(prev => prev.filter(user => user.id !== id));
            addLog(`✅ 사용자 삭제 완료`, 'success');
        } catch (error) {
            addLog(`❌ 사용자 삭제 실패: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        addLog('🚀 JSON Server 연결 테스트 시작', 'info');
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px', border: '2px solid #2196f3', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex01 - JSON Server 기본 CRUD 연산</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={fetchUsers}
                        disabled={loading}
                        style={{ padding: '8px 12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                        {loading ? '로딩중...' : '전체 조회 (GET)'}
                    </button>
                    
                    <button 
                        onClick={createUser}
                        style={{ padding: '8px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                        사용자 생성 (POST)
                    </button>

                    {users.length > 0 && (
                        <>
                            <button 
                                onClick={() => fetchUser(users[0].id)}
                                style={{ padding: '8px 12px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                첫번째 사용자 조회
                            </button>
                            
                            <button 
                                onClick={() => updateUser(users[0].id)}
                                style={{ padding: '8px 12px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                첫번째 사용자 수정 (PUT)
                            </button>

                            <button 
                                onClick={() => patchUser(users[0].id)}
                                style={{ padding: '8px 12px', backgroundColor: '#607d8b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                첫번째 사용자 나이만 수정 (PATCH)
                            </button>

                            <button 
                                onClick={() => deleteUser(users[users.length - 1].id)}
                                style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                마지막 사용자 삭제 (DELETE)
                            </button>
                        </>
                    )}
                </div>

                <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                    <h4>📊 현재 사용자 목록 ({users.length}명)</h4>
                    {users.length === 0 ? (
                        <p style={{ color: '#666' }}>사용자가 없습니다. JSON Server가 실행중인지 확인하세요.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {users.map(user => (
                                <div key={user.id} style={{ 
                                    padding: '8px', 
                                    backgroundColor: 'white', 
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                }}>
                                    <strong>#{user.id}</strong> {user.name} ({user.email}) - {user.age}세, {user.city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h4>📋 API 요청 로그</h4>
                    <div style={{ 
                        maxHeight: '150px', 
                        overflowY: 'auto', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        {logs.map(log => (
                            <div key={log.id} style={{ 
                                padding: '6px 10px', 
                                borderBottom: '1px solid #eee',
                                fontSize: '12px',
                                color: log.type === 'error' ? '#f44336' : log.type === 'success' ? '#4caf50' : '#666'
                            }}>
                                [{log.timestamp}] {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
                <strong>🎯 학습 포인트:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>JSON Server는 db.json 파일을 자동으로 RESTful API로 변환합니다</li>
                    <li>GET /users: 전체 조회, GET /users/1: 특정 조회</li>
                    <li>POST /users: 생성, PUT /users/1: 전체 수정, PATCH /users/1: 부분 수정</li>
                    <li>DELETE /users/1: 삭제</li>
                    <li>실시간으로 db.json 파일이 업데이트됩니다</li>
                </ul>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                    💡 터미널에서 "json-server --watch db.json --port 3001" 명령어로 서버를 먼저 실행해주세요!
                </p>
            </div>
        </div>
    );
}

export default Ex01BasicCRUD;