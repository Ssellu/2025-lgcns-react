import CardLayout from './Ex02CardLayout';

function Cards() {
    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
        justifyContent: 'center'
    };

    return (
        <div style={containerStyle}>
            <CardLayout title="사용자 프로필">
                <div>
                    <p><strong>이름:</strong> 홍길동</p>
                    <p><strong>이메일:</strong> hong@example.com</p>
                    <p><strong>직업:</strong> 프론트엔드 개발자</p>
                    <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        프로필 보기
                    </button>
                </div>
            </CardLayout>

            <CardLayout title="날씨 정보">
                <div>
                    <p><strong>지역:</strong> 서울시</p>
                    <p><strong>온도:</strong> 23°C</p>
                    <p><strong>날씨:</strong> 맑음 ☀️</p>
                    <p><strong>습도:</strong> 65%</p>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        마지막 업데이트: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </CardLayout>

            <CardLayout title="할 일 목록">
                <div>
                    <ul style={{ paddingLeft: '20px', margin: '0' }}>
                        <li>React 컴포넌트 만들기 ✅</li>
                        <li>CSS 스타일링 적용하기</li>
                        <li>API 연동하기</li>
                        <li>테스트 작성하기</li>
                    </ul>
                    <div style={{ marginTop: '15px' }}>
                        <small style={{ color: '#888' }}>
                            진행률: 1/4 (25%)
                        </small>
                    </div>
                </div>
            </CardLayout>
        </div>
    );
}

export default Cards;
