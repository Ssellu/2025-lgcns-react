// stopPropagation()과 preventDefault() 함께 사용

function Ex08CombinedExample() {
    return (
        <div onClick={() => alert('부모 div 클릭!')}>
            <form onSubmit={() => alert('폼 제출!')}>
                <button 
                    type="submit"
                    onClick={(e) => {
                        e.stopPropagation();  // 부모로의 이벤트 전파 중단
                        e.preventDefault();   // 폼 제출 기본 동작 방지
                        alert('버튼 클릭! (부모 클릭과 폼 제출 모두 방지됨)');
                    }}>
                    두 기능 모두 적용된 버튼
                </button>
            </form>
        </div>
    );
}

export default Ex08CombinedExample;