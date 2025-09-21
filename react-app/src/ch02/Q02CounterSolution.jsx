// Counter App을 완성하세요!
import { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
    }
    const handleDecrement = () => {
        setCount(count - 1);
    }

    return <>
        <h2>My Counter</h2>
        <p>Current Number: {count}</p> {/* TODO 수정 */}
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
    </>;
};
export default Counter;