import { useState } from 'react';

// 폼 제출 preventDefault 예제 - 페이지 새로고침 방지

function Ex04FormExample() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // preventDefault 적용 - 페이지 새로고침 방지
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작(페이지 새로고침) 방지
        console.log('폼이 제출되었습니다:', { name, email });
        alert(`제출된 정보: ${name}, ${email}`);
        // 페이지가 새로고침되지 않음
    };

    return (
        <div>
            <h3>preventDefault 폼 예제</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <input 
                    type="email" 
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <button type="submit">제출 (새로고침 안됨)</button>
            </form>
        </div>
    );
}

export default Ex04FormExample;