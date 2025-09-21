import { useState, useEffect } from 'react';

// JSON Server 커스텀 라우트 및 미들웨어 예제
function Ex07CustomRoutes() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logIdCounter, setLogIdCounter] = useState(1);
    const [customData, setCustomData] = useState({
        searchQuery: '',
        userId: '1',
        postId: '1',
        commentData: { body: '', author: '익명' }
    });

    const API_BASE = 'http://localhost:3000';

    const addLog = (message, url, method = 'GET') => {
        const timestamp = new Date().toLocaleTimeString();
        const uniqueId = `${Date.now()}-${logIdCounter}`;
        setLogIdCounter(prev => prev + 1);
        setLogs(prev => [...prev, { 
            id: uniqueId, 
            message, 
            url, 
            method, 
            timestamp 
        }].slice(-8));
    };

    const makeRequest = async (endpoint, options = {}, description = '') => {
        setLoading(true);
        try {
            const url = `${API_BASE}${endpoint}`;
            const method = options.method || 'GET';
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
            addLog(`✅ ${description}`, url, method);
            
        } catch (error) {
            addLog(`❌ ${description} 실패: ${error.message}`, endpoint, options.method || 'GET');
            console.error('Request error:', error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // 커스텀 검색 (제목과 내용에서 검색)
    const searchPosts = () => {
        const query = customData.searchQuery.trim();
        if (!query) return;
        
        makeRequest(
            `/posts?q=${encodeURIComponent(query)}`,
            {},
            `포스트 전체 검색: "${query}"`
        );
    };

    // 사용자의 최근 포스트들
    const getUserRecentPosts = () => {
        makeRequest(
            `/users/${customData.userId}/posts?_sort=id&_order=desc&_limit=3`,
            {},
            `사용자 ${customData.userId}의 최근 포스트 3개`
        );
    };

    // 포스트와 관련된 모든 정보 (작성자 + 댓글들)
    const getPostDetails = () => {
        makeRequest(
            `/posts/${customData.postId}?_expand=author&_embed=comments`,
            {},
            `포스트 ${customData.postId} 상세 정보 (작성자 + 댓글)`
        );
    };

    // 통계 데이터 (가상의 엔드포인트)
    const getStatistics = () => {
        // 실제로는 JSON Server에서 지원하지 않지만, 
        // 커스텀 라우트를 통해 구현할 수 있는 예제
        makeRequest(
            `/stats`,
            {},
            '사이트 통계 데이터'
        );
    };

    // 페이지네이션 예제
    const getPaginatedUsers = (page = 1, limit = 3) => {
        makeRequest(
            `/users?_page=${page}&_limit=${limit}`,
            {},
            `사용자 목록 (${page}페이지, ${limit}개씩)`
        );
    };

    // 복합 조건 검색
    const getComplexQuery = () => {
        makeRequest(
            `/users?age_gte=25&city=서울&_sort=age&_order=desc`,
            {},
            '복합 조건: 서울 거주, 25세 이상, 나이 내림차순'
        );
    };

    // 댓글 추가 (POST 예제)
    const addComment = () => {
        if (!customData.commentData.body.trim()) return;

        makeRequest(
            `/posts/${customData.postId}/comments`,
            {
                method: 'POST',
                body: JSON.stringify({
                    body: customData.commentData.body,
                    author: customData.commentData.author,
                    postId: parseInt(customData.postId),
                    authorId: Math.floor(Math.random() * 5) + 1 // 랜덤 사용자 ID
                })
            },
            `포스트 ${customData.postId}에 댓글 추가`
        );

        setCustomData(prev => ({
            ...prev,
            commentData: { body: '', author: '익명' }
        }));
    };

    // 부분 업데이트 (PATCH 예제)
    const partialUpdateUser = () => {
        const randomAge = Math.floor(Math.random() * 50) + 20;
        makeRequest(
            `/users/${customData.userId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ age: randomAge })
            },
            `사용자 ${customData.userId} 나이만 ${randomAge}세로 업데이트`
        );
    };

    const customRoutes = [
        {
            title: '🔍 전체 검색',
            description: '포스트 제목과 내용에서 키워드 검색',
            action: searchPosts,
            color: '#2196f3',
            disabled: !customData.searchQuery.trim()
        },
        {
            title: '📝 최근 포스트',
            description: '특정 사용자의 최근 포스트 3개',
            action: getUserRecentPosts,
            color: '#4caf50'
        },
        {
            title: '📖 포스트 상세',
            description: '포스트 + 작성자 + 모든 댓글',
            action: getPostDetails,
            color: '#ff9800'
        },
        {
            title: '📊 사이트 통계',
            description: '전체 통계 정보 (커스텀 라우트)',
            action: getStatistics,
            color: '#9c27b0'
        },
        {
            title: '📄 페이지네이션',
            description: '사용자 목록 페이징 (1페이지, 3개씩)',
            action: () => getPaginatedUsers(1, 3),
            color: '#607d8b'
        },
        {
            title: '🎯 복합 조건',
            description: '나이, 지역 복합 필터링',
            action: getComplexQuery,
            color: '#795548'
        },
        {
            title: '💬 댓글 추가',
            description: 'POST 요청으로 새 댓글 생성',
            action: addComment,
            color: '#e91e63',
            disabled: !customData.commentData.body.trim()
        },
        {
            title: '✏️ 부분 수정',
            description: 'PATCH 요청으로 특정 필드만 업데이트',
            action: partialUpdateUser,
            color: '#ff5722'
        }
    ];

    const renderData = (data) => {
        if (!data) return null;

        return (
            <pre style={{ 
                fontSize: '12px', 
                backgroundColor: '#f8f8f8', 
                padding: '15px', 
                borderRadius: '6px',
                overflow: 'auto',
                maxHeight: '400px',
                margin: 0,
                border: '1px solid #ddd'
            }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    };

    return (
        <div style={{ padding: '20px', border: '2px solid #673ab7', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex07 - 커스텀 라우트 & 고급 기능</h3>
            
            {/* 파라미터 설정 */}
            <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '6px',
                marginBottom: '20px'
            }}>
                <h4 style={{ margin: '0 0 15px 0' }}>🔧 요청 파라미터 설정</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                            🔍 검색 키워드
                        </label>
                        <input
                            type="text"
                            value={customData.searchQuery}
                            onChange={(e) => setCustomData(prev => ({ ...prev, searchQuery: e.target.value }))}
                            placeholder="검색할 단어를 입력..."
                            style={{
                                width: '100%',
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                            👤 사용자 ID
                        </label>
                        <select
                            value={customData.userId}
                            onChange={(e) => setCustomData(prev => ({ ...prev, userId: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                        >
                            {[1,2,3,4,5].map(id => (
                                <option key={id} value={id}>사용자 {id}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                            📝 포스트 ID
                        </label>
                        <select
                            value={customData.postId}
                            onChange={(e) => setCustomData(prev => ({ ...prev, postId: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(id => (
                                <option key={id} value={id}>포스트 {id}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                        💬 댓글 내용
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={customData.commentData.author}
                            onChange={(e) => setCustomData(prev => ({
                                ...prev,
                                commentData: { ...prev.commentData, author: e.target.value }
                            }))}
                            placeholder="작성자"
                            style={{
                                width: '120px',
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                        />
                        <input
                            type="text"
                            value={customData.commentData.body}
                            onChange={(e) => setCustomData(prev => ({
                                ...prev,
                                commentData: { ...prev.commentData, body: e.target.value }
                            }))}
                            placeholder="댓글 내용을 입력..."
                            style={{
                                flex: 1,
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 커스텀 라우트 버튼들 */}
            <div style={{ marginBottom: '20px' }}>
                <h4>🚀 커스텀 라우트 및 고급 기능</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {customRoutes.map((route, index) => (
                        <div key={index} style={{ 
                            padding: '12px', 
                            backgroundColor: `${route.color}15`,
                            borderRadius: '6px',
                            border: `1px solid ${route.color}40`
                        }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '8px',
                                color: route.color,
                                fontSize: '14px'
                            }}>
                                {route.title}
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '10px', color: '#666' }}>
                                {route.description}
                            </div>
                            <button
                                onClick={route.action}
                                disabled={loading || route.disabled}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: route.disabled ? '#ccc' : route.color,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: route.disabled ? 'not-allowed' : 'pointer',
                                    fontSize: '12px',
                                    opacity: route.disabled ? 0.6 : 1
                                }}
                            >
                                {loading ? '요청중...' : '실행'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 결과 표시 */}
            {loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#f0f4f8',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '16px', marginBottom: '10px' }}>⏳ 요청 처리 중...</div>
                </div>
            )}

            {data && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>📋 응답 결과</h4>
                    <div style={{ 
                        backgroundColor: '#f9f9f9',
                        borderRadius: '6px',
                        padding: '10px'
                    }}>
                        {renderData(data)}
                    </div>
                    
                    {Array.isArray(data) && (
                        <div style={{ 
                            marginTop: '10px', 
                            fontSize: '14px', 
                            color: '#666',
                            textAlign: 'center'
                        }}>
                            총 {data.length}개의 항목이 반환되었습니다
                        </div>
                    )}
                </div>
            )}

            {/* API 요청 로그 */}
            <div style={{ marginBottom: '20px' }}>
                <h4>📋 API 요청 로그</h4>
                <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                }}>
                    {logs.map(log => (
                        <div key={log.id} style={{ 
                            padding: '8px 12px', 
                            borderBottom: '1px solid #eee',
                            fontSize: '12px'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '3px'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    [{log.timestamp}] {log.message}
                                </span>
                                <span style={{ 
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    backgroundColor: log.method === 'GET' ? '#e3f2fd' : 
                                                  log.method === 'POST' ? '#e8f5e8' : 
                                                  log.method === 'PATCH' ? '#fff3e0' : '#ffebee',
                                    borderRadius: '3px',
                                    color: '#666'
                                }}>
                                    {log.method}
                                </span>
                            </div>
                            {log.url && (
                                <div style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>
                                    {log.url}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#ede7f6', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
                <strong>🎯 커스텀 라우트 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>🔍 전체 텍스트 검색:</strong> ?q= 파라미터로 모든 필드 검색
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>🔗 중첩 라우트:</strong> /users/:id/posts 형태의 관계형 요청
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>📊 복합 쿼리:</strong> 여러 조건을 조합한 고급 필터링
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>📄 페이지네이션:</strong> _page, _limit으로 대량 데이터 처리
                    </div>
                    <div>
                        <strong>🛠️ HTTP 메소드:</strong> GET, POST, PUT, PATCH, DELETE 활용
                    </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                    💡 실제 프로덕션에서는 routes.json이나 server.js를 통해 더 복잡한 커스텀 라우트를 구현할 수 있습니다.
                </div>
            </div>
        </div>
    );
}

export default Ex07CustomRoutes;