const backgroundUpdater = () => {

    const style = {
        width: "100vw",
        height: "100vh",
        backgroundColor: "red", // TODO: 수정하기. NOTE: 배경색상은 "red", "blue", "green"으로 표현 가능
    };

    const changeColor = (color) => {
        console.log(color); // TODO: 수정하기
    };

    return (
        <div style={style}>
            <button onClick={() => { changeColor("red")}}>
                Red
            </button>
            <button onClick={() => { changeColor("green")}}>
                Green
            </button>
            <button onClick={() => { changeColor("blue")}}>
                Blue
            </button>
        </div>
    );
};

export default backgroundUpdater;