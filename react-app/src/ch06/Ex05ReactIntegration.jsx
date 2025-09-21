import { useState, useEffect } from 'react';

// React와 JSON Server 통합 예제 (실제 앱에서의 활용)
function Ex05ReactIntegration() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [loading, setLoading] = useState({ users: false, posts: false, create: false });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE = 'http://localhost:3000';

    // 사용자 목록 가져오기
    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, users: true }));
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE}/users`);
            if (!response.ok) throw new Error('사용자 목록을 가져올 수 없습니다');
            
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    // 특정 사용자의 포스트 가져오기
    const fetchUserPosts = async (userId) => {
        setLoading(prev => ({ ...prev, posts: true }));
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE}/posts?authorId=${userId}&_expand=author`);
            if (!response.ok) throw new Error('포스트를 가져올 수 없습니다');
            
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
            setPosts([]);
        } finally {
            setLoading(prev => ({ ...prev, posts: false }));
        }
    };

    // 새 포스트 생성
    const createPost = async (e) => {
        e.preventDefault();
        if (!selectedUser || !newPost.title.trim() || !newPost.body.trim()) {
            setError('사용자를 선택하고 제목과 내용을 입력해주세요');
            return;
        }

        setLoading(prev => ({ ...prev, create: true }));
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newPost.title,
                    body: newPost.body,
                    authorId: selectedUser.id
                })
            });

            if (!response.ok) throw new Error('포스트 생성에 실패했습니다');
            
            const createdPost = await response.json();
            
            // 생성된 포스트를 목록에 추가 (낙관적 업데이트)
            setPosts(prev => [{
                ...createdPost,
                author: selectedUser
            }, ...prev]);
            
            // 폼 초기화
            setNewPost({ title: '', body: '' });
            setSuccessMessage('포스트가 성공적으로 생성되었습니다!');
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, create: false }));
        }
    };

    // 포스트 삭제
    const deletePost = async (postId) => {
        if (!window.confirm('정말 이 포스트를 삭제하시겠습니까?')) return;
        
        try {
            const response = await fetch(`${API_BASE}/posts/${postId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('포스트 삭제에 실패했습니다');
            
            // UI에서 즉시 제거 (낙관적 업데이트)
            setPosts(prev => prev.filter(post => post.id !== postId));
            setSuccessMessage('포스트가 삭제되었습니다');
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (err) {
            setError(err.message);
        }
    };

    // 사용자 선택 핸들러
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        fetchUserPosts(user.id);
        setPosts([]); // 기존 포스트 클리어
        setNewPost({ title: '', body: '' }); // 폼 클리어
    };

    // 컴포넌트 마운트 시 사용자 목록 로드
    useEffect(() => {
        fetchUsers();
    }, []);

    // 에러/성공 메시지 자동 해제
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div style={{ padding: '20px', border: '2px solid #9c27b0', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex05 - React와 JSON Server 통합</h3>
            
            {/* 알림 메시지 */}
            {error && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#ffebee', 
                    border: '1px solid #f44336',
                    borderRadius: '4px', 
                    marginBottom: '15px',
                    color: '#c62828'
                }}>
                    ❌ {error}
                </div>
            )}
            
            {successMessage && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#e8f5e8', 
                    border: '1px solid #4caf50',
                    borderRadius: '4px', 
                    marginBottom: '15px',
                    color: '#2e7d32'
                }}>
                    ✅ {successMessage}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                {/* 사용자 목록 */}
                <div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h4>👥 사용자 목록</h4>
                        <button
                            onClick={fetchUsers}
                            disabled={loading.users}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {loading.users ? '로딩중...' : '새로고침'}
                        </button>
                    </div>
                    
                    <div style={{ 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}>
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                    backgroundColor: selectedUser?.id === user.id ? '#e3f2fd' : 'white',
                                    borderLeft: selectedUser?.id === user.id ? '4px solid #2196f3' : '4px solid transparent'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {user.email}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                    📍 {user.city}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 포스트 영역 */}
                <div>
                    {selectedUser ? (
                        <>
                            <h4>📝 {selectedUser.name}의 포스트</h4>
                            
                            {/* 새 포스트 작성 폼 */}
                            <div style={{ 
                                backgroundColor: '#f5f5f5', 
                                padding: '15px', 
                                borderRadius: '6px',
                                marginBottom: '20px'
                            }}>
                                <h5 style={{ margin: '0 0 15px 0' }}>✏️ 새 포스트 작성</h5>
                                <form onSubmit={createPost}>
                                    <input
                                        type="text"
                                        placeholder="포스트 제목을 입력하세요"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            marginBottom: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <textarea
                                        placeholder="포스트 내용을 입력하세요"
                                        value={newPost.body}
                                        onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            marginBottom: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading.create}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {loading.create ? '작성중...' : '포스트 작성'}
                                    </button>
                                </form>
                            </div>
                            
                            {/* 포스트 목록 */}
                            {loading.posts ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    ⏳ 포스트를 불러오는 중...
                                </div>
                            ) : (
                                <div>
                                    {posts.length === 0 ? (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            padding: '40px', 
                                            color: '#666',
                                            backgroundColor: '#f9f9f9',
                                            borderRadius: '6px'
                                        }}>
                                            📝 작성된 포스트가 없습니다.<br/>
                                            위에서 새 포스트를 작성해보세요!
                                        </div>
                                    ) : (
                                        posts.map(post => (
                                            <div key={post.id} style={{
                                                padding: '15px',
                                                marginBottom: '15px',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                backgroundColor: 'white'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start',
                                                    marginBottom: '10px'
                                                }}>
                                                    <h5 style={{ 
                                                        margin: 0, 
                                                        color: '#333',
                                                        flex: 1
                                                    }}>
                                                        {post.title}
                                                    </h5>
                                                    <button
                                                        onClick={() => deletePost(post.id)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '11px',
                                                            marginLeft: '10px'
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                                <p style={{ 
                                                    margin: '0 0 8px 0', 
                                                    color: '#666',
                                                    fontSize: '14px',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {post.body}
                                                </p>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#999',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <span>작성자: {post.author?.name || selectedUser.name}</span>
                                                    <span>ID: #{post.id}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 20px',
                            color: '#666',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '6px'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👈</div>
                            <h4 style={{ margin: '0 0 10px 0' }}>사용자를 선택해주세요</h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                왼쪽에서 사용자를 클릭하면<br/>
                                해당 사용자의 포스트를 확인하고<br/>
                                새 포스트를 작성할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '4px', fontSize: '14px', marginTop: '20px' }}>
                <strong>🎯 React 통합 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>🔄 상태 관리:</strong> useState로 복잡한 앱 상태 관리
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>⚡ 낙관적 업데이트:</strong> 서버 응답 전에 UI 먼저 업데이트
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>🎨 사용자 경험:</strong> 로딩 상태, 에러 처리, 성공 메시지
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>📱 실시간 인터랙션:</strong> 즉시 반응하는 UI/UX
                    </div>
                    <div>
                        <strong>🔗 데이터 관계:</strong> 사용자와 포스트 간의 관계 활용
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ex05ReactIntegration;