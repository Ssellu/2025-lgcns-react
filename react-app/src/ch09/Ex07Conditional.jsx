import { useState, useEffect } from 'react';

function Ex07Conditional() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!shouldFetch) return;

    console.log('조건부 Effect 실행');
    
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [shouldFetch]);

  return (
    <div>
      <h3>조건부 Effect 예제</h3>
      <button onClick={() => setShouldFetch(!shouldFetch)}>
        {shouldFetch ? '데이터 가져오기 중지' : '데이터 가져오기 시작'}
      </button>
      {data && (
        <div>
          <h4>{data.title}</h4>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  );
}

export default Ex07Conditional;