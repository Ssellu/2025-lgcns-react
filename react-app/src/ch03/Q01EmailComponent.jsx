import { useState } from 'react';

const Email = () => {

    const checkEmail = (inputEmail) => {

        const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (EMAIL_REGEX.test(inputEmail) === true) {
            // 이메일 형식임
            alert("올바른 이메일 형식입니다.");
            /* TODO */
        }
        else {
            alert("올바르지 않은 이메일 형식입니다.");
            /* TODO */
        }
    }
    
    return (
        <div>
            <input 
                type="text" 
                placeholder="이메일을 입력하세요."
                onChange={/* TODO */}/>
            <button onClick={/* TODO */}>유효성 확인</button>
            <p>현재 이메일: {/* TODO */}</p>
        </div>
    );
};

export default Email;