import { useState, useMemo } from 'react';

export default function Ex06UseMemo() {
  const [sortOrder, setSortOrder] = useState('asc');
  const [query, setQuery] = useState('');

  // 샘플 데이터
  const items = [
    { id: 1, name: 'Apple MacBook Pro' },
    { id: 2, name: 'Samsung Galaxy' },
    { id: 3, name: 'iPad Air' },
    { id: 4, name: 'Apple Watch' },
    { id: 5, name: 'AirPods Pro' },
  ];

  // 비용이 큰 계산을 메모이제이션
  const filteredAndSortedItems = useMemo(() => {
    console.log('🔥 필터링 및 정렬 실행 중...'); // 재계산될 때만 실행
    
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [items, query, sortOrder]); // 의존성 배열

  // 복잡한 계산 예제
  const statistics = useMemo(() => {
    console.log('📊 통계 계산 중...');
    return {
      total: items.length,
      filtered: filteredAndSortedItems.length,
      percentage: items.length > 0 ? 
        ((filteredAndSortedItems.length / items.length) * 100).toFixed(1) : '0'
    };
  }, [items.length, filteredAndSortedItems.length]);

  return (
    <div>
      <h3>Ex06 - useMemo 예제</h3>
      
      <div>
        <input 
          type="text"
          placeholder="검색어 입력..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div>
        <button onClick={() => setSortOrder('asc')}>오름차순</button>
        <button onClick={() => setSortOrder('desc')}>내림차순</button>
      </div>
      
      <div>
        <strong>통계:</strong> {statistics.filtered}/{statistics.total} ({statistics.percentage}%)
      </div>
      
      <ul>
        {filteredAndSortedItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}