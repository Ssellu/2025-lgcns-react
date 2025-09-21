import { useState, useEffect } from 'react';

function Ex06EventListener() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    console.log('이벤트 리스너 추가');

    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('이벤트 리스너 정리');
    };
  }, []);

  return (
    <div>
      <h3>이벤트 리스너 예제</h3>
      <p>현재 창 너비: {windowWidth}px</p>
      <p>창 크기를 조절해 보세요!</p>
    </div>
  );
}

export default Ex06EventListener;