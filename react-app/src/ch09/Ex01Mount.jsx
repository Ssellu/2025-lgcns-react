import { useState, useEffect } from 'react';

function Ex01Mount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('컴포넌트가 마운트됨');
  }, []); // 빈 배열 = 마운트 시에만

  return (
    <div>
      <h3>마운트 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

export default Ex01Mount;