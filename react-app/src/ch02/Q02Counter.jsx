// Counter App을 완성하세요!
const Counter = () => {

    const handleIncrement = () => {
        console.log("Increment button clicked"); {/* TODO 수정 */}
    }
    const handleDecrement = () => {
        console.log("Decrement button clicked"); {/* TODO 수정 */}
    }

    return <>
        <h2>My Counter</h2>
        <p>Current Number: 0</p> {/* TODO 수정 */}
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
    </>;
};
export default Counter;