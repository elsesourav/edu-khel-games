import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import {
   FaClock,
   FaHome,
   FaPlay,
   FaQuestion,
   FaRedo,
   FaTrophy,
} from "react-icons/fa";
import skyImage from "../../assets/imgs/sky.jpg";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas.jsx";
import { balloonDropQuestions } from "../../data/questions.js";

const balloonColors = [
   { name: "red", color: "#ff4444", points: 10 },
   { name: "blue", color: "#4444ff", points: 15 },
   { name: "green", color: "#44ff44", points: 20 },
   { name: "yellow", color: "#ffff44", points: 25 },
   { name: "purple", color: "#ff44ff", points: 30 },
   { name: "orange", color: "#ff8844", points: 35 },
   { name: "pink", color: "#ff88dd", points: 50 },
];

function Balloon({
   position,
   color,
   points,
   hasQuestion,
   onPop,
   balloonId,
   gameTime,
}) {
   const meshRef = useRef();
   const groupRef = useRef();
   const [isVisible, setIsVisible] = useState(true);
   const [isPopped, setIsPopped] = useState(false);
   const [blastEffect, setBlastEffect] = useState(false);
   const [balloonSize] = useState(() => 0.4 + Math.random() * 0.2);

   useFrame((state, delta) => {
      if (!groupRef.current || !isVisible || isPopped) return;

      const elapsedTime = 60 - (gameTime || 60);
      const speedMultiplier = Math.min(1.5 + elapsedTime * 0.015, 2.5);

      groupRef.current.position.y += delta * speedMultiplier;

      groupRef.current.position.x +=
         Math.sin(state.clock.elapsedTime * 2 + balloonId) * 0.005;

      if (groupRef.current.position.y > 8) {
         setIsVisible(false);
         if (hasQuestion) {
            onPop(balloonId, 0, hasQuestion, true);
         } else {
            onPop(balloonId, 0, hasQuestion, false);
         }
      }
   });

   const handleClick = (event) => {
      event.stopPropagation();
      if (isVisible && !isPopped) {
         setIsPopped(true);
         setBlastEffect(true);

         if (groupRef.current) {
            groupRef.current.scale.set(1.5, 1.5, 1.5);
            setTimeout(() => {
               if (groupRef.current) {
                  groupRef.current.scale.set(0.1, 0.1, 0.1);
               }
            }, 100);
         }
         onPop(balloonId, points, hasQuestion);

         setTimeout(() => setIsVisible(false), 300);
      }
   };

   if (!isVisible) return null;

   return (
      <group ref={groupRef} position={position}>
         <mesh
            onClick={handleClick}
            scale={[1.8 * balloonSize, 1.8 * balloonSize, 1.8 * balloonSize]}
            visible={false}
         >
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} />
         </mesh>
         <mesh
            ref={meshRef}
            onClick={handleClick}
            scale={
               isPopped
                  ? blastEffect
                     ? [1.5 * balloonSize, 1.5 * balloonSize, 1.5 * balloonSize]
                     : [0.1, 0.1, 0.1]
                  : [1.1 * balloonSize, 1.4 * balloonSize, 1.1 * balloonSize]
            }
         >
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshLambertMaterial color={color} />
         </mesh>
         <mesh
            scale={
               isPopped
                  ? blastEffect
                     ? [1.3 * balloonSize, 1.3 * balloonSize, 1.3 * balloonSize]
                     : [0.1, 0.1, 0.1]
                  : [0.9 * balloonSize, 1.2 * balloonSize, 0.9 * balloonSize]
            }
         >
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshLambertMaterial color="#ffffff" transparent opacity={0.3} />
         </mesh>
         <mesh position={[0, -0.6 * balloonSize, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
            <meshBasicMaterial color="#222222" />
         </mesh>
         <mesh position={[0, -0.6 * balloonSize - 0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshBasicMaterial color="#ffff00" />
         </mesh>
         {hasQuestion && (
            <group position={[0, 0, 0.45 * balloonSize]}>
               {/* Question mark background circle */}
               <mesh position={[0, 0, 0]}>
                  <circleGeometry args={[0.15 * balloonSize, 16]} />
                  <meshBasicMaterial color="#ffffff" />
               </mesh>
               {/* Question mark border */}
               <mesh position={[0, 0, 0.001]}>
                  <circleGeometry args={[0.13 * balloonSize, 16]} />
                  <meshBasicMaterial color="#ff0000" />
               </mesh>
               {/* Question mark main curve */}
               <mesh position={[0, 0.03 * balloonSize, 0.002]}>
                  <ringGeometry
                     args={[
                        0.05 * balloonSize,
                        0.08 * balloonSize,
                        8,
                        1,
                        0,
                        Math.PI,
                     ]}
                  />
                  <meshBasicMaterial color="#ffffff" />
               </mesh>
               {/* Question mark vertical line */}
               <mesh position={[0, -0.02 * balloonSize, 0.002]}>
                  <boxGeometry
                     args={[0.03 * balloonSize, 0.04 * balloonSize, 0.001]}
                  />
                  <meshBasicMaterial color="#ffffff" />
               </mesh>
               {/* Question mark dot */}
               <mesh position={[0, -0.08 * balloonSize, 0.002]}>
                  <circleGeometry args={[0.02 * balloonSize, 8]} />
                  <meshBasicMaterial color="#ffffff" />
               </mesh>
            </group>
         )}
      </group>
   );
}

function GameScene({
   gameStarted,
   gameOver,
   gameCompleted,
   onBalloonPop,
   timeLeft,
}) {
   const [balloons, setBalloons] = useState([]);
   const balloonIdCounter = useRef(0);

   useEffect(() => {
      if (!gameStarted || gameOver || gameCompleted) return;

      const interval = setInterval(() => {
         const colorData =
            balloonColors[Math.floor(Math.random() * balloonColors.length)];
         const hasQuestion = Math.random() < 0.2;

         const newBalloon = {
            id: balloonIdCounter.current++,
            position: [
               (Math.random() - 0.5) * 4,
               -8,
               (Math.random() - 0.5) * 2,
            ],
            color: colorData.color,
            points: colorData.points,
            hasQuestion,
         };

         setBalloons((prev) => [...prev, newBalloon]);
      }, 1200);

      return () => clearInterval(interval);
   }, [gameStarted, gameOver, gameCompleted]);

   useEffect(() => {
      const cleanup = setInterval(() => {
         setBalloons((prev) =>
            prev.filter((balloon) => {
               return prev.indexOf(balloon) >= prev.length - 15;
            })
         );
      }, 3000);

      return () => clearInterval(cleanup);
   }, []);

   const handleBalloonPop = useCallback(
      (balloonId, points, hasQuestion, isEscape = false) => {
         setBalloons((prev) => prev.filter((b) => b.id !== balloonId));
         onBalloonPop(points, hasQuestion, isEscape);
      },
      [onBalloonPop]
   );

   return (
      <>
         <ambientLight intensity={0.8} />
         <directionalLight position={[5, 5, 5]} intensity={0.6} />

         <mesh position={[0, -8.2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 2]} />
            <meshBasicMaterial color="#ff4444" transparent opacity={0.2} />
         </mesh>

         <mesh position={[0, -8, 0]}>
            <boxGeometry args={[12, 0.08, 0.1]} />
            <meshBasicMaterial color="#ff0000" />
         </mesh>
         <mesh position={[-3, 6, -6]} scale={[1.5, 0.8, 1]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
         </mesh>
         <mesh position={[3, 5.5, -6]} scale={[1.2, 0.7, 1]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
         </mesh>
         <mesh position={[-1, 7, -7]} scale={[1.0, 0.6, 1]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
         </mesh>
         <mesh position={[2, 4, -6]} scale={[0.8, 0.5, 1]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
         </mesh>
         {balloons.map((balloon) => (
            <Balloon
               key={balloon.id}
               balloonId={balloon.id}
               position={balloon.position}
               color={balloon.color}
               points={balloon.points}
               hasQuestion={balloon.hasQuestion}
               onPop={handleBalloonPop}
               gameTime={timeLeft}
            />
         ))}
      </>
   );
}

const BalloonDropGame = ({ onBack }) => {

   const [gameStarted, setGameStarted] = useState(false);
   const [score, setScore] = useState(0);
   const [timeLeft, setTimeLeft] = useState(60);
   const [gameOver, setGameOver] = useState(false);
   const [gameCompleted, setGameCompleted] = useState(false);
   const [poppedBalloons, setPoppedBalloons] = useState(0);
   const [currentQuestion, setCurrentQuestion] = useState(null);
   const [showQuestion, setShowQuestion] = useState(false);
   const [showInstructions, setShowInstructions] = useState(false);

   const handleBalloonPop = useCallback(
      (points, hasQuestion, isEscape = false) => {
         if (isEscape && hasQuestion) {
            setGameOver(true);
            return;
         }

         if (hasQuestion && !showQuestion && !isEscape) {
            const randomQuestion =
               balloonDropQuestions[
                  Math.floor(Math.random() * balloonDropQuestions.length)
               ];
            // Convert the question format to match our existing structure
            const formattedQuestion = {
               question: randomQuestion.question,
               answer: randomQuestion.options[randomQuestion.correct],
               options: randomQuestion.options,
            };
            setCurrentQuestion(formattedQuestion);
            setShowQuestion(true);
         } else if (!isEscape) {
            setScore((prev) => prev + points);
            setPoppedBalloons((prev) => prev + 1);
         }
      },
      [showQuestion]
   );

   const handleAnswer = useCallback(
      (answer) => {
         if (!currentQuestion) return;

         const isCorrect = answer === currentQuestion.answer;
         const points = isCorrect ? 50 : 25;

         setScore((prev) => prev + points);
         setPoppedBalloons((prev) => prev + 1);
         setShowQuestion(false);
         setCurrentQuestion(null);
      },
      [currentQuestion]
   );

   const startGame = useCallback(() => {
      setGameStarted(true);
      setGameOver(false);
      setGameCompleted(false);
      setScore(0);
      setTimeLeft(60);
      setPoppedBalloons(0);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setShowInstructions(true);

      setTimeout(() => {
         setShowInstructions(false);
      }, 5000);
   }, []);

   const resetGame = useCallback(() => {
      setGameStarted(false);
      setGameOver(false);
      setGameCompleted(false);
      setScore(0);
      setTimeLeft(60);
      setPoppedBalloons(0);
      setShowQuestion(false);
      setCurrentQuestion(null);
   }, []);

   useEffect(() => {
      if (gameStarted && !gameOver && !gameCompleted && timeLeft > 0) {
         const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !gameOver) {
         setGameCompleted(true);
      }
   }, [timeLeft, gameStarted, gameOver, gameCompleted]);

   if (!gameStarted) {
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
               style={{ zIndex: 2 }}
            ></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                     boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
               >
                  <div className="mb-6">
                     <div className="text-6xl mb-4">🎈</div>
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Balloon Drop Quiz
                     </h1>
                     <p className="text-white/80 text-lg">
                        Pop balloons and answer questions to score points!
                     </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <h3 className="text-white font-semibold mb-4">
                        Game Rules:
                     </h3>
                     <ul className="text-white/80 text-sm space-y-2 text-left">
                        <li>
                           • Click falling balloons to pop them and earn points
                        </li>
                        <li>
                           • Balloons with ❓ symbol contain bonus quiz
                           questions
                        </li>
                        <li>
                           • Answer questions correctly for extra points (50 pts
                           correct, 25 pts wrong)
                        </li>
                        <li>
                           • Different colored balloons have different point
                           values (10-50 pts)
                        </li>
                        <li>
                           • ⚠️ Don't let question balloons escape to the top -
                           Game Over!
                        </li>
                        <li>
                           • Pop as many balloons as possible within 60 seconds
                        </li>
                     </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={startGame}
                        className="shiny-button text-xl font-bold"
                     >
                        <FaPlay className="text-lg relative z-10" />
                        <span className="relative z-10">Start Game</span>
                     </button>

                     <button
                        onClick={onBack}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
                     >
                        <FaHome className="inline mr-2" />
                        Back to Home
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (gameOver || gameCompleted) {
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
               style={{ zIndex: 2 }}
            ></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                     boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
               >
                  <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-2">
                     {gameCompleted ? "🎉 Time's Up!" : "🎈 Game Over!"}
                  </h2>
                  <p className="text-2xl font-bold mb-6 text-green-400">
                     {gameCompleted ? "Well Done!" : "Better luck next time!"}
                  </p>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-white/80">Final Score</p>
                           <p className="text-3xl font-bold text-white">
                              {score}
                           </p>
                        </div>
                        <div>
                           <p className="text-white/80">Balloons</p>
                           <p className="text-3xl font-bold text-white">
                              {poppedBalloons}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={resetGame}
                        className="shiny-button text-xl font-bold"
                     >
                        <FaRedo className="text-lg relative z-10" />
                        <span className="relative z-10">Play Again</span>
                     </button>
                     <button
                        onClick={onBack}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
                     >
                        <FaHome className="inline mr-2" />
                        Back to Home
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen relative overflow-hidden">
         <StarfieldCanvas height="100vh" />
         <div
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
            style={{ zIndex: 2 }}
         ></div>

         {/* Game Header */}
         <div className="relative z-10 p-4">
            <div className="flex justify-between items-center">
               <button
                  onClick={onBack}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 border border-white/20"
               >
                  <FaHome className="text-xl" />
               </button>

               <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <span className="text-white/80">Score: </span>
                     <span className="text-white font-bold">{score}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <span className="text-white/80">Balloons: </span>
                     <span className="text-white font-bold">
                        {poppedBalloons}
                     </span>
                  </div>
                  <div
                     className={`bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 ${
                        timeLeft <= 10 ? "animate-pulse bg-red-500/20" : ""
                     }`}
                  >
                     <FaClock className="inline mr-2 text-white/80" />
                     <span className="text-white font-bold">{timeLeft}s</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Game Area - React Three Fiber Canvas */}
         <div className="flex justify-center relative z-10">
            <div className="relative z-10">
               <div
                  className="border-2 border-white/20 rounded-lg overflow-hidden relative z-10"
                  style={{
                     width: "400px",
                     height: "700px",
                     backgroundImage: `url(${skyImage})`,
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                     backgroundRepeat: "no-repeat",
                     cursor: "pointer",
                  }}
               >
                  <Canvas
                     camera={{ position: [0, 0, 8], fov: 60 }}
                     gl={{
                        alpha: true,
                        antialias: false,
                        powerPreference: "default",
                     }}
                     style={{
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        position: "relative",
                        zIndex: 10,
                     }}
                  >
                     <GameScene
                        gameStarted={gameStarted}
                        gameOver={gameOver}
                        gameCompleted={gameCompleted}
                        onBalloonPop={handleBalloonPop}
                        timeLeft={timeLeft}
                     />
                  </Canvas>
               </div>

               {/* Game instructions */}
               {showInstructions && (
                  <div className="absolute bottom-4 left-4 right-4 text-center z-20">
                     <p className="text-white/80 text-sm bg-black/40 rounded-lg px-3 py-2 backdrop-blur-sm">
                        🎈 Click balloons to pop them! ❓ Question balloons
                        (with ❓ symbol) give bonus points! ⚠️ Don't let
                        question balloons escape to the top!
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* Question Modal */}
         {showQuestion && currentQuestion && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
               <div
                  className="border border-white/40 rounded-3xl p-8 max-w-md w-full mx-6 shadow-2xl relative overflow-hidden"
                  style={{
                     background: "rgba(0, 0, 0, 0.4)",
                     backdropFilter: "blur(15px)",
                     boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
                  }}
               >
                  {/* Dark glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/3 to-transparent opacity-30 rounded-3xl"></div>

                  <div className="relative z-10">
                     <div className="text-center mb-6">
                        <FaQuestion className="text-yellow-400 text-4xl mx-auto mb-4" />
                        <h3
                           className="text-2xl font-bold text-white mb-4 leading-relaxed drop-shadow-2xl"
                           style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                        >
                           {currentQuestion.question}
                        </h3>
                     </div>

                     <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                           <button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              className="w-full p-4 text-left border border-white/50 text-white hover:border-white/70 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
                              style={{
                                 background: "rgba(0, 0, 0, 0.3)",
                                 backdropFilter: "blur(10px)",
                                 boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.4)",
                              }}
                           >
                              {/* Dark glass effect overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/1 to-transparent opacity-20 rounded-2xl"></div>

                              {/* Hover shine effect */}
                              <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-12"></div>

                              <div className="relative z-10">
                                 <span
                                    className="text-lg font-medium drop-shadow-lg"
                                    style={{
                                       textShadow:
                                          "1px 1px 2px rgba(0,0,0,0.8)",
                                    }}
                                 >
                                    {option}
                                 </span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default BalloonDropGame;
