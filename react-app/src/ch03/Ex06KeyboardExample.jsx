import { useState } from 'react';

// 키보드 이벤트 제어 예제 - 숫자만 입력, 우클릭 방지

function Ex06KeyboardExample() {
    const [text, setText] = useState('');

    const handleKeyDown = (e) => {
        // 숫자만 입력 허용, 다른 키는 preventDefault
        if (!/[0-9]/.test(e.key) && 
            !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
            e.preventDefault();
            alert('숫자만 입력 가능합니다!');
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault(); // 우클릭 메뉴 방지
        alert('우클릭이 비활성화되어 있습니다!');
    };

    return (
        <div>
            <h3>키보드 이벤트 제어</h3>
            <input 
                type="text"
                placeholder="숫자만 입력 가능"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            
            <div 
                onContextMenu={handleContextMenu}
                style={{ 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    marginTop: '10px',
                    backgroundColor: '#f9f9f9'
                }}>
                이 영역에서 우클릭해보세요! (우클릭 메뉴가 나타나지 않음)
            </div>
        </div>
    );
}

export default Ex06KeyboardExample;