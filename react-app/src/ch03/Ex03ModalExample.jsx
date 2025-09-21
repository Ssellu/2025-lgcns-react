import { useState } from 'react';

// 실용적인 모달창 구현 예제

function Ex03ModalExample() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button onClick={openModal}>모달 열기</button>
            
            {isModalOpen && (
                <div 
                    onClick={closeModal} // 배경 클릭 시 모달 닫기
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <div 
                        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 전파 중단
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                        <h3>모달 내용</h3>
                        <p>이 영역을 클릭해도 모달이 닫히지 않습니다.</p>
                        <button onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ex03ModalExample;