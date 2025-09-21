# 3. Events

**[수업 목표]**

- React 컴포넌트에서 이벤트 핸들링하는 방법을 이해한다
- `onClick`, `onChange` 등 다양한 이벤트 핸들러를 활용할 수 있다
- 화살표 함수와 일반 함수를 사용한 이벤트 핸들러 작성법을 익힌다
- `useState`를 활용하여 사용자 입력을 상태로 관리할 수 있다
- 폼 유효성 검사를 통해 실용적인 이벤트 핸들링을 구현할 수 있다
- Event Bubbling과 Event Capturing의 개념과 동작 원리를 이해한다
- React에서 이벤트 전파를 제어하는 방법을 학습한다

# **1. 이벤트 핸들링**

**이벤트란?**
- 앱의 외부에서 들어오는 특정한 상호작용 및 상황 
- 예. 클릭되었다. 파일이 로드되었다. 입력 되었다. 10시 30분이 되었다. …
[text](https://ko.react.dev/learn/responding-to-events)


`onClick`, `onHover`, ..., `onXXX` 이벤트를 핸들링해보자.

```jsx
import React from "react";

function Greeting() {
  const alertHello = () => {
    alert("안녕하세요.");
  };
  const alertBye = () => {
    alert("안녕히가세요.");
  };

  // function alertHello() {
  //   alert("안녕하세요.");
  // }
  // function alertBye() {
  //   alert("안녕히가세요.");
  // }

  return (
    <div>
      <button onClick={alertHello}>Hello</button>
      <button onClick={alertBye}>Bye</button>

      <button onClick={() => {alert("안녕하세요.");}}>Hello2</button>
      <button onClick={() => {alert("안녕히가세요.");}}>Bye2</button>
    </div>
  );
}

export default Greeting;

```

## **이벤트 핸들링 실습**

- 사용자에게 이메일을 입력 받고 `유효성 확인`버튼을 누르면 입력 결과가 alert()되는 페이지 구현
```jsx
import { useState } from 'react';

const Email = () => {

    const checkEmail = (inputEmail) => {

        const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (EMAIL_REGEX.test(inputEmail) === true) {
            // 이메일 형식임
            alert("올바른 이메일 형식입니다.");
            /* TODO */
        }
        else {
            alert("올바르지 않은 이메일 형식입니다.");
            /* TODO */
        }
    }
    
    return (
        <div>
            <input 
                type="text" 
                placeholder="이메일을 입력하세요."
                onChange={/* TODO */}/>
            <button onClick={/* TODO */}>유효성 확인</button>
            <p>현재 이메일: {/* TODO */}</p>
        </div>
    );
};

export default Email;
```
    

# 2. Event Capturing와 Bubbling

## 2.1. Event Bubbling

- 이벤트가 **가장 안쪽(이벤트 타겟)에서 시작해서 바깥(조상) 요소로 차례차례 전파**되는 과정
- e, g. **`<div><button>Click</button></div>`** 구조에서, button을 클릭하면 button → div → document 순서로 이벤트가 전파되고 각 단계의 핸들러가 차례로 호출
- 대부분의 React 이벤트 핸들러(onClick 등)는 버블링 단계에서 동작

## 2.2. Event Capturing

- **가장 바깥(상위) 요소에서 시작해서 이벤트 타겟까지 내려오는 과정**
- 버블링의 반대 흐름
- 최상위 조상 → 부모 → ... → 타겟 순서로 이벤트가 전달
- React에서는 `onClickCapture`처럼 'Capture'가 붙은 핸들러 Prop을 사용하면, 캡처 단계에서 먼저 핸들러가 실행

## 2.3. Bubbling과 Capturing의 실행 방법(3단계 구조)

1. **캡처링 단계**: 상위에서 하위로 이벤트 전파(`onClickCapture` 등)
2. **타겟 단계**: 이벤트가 실제로 발생한 요소에서 실행
3. **버블링 단계**: 하위(타겟)에서 상위(조상)로 이벤트 전파(`onClick` 등)

```jsx
const CapturingAndBubbling = () => {
 
    return (
        <div onClickCapture={() => console.log('부모 div의 클릭 캡쳐 이벤트(캡쳐링)')}
             onClick={() => console.log('부모 div의 클릭 이벤트(버블링)')}
             style={{ border: '2px solid black', padding: '20px', display: 'inline-block' }}>
            <button onClick={() => console.log('자식 버튼의 클릭 이벤트(버블링)')}>클릭</button>
        </div>
    );
};

export default CapturingAndBubbling;
```

```
[버튼 클릭 시 Console 결과]
부모 div의 클릭 캡쳐 이벤트(캡쳐링)
자식 버튼의 클릭 이벤트(버블링)
부모 div의 클릭 이벤트(버블링)
```

## 2.4. 이벤트 전파 중단하기 - `e.stopPropagation()`

### **`e.stopPropagation()` 이란?**
- **이벤트의 전파(bubbling 또는 capturing)를 중단**시키는 메서드
- 현재 요소에서 이벤트 핸들러 실행 후, **상위 또는 하위 요소로의 전파를 막음**
- 불필요한 상위 이벤트 핸들러 실행을 방지할 때 유용

### **언제 사용하나요?**
- 자식 요소 클릭 시 부모 요소의 이벤트가 실행되는 것을 막고 싶을 때
- 모달, 드롭다운 등에서 내부 클릭 시 외부 클릭 이벤트가 발생하지 않도록 할 때
- 중첩된 클릭 가능한 요소들에서 원하지 않는 이벤트 실행을 방지할 때

### **기본 예제 - 이벤트 전파가 일어나는 경우**

```jsx
const WithoutStopPropagation = () => {
    return (
        <div 
            onClick={() => alert('부모 div가 클릭되었습니다!')}
            style={{ 
                border: '2px solid blue', 
                padding: '30px', 
                backgroundColor: 'lightblue' 
            }}>
            <p>부모 영역입니다. 클릭해보세요!</p>
            <button onClick={() => alert('버튼이 클릭되었습니다!')}>
                자식 버튼
            </button>
        </div>
    );
};
```

**결과**: 버튼 클릭 시 → "버튼이 클릭되었습니다!" → "부모 div가 클릭되었습니다!" (두 개의 alert 실행)

### **`e.stopPropagation()` 적용 예제**

```jsx
const WithStopPropagation = () => {
    return (
        <div 
            onClick={() => alert('부모 div가 클릭되었습니다!')}
            style={{ 
                border: '2px solid red', 
                padding: '30px', 
                backgroundColor: 'lightcoral' 
            }}>
            <p>부모 영역입니다. 클릭해보세요!</p>
            <button onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 중단!
                alert('버튼이 클릭되었습니다!');
            }}>
                자식 버튼 (전파 중단)
            </button>
        </div>
    );
};
```

**결과**: 버튼 클릭 시 → "버튼이 클릭되었습니다!" (부모 div의 alert 실행되지 않음)

### **실용적인 예제 - 모달창 구현**

```jsx
const ModalExample = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button onClick={openModal}>모달 열기</button>
            
            {isModalOpen && (
                <div 
                    onClick={closeModal} // 배경 클릭 시 모달 닫기
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <div 
                        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 전파 중단
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                        <h3>모달 내용</h3>
                        <p>이 영역을 클릭해도 모달이 닫히지 않습니다.</p>
                        <button onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};
```

### **주의사항**
- `e.stopPropagation()`은 **이벤트 전파만 중단**하며, **기본 동작은 중단하지 않음**
- 기본 동작을 중단하려면 `e.preventDefault()` 사용
- 둘 다 필요하면 `e.stopPropagation()`과 `e.preventDefault()`를 함께 사용하거나 `return false` 활용

## 2.5. 기본 동작 막기 - `e.preventDefault()`

### **`e.preventDefault()` 란?**
- **브라우저의 기본 동작을 중단**시키는 메서드
- 예: 폼 제출, 링크 클릭 시 페이지 이동, 우클릭 메뉴, 체크박스 체크/해제 등
- 이벤트 전파는 그대로 진행되지만, **해당 요소의 기본 기능만 차단**

### **언제 사용하나요?**
- 폼 제출 시 페이지 새로고침을 막고 Ajax로 처리하고 싶을 때
- 링크 클릭 시 페이지 이동을 막고 커스텀 동작을 실행하고 싶을 때
- 드래그 앤 드롭, 키보드 단축키 등 커스텀 기능을 구현할 때
- 우클릭 메뉴를 비활성화하고 싶을 때

### **기본 예제 - 폼 제출 막기**

```jsx
const FormExample = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // preventDefault 없이 - 페이지가 새로고침됨
    const handleSubmitWithoutPrevent = () => {
        console.log('폼이 제출되었습니다:', { name, email });
        // 페이지가 새로고침되어 콘솔 내용이 사라짐
    };

    // preventDefault 적용 - 페이지 새로고침 방지
    const handleSubmitWithPrevent = (e) => {
        e.preventDefault(); // 기본 동작(페이지 새로고침) 방지
        console.log('폼이 제출되었습니다:', { name, email });
        alert(`제출된 정보: ${name}, ${email}`);
        // 페이지가 새로고침되지 않음
    };

    return (
        <div>
            <h3>preventDefault 비교 예제</h3>
            
            {/* 기본 동작이 실행되는 폼 */}
            <form onSubmit={handleSubmitWithoutPrevent}>
                <h4>1. preventDefault 없음 (페이지 새로고침됨)</h4>
                <input 
                    type="text" 
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">제출 (새로고침됨)</button>
            </form>

            <hr />

            {/* 기본 동작이 차단되는 폼 */}
            <form onSubmit={handleSubmitWithPrevent}>
                <h4>2. preventDefault 적용 (새로고침 방지)</h4>
                <input 
                    type="text" 
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">제출 (새로고침 안됨)</button>
            </form>
        </div>
    );
};
```

### **링크 클릭 막기 예제**

```jsx
const LinkExample = () => {
    const handleLinkClick = (e) => {
        e.preventDefault(); // 페이지 이동 방지
        alert('링크 클릭이 감지되었지만 페이지 이동은 막았습니다!');
        // 여기서 커스텀 동작 실행 가능
    };

    return (
        <div>
            <h3>링크 기본 동작 제어</h3>
            <a href="https://google.com">일반 링크 (구글로 이동)</a>
            <br />
            <a href="https://google.com" onClick={handleLinkClick}>
                preventDefault 적용 링크 (이동 안됨)
            </a>
        </div>
    );
};
```

### **키보드 이벤트 제어 예제**

```jsx
const KeyboardExample = () => {
    const [text, setText] = useState('');

    const handleKeyDown = (e) => {
        // 숫자만 입력 허용, 다른 키는 preventDefault
        if (!/[0-9]/.test(e.key) && 
            !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
            e.preventDefault();
            alert('숫자만 입력 가능합니다!');
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault(); // 우클릭 메뉴 방지
        alert('우클릭이 비활성화되어 있습니다!');
    };

    return (
        <div>
            <h3>키보드 이벤트 제어</h3>
            <input 
                type="text"
                placeholder="숫자만 입력 가능"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            
            <div 
                onContextMenu={handleContextMenu}
                style={{ 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    marginTop: '10px',
                    backgroundColor: '#f9f9f9'
                }}>
                이 영역에서 우클릭해보세요! (우클릭 메뉴가 나타나지 않음)
            </div>
        </div>
    );
};
```

### **드래그 앤 드롭 예제**

```jsx
const DragDropExample = () => {
    const [draggedItem, setDraggedItem] = useState('');

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // 드롭을 허용하기 위해 필요
    };

    const handleDrop = (e) => {
        e.preventDefault(); // 기본 동작 방지
        alert(`${draggedItem}이(가) 드롭되었습니다!`);
    };

    return (
        <div>
            <h3>드래그 앤 드롭 예제</h3>
            <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, '파일 A')}
                style={{ 
                    border: '1px solid blue', 
                    padding: '10px', 
                    margin: '10px',
                    backgroundColor: 'lightblue',
                    cursor: 'move'
                }}>
                드래그 가능한 아이템 A
            </div>
            
            <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ 
                    border: '2px dashed #ccc', 
                    padding: '50px', 
                    margin: '10px',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'center'
                }}>
                여기에 드롭하세요
            </div>
        </div>
    );
};
```

### **`stopPropagation()`과 `preventDefault()` 함께 사용**

```jsx
const CombinedExample = () => {
    return (
        <div onClick={() => alert('부모 div 클릭!')}>
            <form onSubmit={() => alert('폼 제출!')}>
                <button 
                    type="submit"
                    onClick={(e) => {
                        e.stopPropagation();  // 부모로의 이벤트 전파 중단
                        e.preventDefault();   // 폼 제출 기본 동작 방지
                        alert('버튼 클릭! (부모 클릭과 폼 제출 모두 방지됨)');
                    }}>
                    두 기능 모두 적용된 버튼
                </button>
            </form>
        </div>
    );
};
```

### **정리 - `stopPropagation()` vs `preventDefault()`**

| 메서드 | 기능 | 사용 목적 |
|--------|------|-----------|
| `e.stopPropagation()` | **이벤트 전파 중단** | 부모/자식 요소로의 이벤트 전파 방지 |
| `e.preventDefault()` | **기본 동작 중단** | 브라우저의 기본 기능(폼 제출, 링크 이동 등) 방지 |
| 함께 사용 | 전파 + 기본 동작 모두 중단 | 완전한 이벤트 제어가 필요할 때 |

