# 4. React Style & MUI

**[수업 목표]**

- React에서 다양한 스타일링 방법을 이해하고 적용할 수 있다.
- Inline Style, CSS 파일, CSS Modules의 차이점과 사용법을 익힌다.
- Styled Components를 활용한 CSS-in-JS 스타일링 방법을 학습한다.
- Material-UI(MUI)를 설치하고 활용할 수 있다.
- MUI의 주요 컴포넌트들을 사용하여 실용적인 UI를 구현할 수 있다.
- 반응형 디자인과 테마 커스터마이징 방법을 학습한다.

# 1. React 스타일링 방법들
## 1.1. Inline Style

React에서 가장 기본적인 스타일링 방법으로, `style` 속성에 객체를 전달.

### **특징**
- CSS 속성명을 camelCase로 작성
- 값은 문자열이나 숫자로 지정
- 컴포넌트별로 독립적인 스타일 적용
- 동적 스타일링에 유리

### **기본 예제**

```jsx
function InlineStyleExample() {
    // Style 객체 생성 
    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    };

    // Style 객체 생성 
    const containerStyle = {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa'
    };

    return (
        <div style={containerStyle}>  {/* 스타일 객체 적용 */}
            <h2>Inline Style 예제</h2>
            <button style={buttonStyle}> {/* 스타일 객체 적용 */}
                스타일이 적용된 버튼
            </button>
        </div>
    );
}
```

### **동적 스타일링 예제**

```jsx
import { useState } from 'react';

function DynamicStyleExample() {
    const [isActive, setIsActive] = useState(false);

    const buttonStyle = {
        backgroundColor: isActive ? '#28a745' : '#dc3545',  // 이 부분!
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    };

    return (
        <div>
            <h3>동적 스타일링</h3>
            <button 
                style={buttonStyle}
                onClick={() => setIsActive(!isActive)}  {/* 이 부분! */}
            >
                {isActive ? '활성화됨' : '비활성화됨'}
            </button>
        </div>
    );
}
```

## 1.2. CSS 파일 사용

별도의 CSS 파일을 만들고 import하여 사용하는 방법

### **장점**
- 기존 CSS 지식 활용 가능
- 코드 분리로 가독성 향상
- CSS의 모든 기능 사용 가능

### **단점**
- 글로벌 스코프로 인한 스타일 충돌 가능성
- 컴포넌트별 스타일 관리 어려움

### **사용 예제**

**styles.css**
```css
.card-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.card-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.card-content {
    color: #666;
    line-height: 1.5;
}

.primary-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
}

.primary-button:hover {
    background-color: #0056b3;
}
```

**CSS 파일을 사용하는 컴포넌트**
```jsx
import './styles.css';

function CSSFileExample() {
    return (
        {/* 클래스로 css 스타일 접근(전통적 방식을 그대로 사용할 수 있다.) */}
        <div className="card-container">  
            <h3 className="card-title">CSS 파일 예제</h3>
            <p className="card-content">
                외부 CSS 파일을 사용한 스타일링 예제입니다.
                hover 효과도 쉽게 적용할 수 있습니다.
            </p>
            <button className="primary-button">
                클릭해보세요
            </button>
        </div>
    );
}
```

## 1.3. CSS Modules

CSS 파일의 클래스명을 모듈화하여 스코프를 지역적으로 제한하는 방법

### **특징**
- 파일명을 `*.module.css`로 작성
- 클래스명 충돌 방지
- 컴포넌트별 독립적인 스타일 관리

### **사용 예제**

**Card.module.css**
```css
.container {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 24px;
    margin: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    text-align: center;
}

.description {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 16px;
}

.button {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    border-radius: 6px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.button:hover {
    background-color: white;
    color: #667eea;
}
```

**CSS Modules를 사용하는 컴포넌트**
```jsx
import styles from './Card.module.css';

function CSSModuleExample() {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>CSS Modules 예제</h3>
            <p className={styles.description}>
                CSS Modules를 사용하면 클래스명 충돌 없이 
                컴포넌트별로 독립적인 스타일을 적용할 수 있습니다.
            </p>
            <button className={styles.button}>
                모듈 스타일 버튼
            </button>
        </div>
    );
}
```

# 2. Styled Components (CSS-in-JS)

JavaScript 코드 안에서 CSS를 작성할 수 있는 라이브러리

## 2.1. 설치 및 기본 사용법

```bash
npm install styled-components
```

### **기본 예제**

```jsx
import styled from 'styled-components';

const StyledContainer = styled.div`
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    border-radius: 12px;
    padding: 20px;
    margin: 20px;
    color: white;
    box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
`;

const StyledTitle = styled.h2`
    font-size: 24px;
    text-align: center;
    margin-bottom: 16px;
`;

const StyledButton = styled.button`
    background: transparent;
    border: 2px solid white;
    border-radius: 6px;
    color: white;
    margin: 0 8px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
        background: white;
        color: #FE6B8B;
    }
`;

function StyledComponentExample() {
    return (
        <StyledContainer>
            <StyledTitle>Styled Components 예제</StyledTitle>
            <p>CSS-in-JS 방식으로 스타일링한 컴포넌트입니다.</p>
            <StyledButton>버튼 1</StyledButton>
            <StyledButton>버튼 2</StyledButton>
        </StyledContainer>
    );
}
```

## 2.2. Props 활용한 동적 스타일링

```jsx
import styled from 'styled-components';
import { useState } from 'react';

const DynamicButton = styled.button`
    background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
    color: white;
    border: none;
    border-radius: 4px;
    padding: ${props => props.size === 'large' ? '12px 24px' : '8px 16px'};
    font-size: ${props => props.size === 'large' ? '18px' : '14px'};
    cursor: pointer;
    margin: 4px;
    opacity: ${props => props.disabled ? 0.6 : 1};
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => props.primary ? '#0056b3' : '#545b62'};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

function DynamicStyledExample() {
    const [disabled, setDisabled] = useState(false);

    return (
        <div>
            <h3>동적 Styled Components</h3>
            <DynamicButton primary>Primary Button</DynamicButton>
            <DynamicButton>Secondary Button</DynamicButton>
            <DynamicButton primary size="large">Large Primary</DynamicButton>
            <DynamicButton disabled={disabled}>
                {disabled ? 'Disabled' : 'Enabled'}
            </DynamicButton>
            <br />
            <button onClick={() => setDisabled(!disabled)}>
                Toggle Disabled
            </button>
        </div>
    );
}
```

# 3. Material-UI (MUI) 사용하기

Material-UI는 Google의 Material Design을 React로 구현한 컴포넌트 라이브러리

## 3.1. 설치

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm build
npm run dev
```

## 3.2. 기본 설정

```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* 앱 컴포넌트들 */}
        </ThemeProvider>
    );
}
```

## 3.3. 기본 컴포넌트 사용법

### **Button 컴포넌트**

```jsx
import { Button, ButtonGroup } from '@mui/material';
import { Delete, Send, Save } from '@mui/icons-material';

function MUIButtonExample() {
    return (
        <div style={{ padding: '20px' }}>
            <h3>MUI Button 예제</h3>
            
            {/* 기본 버튼들 */}
            <div style={{ marginBottom: '16px' }}>
                <Button variant="text">Text</Button>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
            </div>
            
            {/* 색상 변형 */}
            <div style={{ marginBottom: '16px' }}>
                <Button variant="contained" color="primary">Primary</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" color="success">Success</Button>
                <Button variant="contained" color="error">Error</Button>
            </div>
            
            {/* 아이콘 버튼들 */}
            <div style={{ marginBottom: '16px' }}>
                <Button variant="contained" startIcon={<Delete />}>Delete</Button>
                <Button variant="contained" endIcon={<Send />}>Send</Button>
                <Button variant="outlined" startIcon={<Save />}>Save</Button>
            </div>
            
            {/* 버튼 그룹 */}
            <ButtonGroup variant="contained">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
        </div>
    );
}
```

### **TextField 컴포넌트**

```jsx
import { TextField, Box } from '@mui/material';
import { useState } from 'react';

function Ex07MUITextFieldExample() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        message: ''
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            <h3>MUI TextField 예제</h3>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="이름"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    variant="outlined"
                />
                
                <TextField
                    label="이메일"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    variant="filled"
                />
                
                <TextField
                    label="비밀번호"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    variant="standard"
                />
                
                <TextField
                    label="메시지"
                    name="message"
                    multiline
                    rows={4}
                    value={values.message}
                    onChange={handleChange}
                />
                
                <TextField
                    label="읽기 전용"
                    value="수정할 수 없습니다"
                    slotProps={{
                        input: {
                            readOnly: true,
                        }
                    }}
                />
                
                <TextField
                    label="비활성화됨"
                    disabled
                    value="비활성화된 필드"
                />
            </Box>
        </Box>
    );
}
export default Ex07MUITextFieldExample;
```

### **Card 컴포넌트**

```jsx
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Grid
} from '@mui/material';

function Ex08MUICardExample() {
    const cards = [
        {
            title: 'React 프론트엔드',
            description: '현대적인 웹 애플리케이션을 구축하는 최고의 JavaScript 라이브러리입니다.',
            image: 'https://picsum.photos/300/200?random=1'
        },
        {
            title: 'MUI 디자인 시스템',
            description: 'Material Design 기반의 강력하고 아름다운 React 컴포넌트 라이브러리입니다.',
            image: 'https://picsum.photos/300/200?random=2'
        },
        {
            title: '반응형 웹 디자인',
            description: '모든 디바이스에서 완벽하게 동작하는 아름답고 직관적인 사용자 인터페이스입니다.',
            image: 'https://picsum.photos/300/200?random=3'
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h3>MUI Card 예제</h3>
            <Grid container spacing={3}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={card.image}
                                alt={card.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">공유</Button>
                                <Button size="small">더보기</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Ex08MUICardExample;
```

## 3.4. Layout 컴포넌트

### **AppBar와 Drawer**

```jsx
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box
} from '@mui/material';
import { Menu as MenuIcon, Home, Info, Phone } from '@mui/icons-material';
import { useState } from 'react';

function Ex09MUILayoutExample() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: '홈', icon: <Home /> },
        { text: '정보', icon: <Info /> },
        { text: '연락처', icon: <Phone /> }
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MUI Layout 예제
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem button key={index}>
                                {item.icon}
                                <ListItemText primary={item.text} sx={{ ml: 2 }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    메인 콘텐츠
                </Typography>
                <Typography variant="body1">
                    메뉴 아이콘을 클릭해서 네비게이션 드로어를 열어보세요.
                </Typography>
            </Box>
        </Box>
    );
}
export default Ex09MUILayoutExample;
```

## 3.5. 종합 예제 - 사용자 대시보드

```jsx
import {
    Container,
    Paper,
    Grid,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    CheckCircle,
    Schedule
} from '@mui/icons-material';

function Ex10MUIDashboardExample() {
    const user = {
        name: '김철수',
        email: 'kimcs@example.com',
        phone: '010-1234-5678',
        location: '서울시 강남구',
        avatar: 'https://via.placeholder.com/150?text=KCS'
    };

    const projects = [
        { name: '프로젝트 A', progress: 85, status: 'active' },
        { name: '프로젝트 B', progress: 60, status: 'active' },
        { name: '프로젝트 C', progress: 100, status: 'completed' }
    ];

    const tasks = [
        { text: '회의 준비', completed: true },
        { text: '보고서 작성', completed: false },
        { text: '코드 리뷰', completed: false },
        { text: '테스트 실행', completed: true }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                사용자 대시보드
            </Typography>
            
            <Grid container spacing={3}>
                {/* 사용자 프로필 */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                            src={user.avatar}
                            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {user.name}
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><Email /></ListItemIcon>
                                <ListItemText primary={user.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Phone /></ListItemIcon>
                                <ListItemText primary={user.phone} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><LocationOn /></ListItemIcon>
                                <ListItemText primary={user.location} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* 프로젝트 현황 */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            프로젝트 현황
                        </Typography>
                        {projects.map((project, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">
                                        {project.name}
                                    </Typography>
                                    <Chip
                                        label={project.status === 'completed' ? '완료' : '진행중'}
                                        color={project.status === 'completed' ? 'success' : 'primary'}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                    {project.progress}% 완료
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* 할 일 목록 */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            오늘의 할 일
                        </Typography>
                        <List>
                            {tasks.map((task, index) => (
                                <div key={index}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {task.completed ? <CheckCircle color="success" /> : <Schedule />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={task.text}
                                            sx={{
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                opacity: task.completed ? 0.7 : 1
                                            }}
                                        />
                                    </ListItem>
                                    {index < tasks.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
export default Ex10MUIDashboardExample;
```

# 4. 스타일링 방법 비교 및 선택 가이드

## 4.1. 각 방법의 장단점

| 방법 | 장점 | 단점 | 적합한 경우 |
|------|------|------|-------------|
| **Inline Style** | 동적 스타일링 쉬움, 컴포넌트 독립성 | 재사용성 부족, CSS 기능 제한 | 간단한 동적 스타일 |
| **CSS 파일** | 기존 CSS 활용, 모든 CSS 기능 사용 | 전역 스코프, 스타일 충돌 위험 | 전역 스타일, 기존 프로젝트 |
| **CSS Modules** | 지역 스코프, 클래스명 충돌 방지 | 설정 필요, 학습 곡선 | 중대형 프로젝트 |
| **Styled Components** | CSS-in-JS, 동적 스타일링 강력 | 번들 크기 증가, 런타임 오버헤드 | 복잡한 동적 스타일 |
| **MUI** | 완성된 디자인 시스템, 빠른 개발 | 커스터마이징 제한, 의존성 | 프로토타입, 관리자 페이지 |

## 4.2. 프로젝트별 추천

### **소규모 프로젝트**
- Inline Style + CSS 파일 조합
- 간단한 컴포넌트는 Inline Style
- 공통 스타일은 CSS 파일

### **중대형 프로젝트**
- CSS Modules 또는 Styled Components
- 체계적인 스타일 관리
- 컴포넌트별 독립적 스타일링

### **빠른 프로토타이핑**
- MUI 또는 기타 UI 라이브러리
- 완성된 컴포넌트 활용
- 커스터마이징 최소화

# 5. 실습 과제: MUI를 활용한 Todo App 구현

```jsx
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
```