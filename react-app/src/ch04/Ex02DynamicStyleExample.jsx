import { useState } from 'react';

// 동적 Inline Style 예제

function Ex02DynamicStyleExample() {
    const [isActive, setIsActive] = useState(false);

    const buttonStyle = {
        backgroundColor: isActive ? '#28a745' : '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>동적 스타일링</h3>
            <button 
                style={buttonStyle}
                onClick={() => setIsActive(!isActive)}
            >
                {isActive ? '활성화됨' : '비활성화됨'}
            </button>
        </div>
    );
}

export default Ex02DynamicStyleExample;