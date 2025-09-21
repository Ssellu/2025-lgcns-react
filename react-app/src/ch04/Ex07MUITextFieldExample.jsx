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