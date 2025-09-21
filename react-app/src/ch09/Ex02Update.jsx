import { useState, useEffect } from 'react';

function Ex02Update() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('컴포넌트가 업데이트됨');
  }); // 의존성 배열 없음 = 매번 실행

  return (
    <div>
      <h3>업데이트 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

export default Ex02Update;