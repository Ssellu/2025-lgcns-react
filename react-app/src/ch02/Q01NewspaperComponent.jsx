import Title from './Q01TitleComponent';
import Content from './Q01ContentComponent';
const Newspaper = () => {

    let title = "금일 날씨 예보";
    let content = "오늘 날씨는 기온 섭씨 22도, 습도 20%, 비올 확률 0%로 매우 화장할 것으로 예상됩니다.";
    let regDate = new Date().toLocaleDateString();
    
    return (
        <>
            <Title title={title} regDate={regDate}/>
            <Content content={content}/>
        </>
    );
};

export default Newspaper;