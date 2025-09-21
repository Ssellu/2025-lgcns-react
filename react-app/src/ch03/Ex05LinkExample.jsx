// 링크 클릭 preventDefault 예제

function Ex05LinkExample() {
    const handleLinkClick = (e) => {
        e.preventDefault(); // 페이지 이동 방지
        alert('링크 클릭이 감지되었지만 페이지 이동은 막았습니다!');
        // 여기서 커스텀 동작 실행 가능
    };

    return (
        <div>
            <h3>링크 기본 동작 제어</h3>
            <a href="https://google.com">일반 링크 (구글로 이동)</a>
            <br /><br />
            <a href="https://google.com" onClick={handleLinkClick}>
                preventDefault 적용 링크 (이동 안됨)
            </a>
        </div>
    );
}

export default Ex05LinkExample;