// 시간을 출력하는 컴포넌트 만들기
// 새로고침 시 현재 시간이 화면에 나타나도록 하기
// 힌트: new Date().toLocaleTimeString() 활용!

const Clock = () => {
    return (
        <div>
            <h1>현재 시간: {new Date().toLocaleTimeString()}</h1>
        </div>
    );
};

export default Clock;