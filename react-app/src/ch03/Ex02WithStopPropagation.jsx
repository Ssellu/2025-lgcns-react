// stopPropagation 적용 예제 - 이벤트 전파를 막는 경우

function Ex02WithStopPropagation() {
    return (
        <div 
            onClick={() => alert('부모 div가 클릭되었습니다!')}
            style={{ 
                border: '2px solid red', 
                padding: '30px', 
                backgroundColor: 'lightcoral' 
            }}>
            <p>부모 영역입니다. 클릭해보세요!</p>
            <button onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 중단!
                alert('버튼이 클릭되었습니다!');
            }}>
                자식 버튼 (전파 중단)
            </button>
        </div>
    );
}

export default Ex02WithStopPropagation;