function HelloReact() {
    const contentStyle = {
        backgroundColor: 'salmon',
        color: 'white',
        fontSize: 24,   // 기본 단위 px,
        padding: '1rem' // 다른 단위 표기시 str로 표기
    }

    let name = 'John Doe';
    
    return (
        <div style={contentStyle}>
            <h1>Hello, React!</h1>
            <p>Welcome, {name}!</p>
        </div>
    );
}

export default HelloReact;