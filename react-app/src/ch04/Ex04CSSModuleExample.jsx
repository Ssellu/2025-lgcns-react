// CSS Modules 예제
import styles from './Ex04CSSModuleExample.module.css';

function Ex04CSSModuleExample() {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>CSS Modules 예제</h3>
            <p className={styles.description}>
                CSS Modules를 사용하면 클래스명 충돌 없이 
                컴포넌트별로 독립적인 스타일을 적용할 수 있습니다.
            </p>
            <button className={styles.button}>
                모듈 스타일 버튼
            </button>
        </div>
    );
}

export default Ex04CSSModuleExample;