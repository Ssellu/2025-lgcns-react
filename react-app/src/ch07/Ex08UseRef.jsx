import { useRef, useEffect, useState } from 'react';

export default function Ex08UseRef() {
  const inputRef = useRef(null);
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  // DOM 조작
  const focusInput = () => {
    inputRef.current.focus();
  };

  // 값 유지 (렌더링 사이에 값 보존)
  useEffect(() => {
    countRef.current += 1;
    console.log(`렌더링 횟수: ${countRef.current}`);
  });

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Input에 포커스</button>
      
      <div>렌더링 횟수: {countRef.current}</div>
      <button onClick={() => setRenderCount(renderCount + 1)}>
        리렌더링 트리거
      </button>
    </div>
  );
};