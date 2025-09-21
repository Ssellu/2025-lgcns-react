# 2. props와 state

**[수업 목표]**
- `props`를 사용하여 자식 컴포넌트에게 값을 전달할 수 있습니다.
- `useState`를 사용하여 컴포넌트 내의 값을 제어할 수 있습니다.
- `useState`와 렌더링 방식을 이해합니다.
- `조건부 렌더링`에 대해 이해합니다.

## 1. props

**React 컴포넌트의 데이터 관리 방법**

1. props → 부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터
2. state → 컴포넌트 자체 내부에서 사용하는 데이터
3. context API → 전역적으로 사용하는 데이터
4. Redux → context API와 비슷한 역할의 전역 상태 관리 라이브러리. 보통 좀 더 복잡한 컴포넌트의 관계에서 사용

### props란?

- 뜻 : properties
- **Component 외부에서 Component 내부로** 전달하는 용도의 객체
- 단, props는 외부(부모 컴포넌트)에서 들어오는 데이터이므로, **읽기 전용**이다.

**부모가 자식에게 전달할 때**
```jsx

let 부모가_전달할_값 = 10;

<부모컴포넌트>
    <자식컴포넌트 
        props이름1="props값1"           {/*상수 전달 가능*/}
        props이름2={부모가_전달할_값}>    {/*변수 전달 가능*/}
    </자식컴포넌트>
</부모컴포넌트>
```
**- **자식이 받을 때**
- 방법1. 
```jsx
const 자식컴포넌트 = (props) => {  // `props`: 부모로부터 전달 받은 props 들을 담은 객체
    // 사용할 때는 `props.`으로 각 prop에 접근
    props.props이름1  // "props값1"   
    props.props이름2  // 10
};

```

### props 활용해보기

#### 부모 컴포넌트: Newspaper

```jsx
const Newspaper = () => {

    let title = "금일 날씨 예보";
    let regDate = new Date().toLocaleDateString();
    
    return (
        <>
            <Title title={title} regDate={regDate}/>
        </>
    );
};
```

#### 자식 컴포넌트: Title

```jsx
const Title = (props) => {
    return (
        <div>
            <h1>{props.title} (등록일자: {props.regDate})</h1>
        </div>
    );
};
```
#### 실습: 추가 자식 컴포넌트 Content 구현
```jsx
import Title from './Q01TitleComponent';
import Content from './Q01ContentComponent';
const Newspaper = () => {

    let title = "금일 날씨 예보";
    let content = "오늘 날씨는 기온 섭씨 22도, 습도 20%, 비올 확률 0%로 매우 화장할 것으로 예상됩니다.";
    let regDate = new Date().toLocaleDateString();
    
    return (
        <>
            <Title title={title} regDate={regDate}/>
            <Content content={content}/>  {/* TODO: Content 컴포넌트 구현 */}
        </>
    );
};

export default Newspaper;
```

## **props 비구조화 할당**
Javascript의 비구조화 할당 개념을 활용하면 `props.` 대신 prop 이름으로 접근이 가능하다.
```jsx
const Title = ({title, regDate}) => {  // `props` => `{title, regDate}`
    return (
        <div>
            {/* props.title, props.regDate => title, regDate */}
            <h1>{title} (등록일자: {regDate})</h1>  
        </div>
    );
};

export default Title;
```

## **defaultProps**
외부로부터 `props`가 설정되지 않을 것을 대비해 기본 `props`를 설정할 수 있다.

```jsx
const Title = (props) => {
    return (
        <div>
            <h1>{props.title} (등록일자: {props.regDate})</h1>
        </div>
    );
};

// 이 부분!
Title.defaultProps = {
    title: "임시 제목", 
    regDate: "임시 날짜"
};

export default Title;
```

## **props.children**
- React에서 컴포넌트의 여는 태그와 닫는 태그 사이에 위치한 모든 내용을 의미하는 특별한 props
- 부모 컴포넌트가 자식 컴포넌트를 사용할 때, 그 태그 내부에 작성한 요소들이 자동으로 props.children으로 전달됨
- 템플릿을 만들 때 활용됨
### 주요 특징
1. 컴포넌트 합성: 
    - 어떤 컴포넌트에서, 내부에 들어올 자식 요소가 미리 정해져 있지 않거나, 다양하게 확장성을 가지길 원할 때 사용
2. 레이아웃, 박스 컴포넌트 제작에 필수: 
    - 재사용 가능한 Wrapper, Layout, Modal, Card 등 범용적인 컴포넌트에서 내용 구조를 유연하게 전달받아 표시할 때 사용
3. 여러 타입 허용:
    - 문자열, 숫자, JSX(React element), 배열 등 대부분의 타입 전달 가능
- 예시: 
    ```jsx
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
    ```
    ```jsx
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

    ```
# 2. state

## **state(useState Hooks)란?**
- `React Hooks`의 한 종류
- 컴포넌트 내부에서만 사용할 정보라면 state 활용
- 사용 방법
    1. `useState`를 import 한다. 
        
        ```jsx
        import React, { useState } from 'react';
        ```
        
    2. 컴포넌트 내부에 state를 생성한다.
    
        ```jsx
        // State 객체 생성: useState()
        const [GETTER, SETTER] = useState(DEFAULT_VALUE)
        ```
        
        - `GETTER` : state 이름
        - `SETTER` : state 값을  변경할 때 사용할 함수의 이름
        - `DEFAULT_VALUE` : state의 초기값
    1. 값을 변경할 시점에는 `SETTER()` 를, 값을 표기할 부분에는 `GETTER` 를 활용한다.
    
        ```jsx
        return (
            <div>
                <input 
                    onChange={(e) => SETTER(e.target.value)}
                />
                <p>입력한 글: {GETTER}</p>
            </div>
        );
        ```
    

## **실습: Counter 컴포넌트 만들기**

- `+`, `-` 버튼을 사용하여 숫자를 증가/감소하는 페이지 구현
    ```jsx
    // Counter App을 완성하세요!
    const Counter = () => {

        const handleIncrement = () => {
            console.log("Increment button clicked"); {/* TODO 수정 */}
        }
        const handleDecrement = () => {
            console.log("Decrement button clicked"); {/* TODO 수정 */}
        }

        return <>
            <h2>My Counter</h2>
            <p>Current Number: 0</p> {/* TODO 수정 */}
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
        </>;
    };
    export default Counter;
    ```
    

## 주의! 이전 값을 참조해야 하는 `setState` 라면..

- `setNumber(number + 1);` 의 경우와 같이, 만약 setState를 할 때 기존 state 값을 활용해야 한다면 `setNumber(prev => prev + 1);` 과 같이 `함수`를 인자로 전달하는 것이 안전하다!
- 핸들러(이벤트 처리 등) 종료 → state 업데이트 → (브라우저의 event queue) → 가상돔 생성 → 실제 DOM 반영·리렌더링 순으로 라이프사이클이 진행되기 때문에 핸들러 함수가 진행되는 시점에는 state가 변경되지 않는다.
    
    ```jsx
    import { useState } from "react";
    
    const Counter = () => {
    
        const [number, setNumber] = useState(100);
    
        const handleIncrement = () => {
            console.log("Increment button clicked");
            // setNumber(number + 1);
            // setNumber(number + 1);
            // setNumber(number + 1);  // 3 증가가 되지 않는다 (여전히 1씩만 증가 됨)
            setNumber(prevNumber => prevNumber + 1);
            setNumber(prevNumber => prevNumber + 1);
            setNumber(prevNumber => prevNumber + 1);
        }
        const handleDecrement = () => {
            console.log("Decrement button clicked");
            // setNumber(number - 1);
            // setNumber(number - 1);
            // setNumber(number - 1);
            setNumber(prevNumber => prevNumber - 1);
            setNumber(prevNumber => prevNumber - 1);
            setNumber(prevNumber => prevNumber - 1);
        }
    
        return <>
            <h2>My Counter</h2>
            <p>Current Number: {number}</p>
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
        </>;
    };
    export default Counter;
    ```

## **Object를 state로 관리해야 하는 경우**

```jsx
// state가 Object
const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
}); 

// 이 경우에는 setState를 다음과 같이 해야 함 (내부 값 변경이 아닌 새 객체 생성 방식으로)
const someHandler() => {

    // user.age = 10; // (X) 
    setUser({...user, age:10}); // (O)
    setUser(prev => ({...prev, age:prev.age+1})); // (O)
}
```

```jsx
import React, { useState } from "react";

function UserInput() {
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
            name = "username"
            value={username}
          />
        </li>
        <li>
          <input
            type="text"
            placeholder="Put your nickname."
            onChange={onChange}
            name = "nickname"
            value={nickname}
          />
        </li>
        <li>
          <input
            type="email"
            placeholder="Put your email."
            onChange={onChange}
            name = "email"
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

```

## **state 실습**
[Red], [Green], [Blue] 버튼을 3개 만들고,  
버튼 클릭 시 컴포넌트(App)의 background가 각 색상으로 변경되는 페이지 구현

```jsx

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

```

# **3. 조건부렌더링**

## **조건부 렌더링이란?**

- 특정 조건에 따라 다른 결과물을 렌더링
- 삼항연산자 대신 사용
- 삼항연산자
    - `조건식` ? `true일 때 반환값` : `false일 때 반환값`
    - **둘 중 하나**를 렌더링 해야 할 때
- 조건부렌더링
    - 논리AND 연산의 특징을 활용
        - 첫 번째 항의 값이 true면 두 번째 항을 호출하여 값 확인을 하나,
        - 첫 번째 항의 값이 false면 두 번째 항은 확인하지 않은 채 연산을 종료함.
    - `조건식` && `true일 때 반환값`
    - 렌더링 **하거나, 하지 않아야** 할 때
- `삼항연산자`, `&&` 는 js, jsx 에서 모두 사용 가능

## **조건부 렌더링 실습**

```jsx
import React from "react";
function Hello(props) {
  return (
    <h2>
      안녕하세요, {props.username}{" "}
      {props.isVip && <span style={{ color: "red" }}>VIP</span>}회원님!  {/*이 부분*/}
    </h2>
  );
}
Hello.defaultProps = {
  username: "익명",
  isVip: false,
};
export default Hello;

```
