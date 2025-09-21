import { useState, useEffect } from 'react';

// 프로덕션 고려사항 및 최적화 예제
function Ex08Production() {
    const [serverInfo, setServerInfo] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState([]);
    const [errorLogs, setErrorLogs] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('확인중...');
    const [optimizationTests, setOptimizationTests] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorLogIdCounter, setErrorLogIdCounter] = useState(1);

    const API_BASE = 'http://localhost:3000';

    // 성능 메트릭 측정
    const measurePerformance = async (operation, apiCall) => {
        const startTime = performance.now();
        const startMemory = performance.memory?.usedJSHeapSize || 0;
        
        try {
            const result = await apiCall();
            const endTime = performance.now();
            const endMemory = performance.memory?.usedJSHeapSize || 0;
            
            const metric = {
                operation,
                responseTime: Math.round(endTime - startTime),
                memoryUsed: endMemory - startMemory,
                success: true,
                timestamp: new Date().toLocaleTimeString(),
                dataSize: JSON.stringify(result).length
            };
            
            setPerformanceMetrics(prev => [...prev, metric].slice(-10));
            return result;
            
        } catch (error) {
            const endTime = performance.now();
            const metric = {
                operation,
                responseTime: Math.round(endTime - startTime),
                success: false,
                error: error.message,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setPerformanceMetrics(prev => [...prev, metric].slice(-10));
            const uniqueErrorId = `${Date.now()}-${errorLogIdCounter}`;
            setErrorLogIdCounter(prev => prev + 1);
            setErrorLogs(prev => [...prev, {
                id: uniqueErrorId,
                operation,
                error: error.message,
                timestamp: new Date().toLocaleString(),
                stack: error.stack
            }].slice(-5));
            
            throw error;
        }
    };

    // 서버 상태 확인
    const checkServerHealth = async () => {
        try {
            const response = await fetch(`${API_BASE}/db`);
            const data = await response.json();
            
            const info = {
                status: 'healthy',
                totalUsers: data.users?.length || 0,
                totalPosts: data.posts?.length || 0,
                totalComments: data.comments?.length || 0,
                serverTime: new Date().toISOString(),
                version: '1.0.0'
            };
            
            setServerInfo(info);
            setConnectionStatus('✅ 연결됨');
            
        } catch (error) {
            setServerInfo(null);
            setConnectionStatus('❌ 연결 실패');
        }
    };

    // 대량 데이터 처리 테스트
    const testBulkOperations = async () => {
        setLoading(true);
        try {
            // 대량 조회 (페이지네이션)
            const bulkRead = await measurePerformance('대량 조회 (100개)', async () => {
                const response = await fetch(`${API_BASE}/posts?_limit=100`);
                return response.json();
            });
            
            setOptimizationTests(prev => ({
                ...prev,
                bulkRead: `성공: ${bulkRead.length}개 항목 조회`
            }));
            
        } catch (error) {
            setOptimizationTests(prev => ({
                ...prev,
                bulkRead: `실패: ${error.message}`
            }));
        } finally {
            setLoading(false);
        }
    };

    // 캐싱 시뮬레이션
    const testCaching = async () => {
        const cacheKey = 'users-list';
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const data = JSON.parse(cached);
            const cacheTime = new Date(data.timestamp);
            const now = new Date();
            const ageMinutes = (now - cacheTime) / 1000 / 60;
            
            if (ageMinutes < 5) { // 5분 캐시
                setOptimizationTests(prev => ({
                    ...prev,
                    caching: `캐시 히트: ${Math.round(ageMinutes * 10) / 10}분 전 데이터 사용`
                }));
                return;
            }
        }
        
        // 캐시 미스 - 서버에서 데이터 가져오기
        const result = await measurePerformance('캐싱 테스트', async () => {
            const response = await fetch(`${API_BASE}/users`);
            const data = await response.json();
            
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: new Date().toISOString()
            }));
            
            return data;
        });
        
        setOptimizationTests(prev => ({
            ...prev,
            caching: `캐시 미스: 새 데이터 ${result.length}개 캐시됨`
        }));
    };

    // 에러 처리 및 재시도 로직
    const testErrorHandling = async () => {
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
            try {
                attempt++;
                
                // 의도적으로 에러를 발생시키는 잘못된 요청
                const result = await measurePerformance(`에러 처리 테스트 (${attempt}/${maxRetries})`, async () => {
                    if (attempt < 3) {
                        // 처음 두 번은 실패하도록
                        throw new Error(`시뮬레이션된 네트워크 오류 (시도 ${attempt})`);
                    }
                    
                    const response = await fetch(`${API_BASE}/users/1`);
                    return response.json();
                });
                
                setOptimizationTests(prev => ({
                    ...prev,
                    errorHandling: `성공: ${attempt}번째 시도에서 성공`
                }));
                break;
                
            } catch (error) {
                if (attempt === maxRetries) {
                    setOptimizationTests(prev => ({
                        ...prev,
                        errorHandling: `실패: ${maxRetries}번 재시도 후 포기`
                    }));
                }
                
                // 재시도 전 대기 (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
            }
        }
    };

    // 데이터 압축 시뮬레이션
    const testDataCompression = async () => {
        const result = await measurePerformance('데이터 압축 테스트', async () => {
            const response = await fetch(`${API_BASE}/posts?_embed=comments`);
            return response.json();
        });
        
        const originalSize = JSON.stringify(result).length;
        const compressedData = result.map(post => ({
            id: post.id,
            title: post.title.substring(0, 50) + '...',
            commentsCount: post.comments?.length || 0
        }));
        const compressedSize = JSON.stringify(compressedData).length;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        setOptimizationTests(prev => ({
            ...prev,
            compression: `${compressionRatio}% 압축 (${originalSize} → ${compressedSize} bytes)`
        }));
    };

    // 컴포넌트 마운트 시 서버 상태 확인
    useEffect(() => {
        checkServerHealth();
        const interval = setInterval(checkServerHealth, 30000); // 30초마다 상태 확인
        return () => clearInterval(interval);
    }, []);

    const productionTests = [
        {
            title: '🏥 서버 상태 확인',
            description: 'API 서버의 건강 상태 및 데이터 개수 확인',
            action: checkServerHealth,
            color: '#4caf50'
        },
        {
            title: '📊 대량 데이터 처리',
            description: '많은 양의 데이터를 효율적으로 처리하는 방법',
            action: testBulkOperations,
            color: '#2196f3'
        },
        {
            title: '💾 캐싱 전략',
            description: 'localStorage를 활용한 클라이언트 사이드 캐싱',
            action: testCaching,
            color: '#ff9800'
        },
        {
            title: '🔄 에러 처리 & 재시도',
            description: '네트워크 오류에 대한 자동 재시도 로직',
            action: testErrorHandling,
            color: '#f44336'
        },
        {
            title: '📦 데이터 압축',
            description: '응답 데이터 크기 최적화 전략',
            action: testDataCompression,
            color: '#9c27b0'
        }
    ];

    return (
        <div style={{ padding: '20px', border: '2px solid #ff5722', borderRadius: '8px', margin: '10px' }}>
            <h3>Ex08 - 프로덕션 고려사항 & 최적화</h3>
            
            {/* 서버 상태 대시보드 */}
            <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '6px',
                marginBottom: '20px'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <h4 style={{ margin: 0 }}>🖥️ 서버 상태 대시보드</h4>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {connectionStatus}
                    </div>
                </div>
                
                {serverInfo ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                                {serverInfo.totalUsers}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>총 사용자</div>
                        </div>
                        
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                                {serverInfo.totalPosts}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>총 포스트</div>
                        </div>
                        
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                                {serverInfo.totalComments}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>총 댓글</div>
                        </div>
                        
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
                                {serverInfo.version}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>API 버전</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>
                        서버 상태를 확인할 수 없습니다
                    </div>
                )}
            </div>

            {/* 최적화 테스트 버튼들 */}
            <div style={{ marginBottom: '20px' }}>
                <h4>🚀 프로덕션 최적화 테스트</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {productionTests.map((test, index) => (
                        <div key={index} style={{ 
                            padding: '12px', 
                            backgroundColor: `${test.color}15`,
                            borderRadius: '6px',
                            border: `1px solid ${test.color}40`
                        }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '8px',
                                color: test.color,
                                fontSize: '14px'
                            }}>
                                {test.title}
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '10px', color: '#666' }}>
                                {test.description}
                            </div>
                            <button
                                onClick={test.action}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: test.color,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                {loading ? '테스트 중...' : '테스트 실행'}
                            </button>
                            
                            {optimizationTests[test.title.replace(/[^\w]/g, '').toLowerCase()] && (
                                <div style={{ 
                                    marginTop: '8px', 
                                    fontSize: '11px', 
                                    padding: '6px',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    borderRadius: '3px',
                                    color: '#333'
                                }}>
                                    결과: {optimizationTests[test.title.replace(/[^\w]/g, '').toLowerCase()]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 성능 메트릭 */}
            {performanceMetrics.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>📈 성능 메트릭</h4>
                    <div style={{ 
                        maxHeight: '200px', 
                        overflowY: 'auto', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead style={{ backgroundColor: '#eeeeee' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>시간</th>
                                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>작업</th>
                                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>응답시간</th>
                                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>데이터 크기</th>
                                    <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceMetrics.slice().reverse().map((metric, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '6px 8px' }}>{metric.timestamp}</td>
                                        <td style={{ padding: '6px 8px' }}>{metric.operation}</td>
                                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                                            {metric.responseTime}ms
                                        </td>
                                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                                            {metric.dataSize ? `${(metric.dataSize / 1024).toFixed(1)}KB` : '-'}
                                        </td>
                                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                            {metric.success ? 
                                                <span style={{ color: '#4caf50' }}>✅</span> : 
                                                <span style={{ color: '#f44336' }}>❌</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 에러 로그 */}
            {errorLogs.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>🚨 에러 로그</h4>
                    <div style={{ 
                        maxHeight: '150px', 
                        overflowY: 'auto', 
                        border: '1px solid #f44336', 
                        borderRadius: '4px',
                        backgroundColor: '#ffebee'
                    }}>
                        {errorLogs.map(error => (
                            <div key={error.id} style={{ 
                                padding: '10px', 
                                borderBottom: '1px solid #ffcdd2',
                                fontSize: '12px'
                            }}>
                                <div style={{ fontWeight: 'bold', color: '#c62828', marginBottom: '4px' }}>
                                    [{error.timestamp}] {error.operation}
                                </div>
                                <div style={{ color: '#666' }}>
                                    {error.error}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: '#ffebe9', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
                <strong>🎯 프로덕션 최적화 학습 포인트:</strong>
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>🏥 헬스 체크:</strong> 서버 상태를 주기적으로 모니터링하여 문제 조기 발견
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>📊 성능 측정:</strong> 응답시간, 메모리 사용량, 데이터 크기 추적
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>💾 캐싱 전략:</strong> 자주 사용되는 데이터를 클라이언트에 캐시하여 성능 향상
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>🔄 에러 복구:</strong> 네트워크 오류 시 자동 재시도 및 exponential backoff
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong>📦 데이터 최적화:</strong> 필요한 데이터만 전송하여 대역폭 절약
                    </div>
                    <div>
                        <strong>📈 모니터링:</strong> 실시간 메트릭 수집으로 성능 병목 지점 식별
                    </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                    💡 실제 프로덕션에서는 CDN, 로드 밸런서, 데이터베이스 최적화, 서버 사이드 캐싱 등 더 다양한 최적화 기법을 적용합니다.
                </div>
            </div>
        </div>
    );
}

export default Ex08Production;