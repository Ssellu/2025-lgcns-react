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