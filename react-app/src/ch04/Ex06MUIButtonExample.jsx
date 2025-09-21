// MUI Button 예제 (MUI 설치 필요: npm install @mui/material @emotion/react @emotion/styled @mui/icons-material)

import { Button, ButtonGroup } from '@mui/material';
import { Delete, Send, Save } from '@mui/icons-material';

function Ex06MUIButtonExample() {
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

export default Ex06MUIButtonExample;