import { useState, useEffect } from 'react';

// 완전한 CRUD 애플리케이션 예제 (사용자 관리 시스템)
function Ex06CompleteCRUD() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        age: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState({ fetch: false, save: false, delete: false });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE = 'http://localhost:3000';

    // 사용자 목록 가져오기
    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, fetch: true }));
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE}/users?_sort=${sortField}&_order=${sortOrder}`);
            if (!response.ok) throw new Error('사용자 목록을 가져올 수 없습니다');
            
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    // 새 사용자 생성
    const createUser = async (userData) => {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('사용자 생성에 실패했습니다');
        return response.json();
    };

    // 사용자 업데이트
    const updateUser = async (id, userData) => {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('사용자 업데이트에 실패했습니다');
        return response.json();
    };

    // 사용자 삭제
    const deleteUser = async (id) => {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('사용자 삭제에 실패했습니다');
        return true;
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('이름과 이메일은 필수 입력 항목입니다');
            return;
        }

        setLoading(prev => ({ ...prev, save: true }));
        setError(null);
        
        try {
            const userData = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null
            };

            if (isEditing) {
                const updatedUser = await updateUser(currentUser.id, userData);
                setUsers(prev => prev.map(user => 
                    user.id === currentUser.id ? updatedUser : user
                ));
                setSuccessMessage('사용자 정보가 업데이트되었습니다');
            } else {
                const newUser = await createUser(userData);
                setUsers(prev => [newUser, ...prev]);
                setSuccessMessage('새 사용자가 생성되었습니다');
            }

            resetForm();
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, save: false }));
        }
    };

    // 사용자 삭제 처리
    const handleDelete = async (user) => {
        if (!window.confirm(`정말 "${user.name}" 사용자를 삭제하시겠습니까?`)) return;
        
        setLoading(prev => ({ ...prev, delete: true }));
        setError(null);
        
        try {
            await deleteUser(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            setSuccessMessage('사용자가 삭제되었습니다');
            
            if (currentUser?.id === user.id) {
                resetForm();
            }
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    // 수정 모드로 전환
    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            city: user.city || '',
            age: user.age ? user.age.toString() : ''
        });
        setIsEditing(true);
    };

    // 폼 초기화
    const resetForm = () => {
        setCurrentUser(null);
        setFormData({ name: '', email: '', city: '', age: '' });
        setIsEditing(false);
    };

    // 필터링된 사용자 목록
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 정렬 변경
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchUsers();
    }, [sortField, sortOrder]);

    // 에러 메시지 자동 해제
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div style={{ padding: '20px', border: '2px solid #e91e63', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex06 - 완전한 CRUD 애플리케이션</h3>
            
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

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
                {/* 폼 영역 */}
                <div>
                    <h4>{isEditing ? '📝 사용자 수정' : '➕ 새 사용자 추가'}</h4>
                    
                    <form onSubmit={handleSubmit} style={{
                        backgroundColor: '#f5f5f5',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                이름 *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="사용자 이름을 입력하세요"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                이메일 *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="이메일을 입력하세요"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                도시
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="도시를 입력하세요"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                나이
                            </label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="나이를 입력하세요"
                                min="1"
                                max="150"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="submit"
                                disabled={loading.save}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: isEditing ? '#ff9800' : '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading.save ? '처리중...' : isEditing ? '수정하기' : '추가하기'}
                            </button>
                            
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    취소
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 사용자 목록 영역 */}
                <div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h4>👥 사용자 목록 ({filteredUsers.length}명)</h4>
                        <button
                            onClick={fetchUsers}
                            disabled={loading.fetch}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {loading.fetch ? '로딩중...' : '새로고침'}
                        </button>
                    </div>

                    {/* 검색 및 정렬 */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px'
                    }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                                🔍 검색
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="이름, 이메일, 도시로 검색..."
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
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                                📊 정렬
                            </label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {['name', 'email', 'city', 'age'].map(field => (
                                    <button
                                        key={field}
                                        onClick={() => handleSort(field)}
                                        style={{
                                            padding: '6px 10px',
                                            fontSize: '11px',
                                            border: '1px solid #ddd',
                                            borderRadius: '3px',
                                            backgroundColor: sortField === field ? '#e3f2fd' : 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {field}
                                        {sortField === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 사용자 목록 */}
                    {loading.fetch ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            ⏳ 사용자 목록을 불러오는 중...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '6px',
                            color: '#666'
                        }}>
                            {searchTerm ? '검색 결과가 없습니다' : '등록된 사용자가 없습니다'}
                        </div>
                    ) : (
                        <div style={{ 
                            maxHeight: '500px', 
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '6px'
                        }}>
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    style={{
                                        padding: '15px',
                                        borderBottom: index < filteredUsers.length - 1 ? '1px solid #eee' : 'none',
                                        backgroundColor: currentUser?.id === user.id ? '#fff3e0' : 'white',
                                        borderLeft: currentUser?.id === user.id ? '4px solid #ff9800' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'start'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                                                {user.name}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '14px', marginBottom: '3px' }}>
                                                📧 {user.email}
                                            </div>
                                            {user.city && (
                                                <div style={{ color: '#666', fontSize: '14px', marginBottom: '3px' }}>
                                                    📍 {user.city}
                                                </div>
                                            )}
                                            {user.age && (
                                                <div style={{ color: '#666', fontSize: '14px', marginBottom: '3px' }}>
                                                    🎂 {user.age}세
                                                </div>
                                            )}
                                            <div style={{ fontSize: '12px', color: '#999' }}>
                                                ID: #{user.id}
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#ff9800',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={loading.delete}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ backgroundColor: '#fce4ec', padding: '15px', borderRadius: '4px', fontSize: '14px', marginTop: '20px' }}>
                <strong>🎯 완전한 CRUD 애플리케이션 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>📋 Create (생성):</strong> POST 요청으로 새 데이터 생성
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>👀 Read (조회):</strong> GET 요청으로 데이터 조회, 검색, 정렬
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>✏️ Update (수정):</strong> PUT 요청으로 기존 데이터 수정
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <strong>🗑️ Delete (삭제):</strong> DELETE 요청으로 데이터 삭제
                    </div>
                    <div>
                        <strong>🎨 사용자 경험:</strong> 실시간 UI 업데이트, 폼 유효성 검사, 확인 대화상자
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ex06CompleteCRUD;