import { useState } from 'react';

// 드래그 앤 드롭 예제

function Ex07DragDropExample() {
    const [draggedItem, setDraggedItem] = useState('');

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // 드롭을 허용하기 위해 필요
    };

    const handleDrop = (e) => {
        e.preventDefault(); // 기본 동작 방지
        alert(`${draggedItem}이(가) 드롭되었습니다!`);
    };

    return (
        <div>
            <h3>드래그 앤 드롭 예제</h3>
            <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, '파일 A')}
                style={{ 
                    border: '1px solid blue', 
                    padding: '10px', 
                    margin: '10px',
                    backgroundColor: 'lightblue',
                    cursor: 'move'
                }}>
                드래그 가능한 아이템 A
            </div>
            
            <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ 
                    border: '2px dashed #ccc', 
                    padding: '50px', 
                    margin: '10px',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'center'
                }}>
                여기에 드롭하세요
            </div>
        </div>
    );
}

export default Ex07DragDropExample;