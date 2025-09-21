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