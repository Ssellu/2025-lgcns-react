import React, { useState } from "react";

const backgroundUpdater = () => {
    const [backgroundColor, setBackgroundColor] = useState("red");

    const style = {
        width: "100vw",
        height: "100vh",
        backgroundColor: backgroundColor,
    };

    const changeColor = (color) => {
        setBackgroundColor(color);
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