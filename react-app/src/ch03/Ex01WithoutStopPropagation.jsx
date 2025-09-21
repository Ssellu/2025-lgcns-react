// 기본 이벤트 전파 예제 - 버튼 클릭 시 부모까지 전파되는 경우

function Ex01WithoutStopPropagation() {
    return (
        <div 
            onClick={() => alert('부모 div가 클릭되었습니다!')}
            style={{ 
                border: '2px solid blue', 
                padding: '30px', 
                backgroundColor: 'lightblue' 
            }}>
            <p>부모 영역입니다. 클릭해보세요!</p>
            <button onClick={() => alert('버튼이 클릭되었습니다!')}>
                자식 버튼
            </button>
        </div>
    );
}

export default Ex01WithoutStopPropagation;