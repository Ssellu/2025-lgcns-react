import { useState, useEffect } from 'react';

export default function Ex01UseEffect() {
  const [count, setCount] = useState(0);

  // 마운트 시에만 실행
  useEffect(() => {
    console.log('컴포넌트 마운트됨');
    return () => {
      console.log('컴포넌트 언마운트됨');
    };
  }, []);

  // count 변경 시마다 실행
  useEffect(() => {
    console.log(`Counter: ${count}`);
  }, [count]);

  // 매 렌더링마다 실행 (의존성 배열 생략)
  useEffect(() => {
    console.log('렌더링 완료');
    return () => {
      console.log('렌더링 종료');
    };
  });

  const increaseCount = () => {
    setCount(prev => prev + 1);
  };

  const decreaseCount = () => {
    setCount(prev => prev - 1);
  };

  return (
    <div>
        <button onClick={increaseCount}>+</button>
        <span> {count} </span>
        <button onClick={decreaseCount}>-</button>
    </div>
  );
}