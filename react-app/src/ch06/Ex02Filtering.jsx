import { useState, useEffect } from 'react';

// JSON Server 필터링, 정렬, 페이지네이션 예제
function Ex02Filtering() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logIdCounter, setLogIdCounter] = useState(1);

    const API_BASE = 'http://localhost:3000';

    const addLog = (message, query) => {
        const timestamp = new Date().toLocaleTimeString();
        const uniqueId = `${Date.now()}-${logIdCounter}`;
        setLogIdCounter(prev => prev + 1);
        setLogs(prev => [...prev, { id: uniqueId, message, query, timestamp }].slice(-10));
    };

    const fetchWithQuery = async (queryString, description) => {
        setLoading(true);
        try {
            const url = `${API_BASE}/users${queryString}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setFilteredUsers(data);
            addLog(`✅ ${description}: ${data.length}개 결과`, url);
        } catch (error) {
            addLog(`❌ ${description} 실패: ${error.message}`, '');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 기본 데이터 로드
    const loadAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/users`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
            addLog(`✅ 전체 사용자 로드: ${data.length}명`, `${API_BASE}/users`);
        } catch (error) {
            addLog(`❌ 데이터 로드 실패: ${error.message}`, '');
        } finally {
            setLoading(false);
        }
    };

    // 필터링 예제들
    const filterExamples = [
        {
            name: '서울 거주자',
            query: '?city=서울',
            description: '도시별 필터링'
        },
        {
            name: '나이 30세',
            query: '?age=30',
            description: '나이별 필터링'
        },
        {
            name: '25세 이상',
            query: '?age_gte=25',
            description: '나이 범위 필터링 (이상)'
        },
        {
            name: '30세 이하',
            query: '?age_lte=30',
            description: '나이 범위 필터링 (이하)'
        },
        {
            name: '25-30세',
            query: '?age_gte=25&age_lte=30',
            description: '나이 범위 필터링 (구간)'
        },
        {
            name: '이름에 "홍" 포함',
            query: '?q=홍',
            description: '전체 텍스트 검색'
        },
        {
            name: '서울 + 25세 이상',
            query: '?city=서울&age_gte=25',
            description: '복합 조건 필터링'
        }
    ];

    // 정렬 예제들
    const sortExamples = [
        {
            name: '나이 오름차순',
            query: '?_sort=age&_order=asc',
            description: '단일 필드 오름차순 정렬'
        },
        {
            name: '나이 내림차순',
            query: '?_sort=age&_order=desc',
            description: '단일 필드 내림차순 정렬'
        },
        {
            name: '이름 오름차순',
            query: '?_sort=name&_order=asc',
            description: '이름순 정렬'
        },
        {
            name: '도시별, 나이순',
            query: '?_sort=city,age&_order=asc,asc',
            description: '다중 필드 정렬'
        }
    ];

    // 페이지네이션 예제들
    const paginationExamples = [
        {
            name: '첫 2명',
            query: '?_limit=2',
            description: '개수 제한'
        },
        {
            name: '1페이지 (2명씩)',
            query: '?_page=1&_limit=2',
            description: '페이지네이션'
        },
        {
            name: '2페이지 (2명씩)',
            query: '?_page=2&_limit=2',
            description: '페이지네이션'
        },
        {
            name: '1번째부터 2명',
            query: '?_start=0&_limit=2',
            description: 'Offset 기반 페이지네이션'
        },
        {
            name: '2번째부터 2명',
            query: '?_start=1&_limit=2',
            description: 'Offset 기반 페이지네이션'
        }
    ];

    useEffect(() => {
        loadAllUsers();
    }, []);

    return (
        <div style={{ padding: '20px', border: '2px solid #ff9800', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex02 - 필터링, 정렬, 페이지네이션</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={loadAllUsers}
                    disabled={loading}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#4caf50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '10px',
                        marginBottom: '10px'
                    }}
                >
                    {loading ? '로딩중...' : '전체 데이터 다시 로드'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                
                {/* 필터링 섹션 */}
                <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#f57c00', margin: '0 0 10px 0' }}>🔍 필터링 (Filtering)</h4>
                    <div style={{ display: 'grid', gap: '6px' }}>
                        {filterExamples.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => fetchWithQuery(example.query, example.description)}
                                disabled={loading}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#ff9800',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'left'
                                }}
                            >
                                {example.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 정렬 섹션 */}
                <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#388e3c', margin: '0 0 10px 0' }}>📊 정렬 (Sorting)</h4>
                    <div style={{ display: 'grid', gap: '6px' }}>
                        {sortExamples.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => fetchWithQuery(example.query, example.description)}
                                disabled={loading}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'left'
                                }}
                            >
                                {example.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 페이지네이션 섹션 */}
                <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#7b1fa2', margin: '0 0 10px 0' }}>📄 페이지네이션</h4>
                    <div style={{ display: 'grid', gap: '6px' }}>
                        {paginationExamples.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => fetchWithQuery(example.query, example.description)}
                                disabled={loading}
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#9c27b0',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'left'
                                }}
                            >
                                {example.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 결과 표시 */}
            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                <h4>📋 결과 ({filteredUsers.length}개)</h4>
                {filteredUsers.length === 0 ? (
                    <p style={{ color: '#666' }}>결과가 없습니다.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {filteredUsers.map(user => (
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

            {/* 요청 로그 */}
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
                            padding: '8px', 
                            borderBottom: '1px solid #eee',
                            fontSize: '12px'
                        }}>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>
                                [{log.timestamp}] {log.message}
                            </div>
                            {log.query && (
                                <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>
                                    URL: {log.query}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
                <strong>🎯 학습 포인트:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><strong>필터링:</strong> ?field=value, ?field_gte=값, ?field_lte=값, ?q=검색어</li>
                    <li><strong>정렬:</strong> ?_sort=field&_order=asc/desc (다중: ?_sort=field1,field2)</li>
                    <li><strong>페이지네이션:</strong> ?_page=1&_limit=10 또는 ?_start=0&_limit=10</li>
                    <li><strong>조합:</strong> 모든 파라미터는 &로 연결하여 조합 가능</li>
                    <li>_로 시작하는 파라미터는 JSON Server 특수 기능</li>
                </ul>
            </div>
        </div>
    );
}

export default Ex02Filtering;