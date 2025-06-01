import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import imageCat from '../assets/image/hainguoi.jpg'
import backgroundMusic from '../assets/music/123_em_yeu_anh2.mp3';

// In the MessageCard.js file, update the CardContainer styled component:

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* Nền mờ */
  z-index: 1000;
`;

const ImageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column; /* Xếp ảnh và nút theo chiều dọc */
  justify-content: center;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;

  img {
    width: 72vw; /* Ảnh chiếm 60% chiều rộng màn hình */
    max-height: 72vh; /* Không vượt quá 60% chiều cao màn hình */
    object-fit: contain; /* Đảm bảo ảnh không bị méo */
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(255, 165, 0, 0.8);
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
  }

  .close-btn {
    background: red;
    color: white;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .next-btn {
    background: #ff69b4;
    color: white;
    margin-top: 10px; /* Tạo khoảng cách giữa ảnh và nút */
  }
`;

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 35px;
  max-width: 550px;
  width: 90%;
  box-shadow: 
    0 10px 30px rgba(255, 105, 180, 0.3),
    0 0 20px rgba(255, 182, 193, 0.2),
    inset 0 0 10px rgba(255, 255, 255, 0.5);
  margin-top: 20px;
  margin-bottom: ${props => props.marginBottom ? '30px' : '0'};
  z-index: 10;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(to right, #ff69b4, #ffb6c1, #ff69b4);
    animation: shimmer 3s infinite linear;
    background-size: 200% 100%;
  }
  
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,182,193,0.8) 0%, rgba(255,182,193,0) 70%);
    border-radius: 50%;
    opacity: 0.6;
    filter: blur(10px);
  }
`;

const MessageWrapper = styled(motion.div)`
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled(motion.p)`
  font-size: 1.6rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 25px;
  font-family: 'MyCustomFont', sans-serif;
  text-align: center;
  position: relative;
  
  &:first-letter {
    font-size: 1.8rem;
    font-weight: bold;
    color: #ff69b4;
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,105,180,0.5), transparent);
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 
    0 4px 15px rgba(255, 105, 180, 0.4),
    0 0 0 3px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

const HeartIcon = styled(motion.span)`
  display: inline-block;
  margin-left: 10px;
  font-size: 1.2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 105, 180, 0.2);
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(to right, #ff69b4, #ffb6c1);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const FloatingHeart = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  opacity: 0;
  user-select: none;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CustomHeart = ({ color }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16 28C16 28 3 20.5 3 11.5C3 7.5 6 4.5 10 4.5C12.5 4.5 14.5 5.5 16 7.5C17.5 5.5 19.5 4.5 22 4.5C26 4.5 29 7.5 29 11.5C29 20.5 16 28 16 28Z"
            fill={color}
            stroke="white"
            strokeWidth="1"
        />
    </svg>
);

const messages = [
    "Anh không dám hứa yêu em một đời rực rỡ, nhưng sẽ bên em cả đời bình yên.",
    "Gửi tới tình yêu của cuộc đời anh",
    // "Chúc mừng ngày Quốc tế phụ nữ, em Trinh đáng yêu. ",
    // "Cảm ơn Bé yêu vì đã mang lại ánh sáng và tình yêu thương cho cuộc sống của anh.",
    // "Chúc mừng ngày 8/3 của em",
    "Bên canh trọn đời nhé 💗"
    // "Cảm ơn mọi người vì luôn là những bông hoa đẹp nhất, mang đến sự ấm áp và yêu thương cho gia đình.",
    // "Chúc mọi người luôn khỏe mạnh, vui vẻ, luôn xinh đẹp !",
    // "Hãy luôn rạng rỡ và hạnh phúc như chính những gì mọi người xứng đáng nhận được."
    // "Vào ngày đặc biệt này, anh muốn em biết em có ý nghĩa như thế nào đối với anh.",
    // "Em không chỉ là bạn gái của anh, em là bạn thân nhất của anh, là người bạn tâm giao và là tất cả của anh.",
    // "Anh trân trọng từng khoảnh khắc chúng ta bên nhau, và anh mong muốn tạo ra nhiều kỷ niệm đẹp hơn nữa.",
    // "Chúc mừng Ngày Phụ nữ, tình yêu của anh! Em xứng đáng có được tất cả hạnh phúc trên thế giới này."
];

// Then update the MessageCard component to accept and pass the prop:

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const HeartRow = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: space-around;
  align-items: center;
`;

const FinalMessage = styled(motion.div)`
  font-size: 4rem;
  color: white;
  font-family: 'MyCustomFont', sans-serif;
  text-shadow: 0 0 20px #ff69b4, 0 0 30px #ff69b4;
  z-index: 1001;
  position: absolute;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 30px 50px;
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(255, 105, 180, 0.8);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    font-size: 3rem;
    padding: 20px 30px;
  }
`;

const MessageDecoration = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
  overflow: hidden;
`;

const FallingText = styled(motion.div)`
  position: absolute;
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  font-family: 'MyCustomFont', sans-serif;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
  user-select: none;
  pointer-events: none;
  filter: blur(${props => props.blur}px);
  opacity: ${props => props.opacity};
`;

const AudioPlayer = styled.audio`
  display: none; /* Ẩn hoàn toàn thanh audio */
`;

const MessageCard = ({ marginBottom }) => {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [floatingHearts, setFloatingHearts] = useState([]);
    const [showFinalEffect, setShowFinalEffect] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [fallingTexts, setFallingTexts] = useState([]);
    const audioRef = useRef(null);
    const [isFirstClick, setIsFirstClick] = useState(true);

    const playBackgroundMusic = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play();
            
            // Xử lý khi nhạc kết thúc
            audioRef.current.onended = () => {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            };
        }
    };

    const nextMessage = () => {
        // Phát nhạc khi ấn nút Next Message đầu tiên
        if (isFirstClick) {
            playBackgroundMusic();
            setIsFirstClick(false);
        }

        // If we're on the last message and click "Finish"
        if (currentMessage === messages.length - 1) {
            setShowImage(true);
            return;
        }

        if (currentMessage === messages.length - 1) {
            setShowFinalEffect(true);
            return;
        }

        // Create floating hearts effect when button is clicked
        const heartColors = ['#ff69b4', '#ffb6c1', '#ff1493', '#db7093', '#ffc0cb'];
        const newHearts = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 30 + 60,
            size: Math.random() * 20 + 15,
            rotation: Math.random() * 30 - 15,
            color: heartColors[Math.floor(Math.random() * heartColors.length)]
        }));

        setFloatingHearts(prev => [...prev, ...newHearts]);

        // Remove hearts after animation
        setTimeout(() => {
            setFloatingHearts(prev => prev.filter(heart => !newHearts.includes(heart)));
        }, 2000);

        setCurrentMessage((prev) => (prev + 1) % messages.length);
    };

    // Calculate progress percentage
    const progress = ((currentMessage + 1) / messages.length) * 100;

    // Generate heart rows for the final effect
    const heartRows = Array.from({ length: 15 }).map((_, rowIndex) => {
        return (
            <HeartRow
                key={rowIndex}
                initial={{ x: rowIndex % 2 === 0 ? -1000 : 1000, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    delay: rowIndex * 0.1,
                    ease: "easeOut"
                }}
            >
                {Array.from({ length: 10 }).map((_, colIndex) => {
                    const heartColors = ['#ff69b4', '#ffb6c1', '#ff1493', '#db7093', '#ffc0cb'];
                    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
                    const size = Math.random() * 15 + 25;

                    return (
                        <div key={colIndex} style={{ width: size, height: size }}>
                            <CustomHeart color={color} />
                        </div>
                    );
                })}
            </HeartRow>
        );
    });

    useEffect(() => {
        if (showFinalEffect) {
            const createFallingText = () => {
                const colors = [
                    'rgba(255, 105, 180, 0.8)',  // Hot pink
                    'rgba(255, 182, 193, 0.8)',  // Light pink
                    'rgba(255, 20, 147, 0.8)',   // Deep pink
                    'rgba(219, 112, 147, 0.8)',  // Pale violet red
                    'rgba(255, 192, 203, 0.8)'   // Pink
                ];
                const newText = {
                    id: Date.now(),
                    x: Math.random() * 100,
                    size: Math.random() * 15 + 25, // Kích thước nhỏ hơn và đồng đều hơn
                    color: colors[Math.floor(Math.random() * colors.length)],
                    duration: Math.random() * 8 + 12, // Thời gian rơi lâu hơn
                    delay: Math.random() * 3,
                    blur: Math.random() * 0.5, // Thêm hiệu ứng mờ nhẹ
                    opacity: Math.random() * 0.3 + 0.7, // Độ trong suốt khác nhau
                    sway: Math.random() * 100 - 50 // Độ lắc ngang
                };
                setFallingTexts(prev => [...prev, newText]);
            };

            // Tạo text mới mỗi 800ms (chậm hơn để không quá dày)
            const interval = setInterval(createFallingText, 800);
            
            // Xóa text sau khi rơi xong
            const cleanup = setInterval(() => {
                setFallingTexts(prev => prev.filter(text => 
                    Date.now() - text.id < text.duration * 1000
                ));
            }, 1000);

            return () => {
                clearInterval(interval);
                clearInterval(cleanup);
            };
        }
    }, [showFinalEffect]);

    return (
        <>
            <AudioPlayer
                ref={audioRef}
                src={backgroundMusic}
                loop={false}
                preload="auto"
            />
            
            <CardContainer
                marginBottom={marginBottom}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <AnimatePresence mode="wait">
                    <MessageWrapper
                        key={currentMessage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Message
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: 0.2,
                                    staggerChildren: 0.1
                                }
                            }}
                        >
                            {messages[currentMessage]}
                        </Message>
                    </MessageWrapper>
                </AnimatePresence>

                <ButtonContainer>
                    <Button
                        onClick={nextMessage}
                        whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(255, 105, 180, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {currentMessage === messages.length - 1 ? 'Finish' : 'Next Message'}
                        <HeartIcon
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <CustomHeart color="#fff" />
                        </HeartIcon>
                    </Button>
                </ButtonContainer>

                <ProgressBar>
                    <Progress progress={progress} />
                </ProgressBar>

                {floatingHearts.map(heart => (
                    <FloatingHeart
                        key={heart.id}
                        size={heart.size}
                        style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
                        initial={{ opacity: 0, y: 0, rotate: heart.rotation }}
                        animate={{
                            opacity: [0, 1, 0],
                            y: -100,
                            rotate: heart.rotation
                        }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <CustomHeart color={heart.color || '#ff69b4'} />
                    </FloatingHeart>
                ))}
            </CardContainer>

            {showImage && ( // ✅ Nếu đã ấn Next sau -2, mới hiện ảnh
              <Overlay>
                <ImageContainer
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <img src={imageCat} alt="Cute Cat" />
                  <button className="next-btn" onClick={() => setShowFinalEffect(true)}>Next</button>
                </ImageContainer>
              </Overlay>
            )}

            {showFinalEffect && (
                <FullscreenOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {heartRows}

                    <MessageDecoration>
                        {fallingTexts.map(text => (
                            <FallingText
                                key={text.id}
                                color={text.color}
                                size={text.size}
                                blur={text.blur}
                                opacity={text.opacity}
                                style={{ left: `${text.x}%` }}
                                initial={{ 
                                    y: -50, 
                                    opacity: 0,
                                    x: 0
                                }}
                                animate={{ 
                                    y: '100vh',
                                    opacity: [0, text.opacity, text.opacity, 0],
                                    x: [0, text.sway, -text.sway, 0],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: text.duration,
                                    delay: text.delay,
                                    ease: "easeInOut",
                                    times: [0, 0.1, 0.9, 1]
                                }}
                            >
                                 Quân ❤️ Mai Phương
                            </FallingText>
                        ))}
                    </MessageDecoration>

                    <FinalMessage
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                    >
                        <motion.div
                            animate={{
                                textShadow: [
                                    "0 0 20px #ff69b4, 0 0 30px #ff69b4",
                                    "0 0 40px #ff69b4, 0 0 60px #ff69b4",
                                    "0 0 20px #ff69b4, 0 0 30px #ff69b4"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            Quân ❤️ Mai Phương
                        </motion.div>
                    </FinalMessage>
                </FullscreenOverlay>
            )}
        </>
    );
};

export default MessageCard;