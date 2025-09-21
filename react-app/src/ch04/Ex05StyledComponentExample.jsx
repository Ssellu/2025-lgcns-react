// Styled Components 기본 예제 (styled-components 설치 필요: npm install styled-components)
// import styled from 'styled-components';

// const StyledContainer = styled.div`
//     background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
//     border-radius: 12px;
//     padding: 20px;
//     margin: 20px;
//     color: white;
//     box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
// `;

// const StyledTitle = styled.h2`
//     font-size: 24px;
//     text-align: center;
//     margin-bottom: 16px;
// `;

// const StyledButton = styled.button`
//     background: transparent;
//     border: 2px solid white;
//     border-radius: 6px;
//     color: white;
//     margin: 0 8px;
//     padding: 8px 16px;
//     cursor: pointer;
//     font-size: 14px;
//     transition: all 0.3s ease;
    
//     &:hover {
//         background: white;
//         color: #FE6B8B;
//     }
// `;

function Ex05StyledComponentExample() {
    // styled-components가 설치되지 않은 경우를 위한 fallback
    const containerStyle = {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px',
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, 0.3)'
    };

    const titleStyle = {
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '16px'
    };

    const buttonStyle = {
        background: 'transparent',
        border: '2px solid white',
        borderRadius: '6px',
        color: 'white',
        margin: '0 8px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    return (
        // styled-components 사용시: <StyledContainer>
        <div style={containerStyle}>
            <h2 style={titleStyle}>Styled Components 예제</h2>
            <p>CSS-in-JS 방식으로 스타일링한 컴포넌트입니다.</p>
            <p><small>※ styled-components 설치 필요: npm install styled-components</small></p>
            <button style={buttonStyle}>버튼 1</button>
            <button style={buttonStyle}>버튼 2</button>
        </div>
        // </StyledContainer>
    );
}

export default Ex05StyledComponentExample;