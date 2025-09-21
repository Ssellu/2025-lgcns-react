import { useState, useEffect } from 'react';

// JSON Server 관계 데이터 (_embed, _expand) 예제
function Ex03Relationships() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [activeExample, setActiveExample] = useState('');
    const [logIdCounter, setLogIdCounter] = useState(1);

    const API_BASE = 'http://localhost:3000';

    const addLog = (message, url) => {
        const timestamp = new Date().toLocaleTimeString();
        const uniqueId = `${Date.now()}-${logIdCounter}`;
        setLogIdCounter(prev => prev + 1);
        setLogs(prev => [...prev, { id: uniqueId, message, url, timestamp }].slice(-8));
    };

    const fetchRelationshipData = async (endpoint, description, exampleName) => {
        setLoading(true);
        setActiveExample(exampleName);
        try {
            const url = `${API_BASE}${endpoint}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            setData(result);
            addLog(`✅ ${description}: ${Array.isArray(result) ? result.length : 1}개 결과`, url);
        } catch (error) {
            addLog(`❌ ${description} 실패: ${error.message}`, '');
            setData(null);
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const relationshipExamples = [
        {
            name: 'users-embed-posts',
            title: '사용자 + 작성한 포스트들',
            endpoint: '/users?_embed=posts',
            description: '각 사용자와 함께 그들이 작성한 포스트들을 가져옵니다',
            type: 'embed',
            explanation: '_embed=posts: users 데이터에 각 사용자의 posts를 중첩하여 포함'
        },
        {
            name: 'posts-embed-comments',
            title: '포스트 + 댓글들',
            endpoint: '/posts?_embed=comments',
            description: '각 포스트와 함께 해당 포스트의 댓글들을 가져옵니다',
            type: 'embed',
            explanation: '_embed=comments: posts 데이터에 각 포스트의 comments를 중첩하여 포함'
        },
        {
            name: 'posts-expand-author',
            title: '포스트 + 작성자 정보',
            endpoint: '/posts?_expand=author',
            description: '각 포스트와 함께 작성자(authorId에 해당하는 user) 정보를 가져옵니다',
            type: 'expand',
            explanation: '_expand=author: posts의 authorId를 통해 users 테이블의 해당 사용자 정보를 확장'
        },
        {
            name: 'comments-expand-post',
            title: '댓글 + 해당 포스트 정보',
            endpoint: '/comments?_expand=post',
            description: '각 댓글과 함께 해당 댓글이 달린 포스트 정보를 가져옵니다',
            type: 'expand',
            explanation: '_expand=post: comments의 postId를 통해 posts 테이블의 해당 포스트 정보를 확장'
        },
        {
            name: 'comments-expand-author',
            title: '댓글 + 작성자 정보',
            endpoint: '/comments?_expand=author',
            description: '각 댓글과 함께 댓글 작성자 정보를 가져옵니다',
            type: 'expand',
            explanation: '_expand=author: comments의 authorId를 통해 users 테이블의 해당 사용자 정보를 확장'
        }
    ];

    const renderData = (data, exampleName) => {
        if (!data) return null;

        if (Array.isArray(data)) {
            return data.map((item, index) => (
                <div key={index} style={{ 
                    marginBottom: '15px', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px',
                    backgroundColor: 'white'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                        항목 #{index + 1}
                    </div>
                    <pre style={{ 
                        fontSize: '12px', 
                        backgroundColor: '#f8f8f8', 
                        padding: '8px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        margin: 0
                    }}>
                        {JSON.stringify(item, null, 2)}
                    </pre>
                </div>
            ));
        }

        return (
            <div style={{ 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '6px',
                backgroundColor: 'white'
            }}>
                <pre style={{ 
                    fontSize: '12px', 
                    backgroundColor: '#f8f8f8', 
                    padding: '8px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    margin: 0
                }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', border: '2px solid #4caf50', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex03 - 관계 데이터 (_embed & _expand)</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                    {relationshipExamples.map((example, index) => (
                        <div key={index} style={{ 
                            padding: '12px', 
                            backgroundColor: example.type === 'embed' ? '#e8f5e8' : '#e3f2fd',
                            borderRadius: '6px',
                            border: `1px solid ${example.type === 'embed' ? '#4caf50' : '#2196f3'}`
                        }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '8px',
                                color: example.type === 'embed' ? '#2e7d32' : '#1565c0'
                            }}>
                                {example.type === 'embed' ? '🔗' : '🔍'} {example.title}
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
                                {example.description}
                            </div>
                            <div style={{ 
                                fontSize: '11px', 
                                marginBottom: '10px', 
                                padding: '4px 6px',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                borderRadius: '3px',
                                fontFamily: 'monospace'
                            }}>
                                {example.explanation}
                            </div>
                            <button
                                onClick={() => fetchRelationshipData(example.endpoint, example.title, example.name)}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: example.type === 'embed' ? '#4caf50' : '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                {loading && activeExample === example.name ? '로딩중...' : '실행'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 결과 표시 */}
            {data && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>📋 결과 데이터</h4>
                    <div style={{ 
                        maxHeight: '400px', 
                        overflowY: 'auto', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        padding: '10px'
                    }}>
                        {renderData(data, activeExample)}
                    </div>
                </div>
            )}

            {/* 요청 로그 */}
            <div style={{ marginBottom: '20px' }}>
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
                            {log.url && (
                                <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>
                                    URL: {log.url}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
                <strong>🎯 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>🔗 _embed (포함):</strong>
                        <ul style={{ margin: '4px 0 8px 20px', fontSize: '13px' }}>
                            <li>"내가 가진 것들도 같이 보여줘" (부모 → 자식들)</li>
                            <li>1:N 관계에서 1이 N을 포함</li>
                            <li>예: 사용자 + 그 사용자의 포스트들</li>
                        </ul>
                    </div>
                    <div>
                        <strong>🔍 _expand (확장):</strong>
                        <ul style={{ margin: '4px 0 8px 20px', fontSize: '13px' }}>
                            <li>"나와 관련된 정보도 같이 보여줘" (자식 → 부모)</li>
                            <li>N:1 관계에서 N이 1을 참조</li>
                            <li>예: 포스트 + 작성자 정보</li>
                        </ul>
                    </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                    💡 관계는 필드명의 패턴으로 자동 인식됩니다 (authorId → author, postId → post)
                </div>
            </div>
        </div>
    );
}

export default Ex03Relationships;