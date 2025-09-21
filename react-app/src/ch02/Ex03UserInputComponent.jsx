import React, { useState } from "react";
const UserInput = () => {
    const [userInfos, setUserInfos] = useState({
        username: "",
        nickname: "",
        email: ""
    });

    const { username, nickname, email } = userInfos;

    const onChange = (e) => {
        const { name, value } = e.target;
        setUserInfos({
            ...userInfos,
            [name]: value
        });
    };

    const onReset = () => {
        setUserInfos({
            username: "",
            nickname: "",
            email: ""
        });
    };

    const style = {
        listStyleType: "none",
        paddingLeft: 0,
    };

    return (
        <>
            <ul style={style}>
                <li>
                    <input
                        type="text"
                        placeholder="Put your name."
                        onChange={onChange}
                        name="username"
                        value={username}
                    />
                </li>
                <li>
                    <input
                        type="text"
                        placeholder="Put your nickname."
                        onChange={onChange}
                        name="nickname"
                        value={nickname}
                    />
                </li>
                <li>
                    <input
                        type="email"
                        placeholder="Put your email."
                        onChange={onChange}
                        name="email"
                        value={email}
                    />
                </li>
            </ul>
            <button onClick={onReset}>초기화</button>
            <div>
                <p>이름 : {username}</p>
                <p>닉네임 : {nickname}</p>
                <p>이메일 : {email}</p>
            </div>
        </>
    );
}

export default UserInput;
