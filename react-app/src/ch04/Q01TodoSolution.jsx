import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, Checkbox, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [lastId, setLastId] = useState(0);

  // 추가하기 기능
  const handleAdd = async () => {
    if (!input.trim()) return;
    const newTodo = { id: lastId, title: input, completed: false };
    setLastId(prev => {prev + 1});
    setTodos([...todos, newTodo]);
    setInput('');
  };

  // 상태 토글(완료/미완료) 기능
  const handleToggle = async (id, completed) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );
  };

  // 삭제 기능
  const handleDelete = async (id) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>To-Do App</Typography>
      <TextField
        label="할 일 입력"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleAdd} fullWidth>추가</Button>
      <List>
        {todos.map(({ id, title, completed }) => (
          <ListItem
            key={id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(id)}>
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <Checkbox
              checked={completed}
              onChange={() => handleToggle(id, completed)}
            />
            <ListItemText
              primary={title}
              sx={{ textDecoration: completed ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TodoApp;
