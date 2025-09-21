import React, { useReducer } from 'react';

// 할 일 액션 타입
const TODO_ACTIONS = {
  ADD_TODO: 'add_todo',
  TOGGLE_TODO: 'toggle_todo',
  DELETE_TODO: 'delete_todo',
  EDIT_TODO: 'edit_todo',
  SET_FILTER: 'set_filter'
};

// 필터 타입
const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// 초기 상태
const initialState = {
  todos: [
    { id: 1, text: 'React 학습하기', completed: false },
    { id: 2, text: 'useReducer 마스터하기', completed: true },
    { id: 3, text: '프로젝트 완성하기', completed: false }
  ],
  nextId: 4,
  filter: FILTERS.ALL
};

// 할 일 리듀서
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD_TODO:
      if (!action.payload.trim()) return state;
      
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.payload.trim(),
            completed: false
          }
        ],
        nextId: state.nextId + 1
      };

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case TODO_ACTIONS.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    default:
      return state;
  }
}

// 할 일 아이템 컴포넌트
function TodoItem({ todo, dispatch, isEditing, onEditStart, onEditEnd }) {
  const [editText, setEditText] = React.useState(todo.text);

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      dispatch({
        type: TODO_ACTIONS.EDIT_TODO,
        payload: { id: todo.id, text: editText.trim() }
      });
    } else {
      setEditText(todo.text);
    }
    onEditEnd();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      onEditEnd();
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #eee',
      backgroundColor: todo.completed ? '#f8f9fa' : 'white'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch({ type: TODO_ACTIONS.TOGGLE_TODO, payload: todo.id })}
        style={{ marginRight: '10px' }}
      />
      
      {isEditing ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            style={{ flex: 1, padding: '4px', marginRight: '10px' }}
            autoFocus
          />
          <button onClick={handleSave} style={{ marginRight: '5px', padding: '4px 8px' }}>저장</button>
          <button onClick={() => { setEditText(todo.text); onEditEnd(); }} style={{ padding: '4px 8px' }}>취소</button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#6c757d' : 'black',
              cursor: 'pointer'
            }}
            onDoubleClick={onEditStart}
          >
            {todo.text}
          </span>
          <button
            onClick={onEditStart}
            style={{ marginRight: '5px', padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            수정
          </button>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.DELETE_TODO, payload: todo.id })}
            style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

function Ex02UseReducerComplex() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [newTodo, setNewTodo] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);

  // 필터링된 할 일 목록
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case FILTERS.ACTIVE:
        return !todo.completed;
      case FILTERS.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  // 통계
  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  const handleAddTodo = (e) => {
    e.preventDefault();
    dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: newTodo });
    setNewTodo('');
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', margin: '10px' }}>
      <h3>Ex02 - useReducer 복잡한 상태 관리 (Todo App)</h3>
      
      {/* 통계 */}
      <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
        <h4>📊 통계</h4>
        <p>전체: {totalTodos} | 완료: {completedTodos} | 미완료: {activeTodos}</p>
      </div>

      {/* 새 할 일 추가 */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새 할 일을 입력하세요..."
            style={{ flex: 1, padding: '8px', marginRight: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            추가
          </button>
        </div>
      </form>

      {/* 필터 버튼들 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>🔍 필터</h4>
        {Object.entries(FILTERS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: value })}
            style={{
              marginRight: '10px',
              padding: '6px 12px',
              backgroundColor: state.filter === value ? '#007bff' : '#e9ecef',
              color: state.filter === value ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {key === 'ALL' ? '전체' : key === 'ACTIVE' ? '미완료' : '완료'}
          </button>
        ))}
      </div>

      {/* 할 일 목록 */}
      <div style={{ border: '1px solid #ddd', borderRadius: '4px', minHeight: '200px' }}>
        <h4 style={{ padding: '10px', margin: '0', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
          📝 할 일 목록 ({filteredTodos.length})
        </h4>
        
        {filteredTodos.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
            {state.filter === FILTERS.ALL ? '할 일이 없습니다.' :
             state.filter === FILTERS.ACTIVE ? '미완료 할 일이 없습니다.' :
             '완료된 할 일이 없습니다.'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              dispatch={dispatch}
              isEditing={editingId === todo.id}
              onEditStart={() => setEditingId(todo.id)}
              onEditEnd={() => setEditingId(null)}
            />
          ))
        )}
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', marginTop: '15px', fontSize: '14px' }}>
        <strong>학습 포인트:</strong>
        <ul>
          <li>useReducer는 useState로 관리하기 복잡한 상태에 적합합니다</li>
          <li>액션을 통해 상태 변경 로직을 명확하게 정의할 수 있습니다</li>
          <li>리듀서 함수는 예측 가능하고 테스트하기 쉽습니다</li>
          <li>여러 컴포넌트 간에 동일한 상태 로직을 공유할 수 있습니다</li>
          <li>더블클릭으로 할 일을 수정할 수 있고, Enter/Escape로 저장/취소됩니다</li>
        </ul>
      </div>
    </div>
  );
}

export default Ex02UseReducerComplex;