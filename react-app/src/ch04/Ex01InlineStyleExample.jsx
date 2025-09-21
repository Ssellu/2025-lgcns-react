// Inline Style 기본 예제

function Ex01InlineStyleExample() {
    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    };

    const containerStyle = {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa'
    };

    return (
        <div style={containerStyle}>
            <h2>Inline Style 예제</h2>
            <button style={buttonStyle}>
                스타일이 적용된 버튼
            </button>
        </div>
    );
}

export default Ex01InlineStyleExample;