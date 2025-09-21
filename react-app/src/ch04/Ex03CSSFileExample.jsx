// CSS 파일을 사용하는 예제 (CSS 파일은 별도로 생성 필요)
import './Ex03CSSFileExample.css';

function Ex03CSSFileExample() {
    return (
        <div className="card-container">
            <h3 className="card-title">CSS 파일 예제</h3>
            <p className="card-content">
                외부 CSS 파일을 사용한 스타일링 예제입니다.
                hover 효과도 쉽게 적용할 수 있습니다.
            </p>
            <button className="primary-button">
                클릭해보세요
            </button>
        </div>
    );
}

export default Ex03CSSFileExample;