import { useState, useCallback, memo } from 'react';

// 자식 컴포넌트 - React.memo로 래핑
const ChildButton = memo(({ label, onClick }) => {
  console.log(`${label} 렌더링됨`);
  return <button onClick={onClick}>{label}</button>;
});

export default function Ex07UseCallback() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [otherValue, setOtherValue] = useState(0);

  // ❌ useCallback 없음 (매번 새 함수 생성)
  const handleClick1 = () => {
    setCount1(count1 + 1);
  };

  // ✅ useCallback 사용 (함수 메모이제이션)
  const handleClick2 = useCallback(() => {
    setCount2(prev => prev + 1);
  }, []);

  return (
    <div>
      <h3>useCallback 예제</h3>
      
      <div>
        <p>다른 값: {otherValue}</p>
        <button onClick={() => setOtherValue(prev => prev + 1)}>
          다른 값 변경
        </button>
      </div>

      <div>
        <h4>❌ useCallback 없음</h4>
        <p>Count1: {count1}</p>
        <ChildButton label="Count1 증가" onClick={handleClick1} />
      </div>

      <div>
        <h4>✅ useCallback 사용</h4>
        <p>Count2: {count2}</p>
        <ChildButton label="Count2 증가" onClick={handleClick2} />
      </div>
    </div>
  );
}