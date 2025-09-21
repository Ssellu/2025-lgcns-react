import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('타이머 시작');
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      console.log('타이머 정리');
      clearInterval(timer);
    };
  }, []);

  return <p>타이머: {seconds}초</p>;
}

function Ex03Cleanup() {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div>
      <h3>클린업 예제</h3>
      <button onClick={() => setShowTimer(!showTimer)}>
        {showTimer ? '타이머 숨기기' : '타이머 보이기'}
      </button>
      {showTimer && <Timer />}
    </div>
  );
}

export default Ex03Cleanup;