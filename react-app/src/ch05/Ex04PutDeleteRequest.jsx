// Ex04PutDeleteRequest.jsx - PUT과 DELETE 요청 예제
import { useState, useEffect } from 'react';

export default function Ex04PutDeleteRequest() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // 할 일 목록 가져오기
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=6');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // PUT 요청: 할 일 수정하기
  const updateTodo = async (id, updatedData) => {
    try {
      console.log(`Updating todo ${id}:`, updatedData);
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        console.log('PUT response:', updatedTodo);
        
        // 로컬 상태 업데이트
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id ? { ...todo, ...updatedData } : todo
          )
        );
        
        setEditingTodo(null);
        setEditTitle('');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('할 일 수정 중 오류가 발생했습니다.');
    }
  };

  // DELETE 요청: 할 일 삭제하기
  const deleteTodo = async (id) => {
    if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log(`Deleting todo ${id}`);
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log(`Todo ${id} deleted successfully`);
        
        // 로컬 상태에서 제거
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('할 일 삭제 중 오류가 발생했습니다.');
    }
  };

  // 완료 상태 토글
  const toggleComplete = (todo) => {
    updateTodo(todo.id, { 
      ...todo, 
      completed: !todo.completed 
    });
  };

  // 수정 모드 시작
  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
  };

  // 수정 취소
  const cancelEditing = () => {
    setEditingTodo(null);
    setEditTitle('');
  };

  // 수정 완료
  const saveEditing = (todo) => {
    if (editTitle.trim()) {
      updateTodo(todo.id, {
        ...todo,
        title: editTitle.trim()
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Ex04: PUT/DELETE 요청</h3>
        <div>⏳ 할 일 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h3>Ex04: PUT과 DELETE 요청 예제</h3>
      <p>할 일 목록을 수정(PUT)하고 삭제(DELETE)하는 기능을 구현했습니다.</p>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={fetchTodos}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 새로고침
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>📋 할 일 목록 ({todos.length}개)</h4>
        {todos.map(todo => (
          <div key={todo.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px', 
            margin: '8px 0',
            backgroundColor: todo.completed ? '#f8f9fa' : '#ffffff',
            border: '1px solid #dee2e6', 
            borderRadius: '6px',
            opacity: todo.completed ? 0.7 : 1
          }}>
            {/* 완료 체크박스 */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
              style={{ marginRight: '12px', transform: 'scale(1.2)' }}
            />

            {/* 할 일 제목 (수정 모드) */}
            {editingTodo === todo.id ? (
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEditing(todo)}
                  style={{ 
                    flex: 1, 
                    padding: '6px', 
                    border: '2px solid #007bff', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
                <button 
                  onClick={() => saveEditing(todo)}
                  style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  ✅ 저장
                </button>
                <button 
                  onClick={cancelEditing}
                  style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  ❌ 취소
                </button>
              </div>
            ) : (
              <>
                {/* 할 일 제목 (일반 모드) */}
                <span style={{ 
                  flex: 1, 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6c757d' : '#333',
                  fontSize: '15px'
                }}>
                  <strong>#{todo.id}</strong> {todo.title}
                </span>

                {/* 액션 버튼들 */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => startEditing(todo)}
                    disabled={todo.completed}
                    style={{ 
                      padding: '6px 10px', 
                      backgroundColor: todo.completed ? '#ccc' : '#ffc107', 
                      color: todo.completed ? '#666' : '#000', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: todo.completed ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ✏️ 수정
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    style={{ 
                      padding: '6px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>🔧 PUT vs DELETE 비교:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
          <div>
            <strong>PUT 요청:</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>데이터 전체 업데이트</li>
              <li>멱등성 보장</li>
              <li>Body에 JSON 데이터 전송</li>
              <li>응답으로 업데이트된 데이터 반환</li>
            </ul>
          </div>
          <div>
            <strong>DELETE 요청:</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>리소스 삭제</li>
              <li>멱등성 보장</li>
              <li>보통 Body 없음</li>
              <li>상태 코드로 성공/실패 판단</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}