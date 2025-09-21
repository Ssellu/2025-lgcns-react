import { useState } from 'react';

const Email = () => {

    const [email, setEmail] = useState('');

    const checkEmail = (inputEmail) => {

        const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (EMAIL_REGEX.test(inputEmail) === true) {
            // 이메일 형식임
            alert("올바른 이메일 형식입니다.");
            setEmail(inputEmail);
        }
        else {
            alert("올바르지 않은 이메일 형식입니다.");
            setEmail("");
        }
    }
    
    return (
        <div>
            <input 
                type="text" 
                placeholder="이메일을 입력하세요."
                value={email}
                onChange={e => setEmail(e.target.value)}/>
            <button onClick={() => { checkEmail(email) }}>유효성 확인</button>
            <p>현재 이메일: {email}</p>
        </div>
    );
};

export default Email;