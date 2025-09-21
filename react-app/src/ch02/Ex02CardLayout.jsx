function CardLayout({ children, title }) {
    const cardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        maxWidth: '400px'
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
    };

    return (
        <div style={cardStyle}>
            {title && <h3 style={titleStyle}>{title}</h3>}
            <div>{children}</div>  {/* 이 부분! */}
        </div>
    );
}

export default CardLayout;