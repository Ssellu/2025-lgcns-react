import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, Checkbox, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoApp() {

  // TODO state 생성
  // Todo Item 구성 요소: id(int), title(str), completed(bool)
  

  // 추가하기 기능
  const handleAdd = async () => {
    //  TODO
  };

  // 상태 토글(완료/미완료) 기능
  const handleToggle = async (id, completed) => {
    //  TODO
  };

  // 삭제 기능
  const handleDelete = async (id) => {
    // TODO
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>To-Do App</Typography>
      {/* 할 일 입력란(TextField) 만들기 */}
      {/* 추가 버튼(Button) 만들기 */}
      {/* 할일 목록(List와 ListItem) 만들기
            - 각 목록에는 Checkbox로 완료 여부 Toggle
            - ListItem은 다음과 같이 구현할 수 있습니다.
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
       */}
    </Container>
  );
}

export default TodoApp;
