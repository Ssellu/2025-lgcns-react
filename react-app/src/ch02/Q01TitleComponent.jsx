

const Title = (props) => {
    return (
        <div>
            <h1>{props.title} (등록일자: {props.regDate})</h1>
        </div>
    );
};

Title.defaultProps = {
    title: "임시 제목", 
    regDate: "임시 날짜"
};

export default Title;