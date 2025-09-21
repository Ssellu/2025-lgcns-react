import { useState, useEffect } from 'react';

function Ex04Dependency() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('count가 변경됨:', count);
  }, [count]); // count가 변경될 때만

  return (
    <div>
      <h3>의존성 배열 예제</h3>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
      
      <p>이름: {name}</p>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 입력"
      />
    </div>
  );
}

export default Ex04Dependency;