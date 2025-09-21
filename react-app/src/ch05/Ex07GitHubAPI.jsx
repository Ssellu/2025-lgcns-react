// Ex07GitHubAPI.jsx - 실제 Public API 활용 (GitHub API)
import { useState } from 'react';

export default function Ex07GitHubAPI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // GitHub 사용자 검색
  const searchGitHubUser = async (username) => {
    if (!username.trim()) {
      alert('GitHub 사용자명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setRepositories([]);

    try {
      console.log(`Searching GitHub user: ${username}`);

      // 1. 사용자 정보 가져오기
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error(`사용자 "${username}"을(를) 찾을 수 없습니다.`);
        } else if (userResponse.status === 403) {
          throw new Error('GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          throw new Error(`GitHub API 오류: ${userResponse.status}`);
        }
      }

      const user = await userResponse.json();
      console.log('User data:', user);
      setUserData(user);

      // 2. 사용자의 저장소 목록 가져오기 (최신 10개)
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&page=1`
      );

      if (reposResponse.ok) {
        const repos = await reposResponse.json();
        console.log('Repositories:', repos);
        setRepositories(repos);
      }

      // 3. 검색 히스토리에 추가
      setSearchHistory(prev => {
        const newHistory = [username, ...prev.filter(item => item !== username)];
        return newHistory.slice(0, 5); // 최근 5개만 유지
      });

    } catch (err) {
      console.error('GitHub API error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    searchGitHubUser(searchQuery);
  };

  // 엔터키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 히스토리에서 검색
  const searchFromHistory = (username) => {
    setSearchQuery(username);
    searchGitHubUser(username);
  };

  // 언어별 컬러 매핑
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      HTML: '#e34c26',
      CSS: '#1572B6'
    };
    return colors[language] || '#6c757d';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h3>Ex07: GitHub API 실제 활용</h3>
      <p>GitHub의 Public API를 사용하여 사용자 정보와 저장소를 검색하는 실용적인 예제입니다.</p>

      {/* 검색 인터페이스 */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 15px 0' }}>🔍 GitHub 사용자 검색</h4>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="GitHub 사용자명을 입력하세요 (예: octocat)"
            style={{ 
              flex: 1,
              padding: '10px', 
              border: '2px solid #dee2e6', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            disabled={loading}
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#6c757d' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              minWidth: '100px'
            }}
          >
            {loading ? '🔍...' : '🔍 검색'}
          </button>
        </div>

        {/* 검색 히스토리 */}
        {searchHistory.length > 0 && (
          <div>
            <small style={{ color: '#6c757d', marginBottom: '8px', display: 'block' }}>
              📚 최근 검색:
            </small>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {searchHistory.map((username, index) => (
                <button
                  key={index}
                  onClick={() => searchFromHistory(username)}
                  disabled={loading}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#e9ecef',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {username}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>⏳</div>
          <div>GitHub에서 사용자 정보를 검색하는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid #f5c6cb',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>❌ 검색 실패</h4>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* 사용자 정보 표시 */}
      {userData && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* 사용자 프로필 헤더 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '20px',
              marginBottom: '15px'
            }}>
              <img 
                src={userData.avatar_url} 
                alt={`${userData.login}'s avatar`}
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%',
                  border: '3px solid #dee2e6'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  {userData.name || userData.login}
                </h2>
                <p style={{ 
                  margin: '0 0 5px 0', 
                  color: '#6c757d', 
                  fontSize: '18px' 
                }}>
                  @{userData.login}
                </p>
                {userData.bio && (
                  <p style={{ margin: '5px 0 10px 0', color: '#333' }}>
                    {userData.bio}
                  </p>
                )}
                {userData.location && (
                  <div style={{ color: '#6c757d', fontSize: '14px' }}>
                    📍 {userData.location}
                  </div>
                )}
                {userData.blog && (
                  <div style={{ color: '#0366d6', fontSize: '14px', marginTop: '5px' }}>
                    🔗 <a href={userData.blog} target="_blank" rel="noopener noreferrer">
                      {userData.blog}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 통계 정보 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '15px',
              marginTop: '15px'
            }}>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  {userData.public_repos}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>저장소</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  {userData.followers}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>팔로워</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  {userData.following}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>팔로잉</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>가입일</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                  {new Date(userData.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 저장소 목록 */}
      {repositories.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '15px' }}>
            📂 최근 저장소 ({repositories.length}개)
          </h4>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {repositories.map(repo => (
              <div key={repo.id} style={{ 
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h5 style={{ margin: 0, color: '#0366d6', fontSize: '16px' }}>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {repo.name}
                    </a>
                    {repo.private && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '12px', 
                        color: '#6c757d',
                        backgroundColor: '#f8f9fa',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        🔒 Private
                      </span>
                    )}
                  </h5>
                  
                  {repo.stargazers_count > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#6c757d', fontSize: '14px' }}>
                      ⭐ {repo.stargazers_count}
                    </div>
                  )}
                </div>

                {repo.description && (
                  <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>
                    {repo.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#6c757d' }}>
                  {repo.language && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: getLanguageColor(repo.language)
                        }}
                      />
                      {repo.language}
                    </div>
                  )}
                  
                  {repo.forks_count > 0 && (
                    <div>🍴 {repo.forks_count}</div>
                  )}
                  
                  <div>
                    📅 업데이트: {new Date(repo.updated_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
        <strong>🌟 GitHub API 활용 포인트:</strong>
        <ul>
          <li><strong>RESTful API:</strong> 표준적인 REST API 구조</li>
          <li><strong>Rate Limiting:</strong> 시간당 요청 제한 (인증 없이 60회)</li>
          <li><strong>Public Data:</strong> 공개 저장소와 프로필 정보만 접근</li>
          <li><strong>CORS 지원:</strong> 브라우저에서 직접 호출 가능</li>
          <li><strong>실시간 데이터:</strong> 실제 GitHub 데이터 활용</li>
        </ul>
      </div>
    </div>
  );
}