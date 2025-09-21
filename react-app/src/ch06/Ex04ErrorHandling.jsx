import { useState, useEffect } from 'react';

// JSON Server 에러 처리 및 상태 관리 예제
function Ex04ErrorHandling() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('확인중...');
    const [logs, setLogs] = useState([]);
    const [logIdCounter, setLogIdCounter] = useState(1);

    const API_BASE = 'http://localhost:3000';

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const uniqueId = `${Date.now()}-${logIdCounter}`;
        setLogIdCounter(prev => prev + 1);
        setLogs(prev => [...prev, { 
            id: uniqueId, 
            message, 
            type, 
            timestamp 
        }].slice(-10));
    };

    // 서버 연결 상태 확인
    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${API_BASE}/db`, { method: 'HEAD' });
            if (response.ok) {
                setConnectionStatus('✅ 연결됨');
                addLog('JSON Server 연결 확인 성공', 'success');
            } else {
                throw new Error('서버 응답 오류');
            }
        } catch (error) {
            setConnectionStatus('❌ 연결 실패');
            addLog(`JSON Server 연결 실패: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 10000); // 10초마다 상태 확인
        return () => clearInterval(interval);
    }, []);

    // 공통 API 요청 함수
    const makeRequest = async (url, options = {}, description = '') => {
        setLoading(true);
        setError(null);
        setResult(null);
        
        addLog(`📡 ${description} 요청 시작`, 'info');
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            // HTTP 상태 코드별 에러 처리
            if (!response.ok) {
                let errorMessage;
                switch (response.status) {
                    case 400:
                        errorMessage = '잘못된 요청입니다 (400 Bad Request)';
                        break;
                    case 404:
                        errorMessage = '요청한 리소스를 찾을 수 없습니다 (404 Not Found)';
                        break;
                    case 500:
                        errorMessage = '서버 내부 오류입니다 (500 Internal Server Error)';
                        break;
                    default:
                        errorMessage = `HTTP ${response.status} 오류 발생`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setResult(data);
            addLog(`✅ ${description} 성공`, 'success');
            
        } catch (error) {
            let errorMessage;
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = '네트워크 연결 오류 - JSON Server가 실행 중인지 확인하세요';
            } else if (error.name === 'SyntaxError') {
                errorMessage = '응답 데이터가 올바른 JSON 형식이 아닙니다';
            } else {
                errorMessage = error.message;
            }
            
            setError({
                message: errorMessage,
                type: error.name,
                timestamp: new Date().toLocaleString()
            });
            addLog(`❌ ${description} 실패: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const errorScenarios = [
        {
            title: '✅ 정상 요청',
            description: '존재하는 사용자 조회',
            action: () => makeRequest(`${API_BASE}/users/1`, {}, '사용자 조회'),
            type: 'success'
        },
        {
            title: '❌ 404 오류',
            description: '존재하지 않는 리소스 요청',
            action: () => makeRequest(`${API_BASE}/users/999`, {}, '존재하지 않는 사용자 조회'),
            type: 'error'
        },
        {
            title: '❌ 잘못된 엔드포인트',
            description: '존재하지 않는 API 엔드포인트',
            action: () => makeRequest(`${API_BASE}/nonexistent`, {}, '잘못된 엔드포인트 호출'),
            type: 'error'
        },
        {
            title: '❌ 잘못된 JSON',
            description: '유효하지 않은 JSON 데이터로 POST',
            action: () => makeRequest(`${API_BASE}/users`, {
                method: 'POST',
                body: 'invalid json data'
            }, 'POST 요청 (잘못된 JSON)'),
            type: 'error'
        },
        {
            title: '❌ 서버 연결 오류',
            description: '잘못된 포트로 요청',
            action: () => makeRequest(`http://localhost:9999/users`, {}, '잘못된 서버 연결'),
            type: 'error'
        },
        {
            title: '✅ 생성 요청',
            description: '새 사용자 생성 (정상)',
            action: () => makeRequest(`${API_BASE}/users`, {
                method: 'POST',
                body: JSON.stringify({
                    name: `테스트사용자_${Date.now()}`,
                    email: `test${Date.now()}@example.com`,
                    city: '서울'
                })
            }, '새 사용자 생성'),
            type: 'success'
        }
    ];

    return (
        <div style={{ padding: '20px', border: '2px solid #ff9800', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex04 - 에러 처리 및 상태 관리</h3>
            
            {/* 서버 연결 상태 */}
            <div style={{ 
                marginBottom: '20px', 
                padding: '12px', 
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                borderLeft: '4px solid #2196f3'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🌐 서버 연결 상태</div>
                <div style={{ fontSize: '14px' }}>{connectionStatus}</div>
                <button 
                    onClick={checkServerStatus}
                    style={{ 
                        marginTop: '8px',
                        padding: '4px 12px',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    연결 상태 다시 확인
                </button>
            </div>

            {/* 테스트 버튼들 */}
            <div style={{ marginBottom: '20px' }}>
                <h4>🧪 에러 시나리오 테스트</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {errorScenarios.map((scenario, index) => (
                        <div key={index} style={{ 
                            padding: '12px', 
                            backgroundColor: scenario.type === 'success' ? '#e8f5e8' : '#ffebee',
                            borderRadius: '6px',
                            border: `1px solid ${scenario.type === 'success' ? '#4caf50' : '#f44336'}`
                        }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '8px',
                                color: scenario.type === 'success' ? '#2e7d32' : '#c62828'
                            }}>
                                {scenario.title}
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '10px', color: '#666' }}>
                                {scenario.description}
                            </div>
                            <button
                                onClick={scenario.action}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: scenario.type === 'success' ? '#4caf50' : '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                {loading ? '요청중...' : '실행'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 로딩 상태 */}
            {loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#fff3e0',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '16px', marginBottom: '10px' }}>⏳ 요청 처리 중...</div>
                    <div style={{ 
                        width: '200px',
                        height: '4px',
                        backgroundColor: '#ddd',
                        borderRadius: '2px',
                        margin: '0 auto',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '40%',
                            height: '100%',
                            backgroundColor: '#ff9800',
                            borderRadius: '2px',
                            animation: 'loading 1.5s infinite'
                        }}></div>
                    </div>
                </div>
            )}

            {/* 에러 표시 */}
            {error && (
                <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '6px'
                }}>
                    <div style={{ fontWeight: 'bold', color: '#c62828', marginBottom: '8px' }}>
                        ❌ 오류 발생
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                        <strong>메시지:</strong> {error.message}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        <strong>타입:</strong> {error.type}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <strong>발생 시간:</strong> {error.timestamp}
                    </div>
                </div>
            )}

            {/* 성공 결과 표시 */}
            {result && (
                <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '6px'
                }}>
                    <div style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px' }}>
                        ✅ 요청 성공
                    </div>
                    <pre style={{ 
                        fontSize: '12px', 
                        backgroundColor: 'white', 
                        padding: '10px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '200px',
                        margin: 0
                    }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            {/* 요청 로그 */}
            <div style={{ marginBottom: '20px' }}>
                <h4>📋 요청 로그</h4>
                <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                }}>
                    {logs.map(log => (
                        <div key={log.id} style={{ 
                            padding: '8px', 
                            borderBottom: '1px solid #eee',
                            backgroundColor: log.type === 'error' ? '#ffebee' : log.type === 'success' ? '#e8f5e8' : 'white'
                        }}>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                [{log.timestamp}]
                            </div>
                            <div style={{ 
                                fontSize: '13px',
                                color: log.type === 'error' ? '#c62828' : log.type === 'success' ? '#2e7d32' : '#333'
                            }}>
                                {log.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
                <strong>🎯 에러 처리 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>🌐 네트워크 오류:</strong> 서버가 꺼져있거나 URL이 잘못된 경우
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>📋 HTTP 상태 코드:</strong> 400(잘못된 요청), 404(찾을 수 없음), 500(서버 오류)
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>📝 JSON 파싱 오류:</strong> 응답이 올바른 JSON 형식이 아닌 경우
                    </div>
                    <div>
                        <strong>⚡ 사용자 경험:</strong> 로딩 상태, 에러 메시지, 재시도 버튼 제공
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(500%); }
                }
                `}
            </style>
        </div>
    );
}

export default Ex04ErrorHandling;