import { useCallback, useEffect, useRef, useState } from "react";
import {
   FaBolt,
   FaClock,
   FaHome,
   FaPlay,
   FaRedo,
   FaStar,
   FaTrophy,
} from "react-icons/fa";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";

const difficultySettings = {
   easy: { timeLimit: 10, range: [1, 10], operations: ["+", "-"] },
   medium: { timeLimit: 8, range: [1, 50], operations: ["+", "-", "×"] },
   hard: { timeLimit: 6, range: [1, 100], operations: ["+", "-", "×", "÷"] },
};

const TimeRushGame = ({ onBack }) => {
   const inputRef = useRef(null);
   const [gameStarted, setGameStarted] = useState(false);
   const [difficulty, setDifficulty] = useState("medium");
   const [score, setScore] = useState(0);
   const [streak, setStreak] = useState(0);
   const [maxStreak, setMaxStreak] = useState(0);
   const [timeLeft, setTimeLeft] = useState(
      difficultySettings.medium.timeLimit
   );
   const [gameOver, setGameOver] = useState(false);
   const [currentProblem, setCurrentProblem] = useState(null);
   const [userAnswer, setUserAnswer] = useState("");
   const [correctAnswers, setCorrectAnswers] = useState(0);
   const [wrongAnswers, setWrongAnswers] = useState(0);
   const [showResult, setShowResult] = useState(null); // 'correct' or 'wrong'

   const generateProblem = useCallback(() => {
      const settings = difficultySettings[difficulty];
      const operation =
         settings.operations[
            Math.floor(Math.random() * settings.operations.length)
         ];

      let num1, num2, answer;

      switch (operation) {
         case "+":
            num1 =
               Math.floor(
                  Math.random() * (settings.range[1] - settings.range[0] + 1)
               ) + settings.range[0];
            num2 =
               Math.floor(
                  Math.random() * (settings.range[1] - settings.range[0] + 1)
               ) + settings.range[0];
            answer = num1 + num2;
            break;
         case "-":
            num1 =
               Math.floor(
                  Math.random() * (settings.range[1] - settings.range[0] + 1)
               ) + settings.range[0];
            num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
            answer = num1 - num2;
            break;
         case "×":
            num1 = Math.floor(Math.random() * 12) + 1; // 1-12 for multiplication
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 * num2;
            break;
         case "÷":
            // Generate division problems with whole number answers
            answer = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            num1 = answer * num2;
            break;
         default:
            num1 = 1;
            num2 = 1;
            answer = 2;
      }

      return {
         num1,
         num2,
         operation,
         answer,
         display: `${num1} ${operation} ${num2}`,
      };
   }, [difficulty]);

   const nextProblem = useCallback(() => {
      const problem = generateProblem();
      setCurrentProblem(problem);
      setUserAnswer("");
      setTimeLeft(difficultySettings[difficulty].timeLimit);
      setShowResult(null);

      // Focus input after a short delay
      setTimeout(() => {
         if (inputRef.current) {
            inputRef.current.focus();
         }
      }, 100);
   }, [generateProblem, difficulty]);

   const checkAnswer = useCallback(() => {
      if (!currentProblem) return;

      const userNum = parseInt(userAnswer);
      const isCorrect = userNum === currentProblem.answer;

      if (isCorrect) {
         setScore(
            (prev) => prev + Math.max(1, Math.floor(streak / 5) + 1) * 10
         );
         setStreak((prev) => {
            const newStreak = prev + 1;
            setMaxStreak((current) => Math.max(current, newStreak));
            return newStreak;
         });
         setCorrectAnswers((prev) => prev + 1);
         setShowResult("correct");
      } else {
         setStreak(0);
         setWrongAnswers((prev) => prev + 1);
         setShowResult("wrong");
      }

      // Show result for 500ms then move to next problem
      setTimeout(() => {
         if (!gameOver) {
            nextProblem();
         }
      }, 500);
   }, [currentProblem, userAnswer, streak, gameOver, nextProblem]);

   const startGame = useCallback(() => {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setStreak(0);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      setShowResult(null);
      nextProblem();
   }, [nextProblem]);

   const resetGame = useCallback(() => {
      setGameStarted(false);
      setGameOver(false);
      setScore(0);
      setStreak(0);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      setCurrentProblem(null);
      setUserAnswer("");
      setTimeLeft(difficultySettings[difficulty].timeLimit);
      setShowResult(null);
   }, [difficulty]);

   // Timer countdown
   useEffect(() => {
      if (!gameStarted || gameOver || timeLeft <= 0) return;

      const timer = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
               setGameOver(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(timer);
   }, [gameStarted, gameOver, timeLeft]);

   // Handle Enter key press
   useEffect(() => {
      const handleKeyPress = (e) => {
         if (
            e.key === "Enter" &&
            gameStarted &&
            !gameOver &&
            userAnswer.trim()
         ) {
            checkAnswer();
         }
      };

      window.addEventListener("keypress", handleKeyPress);
      return () => window.removeEventListener("keypress", handleKeyPress);
   }, [gameStarted, gameOver, userAnswer, checkAnswer]);

   const getScoreMessage = () => {
      const accuracy =
         correctAnswers > 0
            ? Math.round(
                 (correctAnswers / (correctAnswers + wrongAnswers)) * 100
              )
            : 0;

      if (accuracy >= 90) return "🏆 Math Genius!";
      if (accuracy >= 75) return "⭐ Great Job!";
      if (accuracy >= 60) return "👍 Nice Work!";
      return "💪 Keep Practicing!";
   };

   const getDifficultyColor = (diff) => {
      switch (diff) {
         case "easy":
            return "text-green-400 border-green-400";
         case "medium":
            return "text-yellow-400 border-yellow-400";
         case "hard":
            return "text-red-400 border-red-400";
         default:
            return "text-blue-400 border-blue-400";
      }
   };

   return (
      <div className="min-h-screen relative overflow-hidden">
         <StarfieldCanvas height="100vh" />
         <div
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
            style={{ zIndex: 2 }}
         ></div>

         <div className="relative z-10 min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
               {/* Header */}
               {gameStarted && (
                  <div className="w-full max-w-4xl mx-auto mb-6">
                     <div className="flex justify-between items-center">
                        <button
                           onClick={onBack}
                           className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 border border-white/20"
                        >
                           <FaHome className="text-xl" />
                        </button>

                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                           <FaBolt className="text-yellow-400" />
                           Time Rush
                        </h1>

                        <div className="w-16"></div>
                     </div>
                  </div>
               )}

               {!gameStarted ? (
                  /* Start Screen */
                  <div className="flex items-center justify-center py-8">
                     <div
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl"
                        style={{
                           background: "rgba(255, 255, 255, 0.05)",
                           backdropFilter: "blur(20px)",
                           boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                        }}
                     >
                        <div className="mb-4">
                           <FaBolt className="text-4xl text-yellow-400 mx-auto mb-3" />
                           <h1 className="text-3xl font-bold text-white mb-2">
                              Time Rush
                           </h1>
                           <p className="text-white/80 text-base">
                              Solve math problems as fast as you can!
                           </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 mb-4">
                           <h3 className="text-white font-semibold mb-3 text-sm">
                              Game Rules:
                           </h3>
                           <ul className="text-white/80 text-xs space-y-1 text-left">
                              <li>• Each problem has a time limit</li>
                              <li>• Build streaks for bonus points</li>
                              <li>• Choose your difficulty level</li>
                              <li>• Press Enter to submit answers</li>
                           </ul>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="mb-4">
                           <h3 className="text-white font-semibold mb-3 text-sm">
                              Choose Difficulty:
                           </h3>
                           <div className="grid grid-cols-3 gap-2">
                              {Object.keys(difficultySettings).map((diff) => (
                                 <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`px-3 py-2 rounded-lg border-2 capitalize font-semibold transition-all duration-300 text-sm ${
                                       difficulty === diff
                                          ? `${getDifficultyColor(
                                               diff
                                            )} bg-white/20`
                                          : "border-white/30 text-white/70 hover:border-white/50 hover:text-white hover:bg-white/10"
                                    }`}
                                 >
                                    <div className="text-sm font-bold">
                                       {diff}
                                    </div>
                                    <div className="text-xs opacity-80">
                                       {difficultySettings[diff].timeLimit}s
                                    </div>
                                 </button>
                              ))}
                           </div>
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
               ) : (
                  /* Game Screen */
                  <div className="w-full max-w-4xl mx-auto">
                     {/* Game Stats */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                           <FaTrophy className="text-yellow-400 text-2xl mx-auto mb-2" />
                           <div className="text-2xl font-bold text-white">
                              {score}
                           </div>
                           <div className="text-sm text-white/70">Score</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                           <FaBolt className="text-orange-400 text-2xl mx-auto mb-2" />
                           <div className="text-2xl font-bold text-white">
                              {streak}
                           </div>
                           <div className="text-sm text-white/70">Streak</div>
                        </div>
                        <div
                           className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 ${
                              timeLeft <= 3 ? "animate-pulse bg-red-500/20" : ""
                           }`}
                        >
                           <FaClock className="text-blue-400 text-2xl mx-auto mb-2" />
                           <div className="text-2xl font-bold text-white">
                              {timeLeft}
                           </div>
                           <div className="text-sm text-white/70">
                              Time Left
                           </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                           <FaStar className="text-green-400 text-2xl mx-auto mb-2" />
                           <div className="text-2xl font-bold text-white">
                              {correctAnswers}
                           </div>
                           <div className="text-sm text-white/70">Correct</div>
                        </div>
                     </div>

                     {!gameOver ? (
                        /* Active Game */
                        <div
                           className="border border-white/40 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
                           style={{
                              background: "rgba(0, 0, 0, 0.4)",
                              backdropFilter: "blur(15px)",
                              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
                           }}
                        >
                           {/* Dark glass effect overlay */}
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/3 to-transparent opacity-30 rounded-3xl"></div>

                           <div className="relative z-10">
                              {currentProblem && (
                                 <>
                                    <div className="mb-8">
                                       <div
                                          className={`text-6xl md:text-8xl font-bold mb-6 drop-shadow-2xl ${
                                             showResult === "correct"
                                                ? "text-green-400"
                                                : showResult === "wrong"
                                                ? "text-red-400"
                                                : "text-white"
                                          }`}
                                          style={{
                                             textShadow:
                                                "2px 2px 4px rgba(0,0,0,0.8)",
                                          }}
                                       >
                                          {currentProblem.display} = ?
                                       </div>

                                       {showResult && (
                                          <div
                                             className={`text-2xl font-bold mb-4 drop-shadow-lg ${
                                                showResult === "correct"
                                                   ? "text-green-400"
                                                   : "text-red-400"
                                             }`}
                                             style={{
                                                textShadow:
                                                   "1px 1px 2px rgba(0,0,0,0.8)",
                                             }}
                                          >
                                             {showResult === "correct"
                                                ? "✓ Correct!"
                                                : `✗ Wrong! Answer: ${currentProblem.answer}`}
                                          </div>
                                       )}
                                    </div>

                                    {!showResult && (
                                       <div className="mb-6">
                                          <input
                                             ref={inputRef}
                                             type="text"
                                             value={userAnswer}
                                             onChange={(e) =>
                                                setUserAnswer(e.target.value)
                                             }
                                             className="text-4xl font-bold text-center bg-white/20 border-2 border-white/50 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:border-yellow-400 focus:outline-none w-64 backdrop-blur-md"
                                             placeholder="Your answer"
                                             autoFocus
                                             autoComplete="off"
                                             autoCorrect="off"
                                             autoCapitalize="off"
                                             spellCheck="false"
                                             inputMode="numeric"
                                             style={{
                                                background:
                                                   "rgba(255, 255, 255, 0.1)",
                                                backdropFilter: "blur(10px)",
                                             }}
                                          />
                                          <div className="mt-6">
                                             <button
                                                onClick={checkAnswer}
                                                disabled={!userAnswer.trim()}
                                                className="shiny-button text-xl font-bold px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                                Submit Answer
                                             </button>
                                          </div>
                                       </div>
                                    )}

                                    <div
                                       className="text-sm text-white/70 drop-shadow-lg"
                                       style={{
                                          textShadow:
                                             "1px 1px 2px rgba(0,0,0,0.8)",
                                       }}
                                    >
                                       Press Enter to submit • Difficulty:{" "}
                                       <span className="font-semibold text-yellow-400">
                                          {difficulty.toUpperCase()}
                                       </span>
                                    </div>
                                 </>
                              )}
                           </div>
                        </div>
                     ) : (
                        /* Game Over Screen */
                        <div className="flex items-center justify-center py-8">
                           <div
                              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 max-w-md w-full text-center shadow-2xl"
                              style={{
                                 background: "rgba(255, 255, 255, 0.05)",
                                 backdropFilter: "blur(20px)",
                                 boxShadow:
                                    "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                              }}
                           >
                              <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-3" />
                              <h2 className="text-2xl font-bold text-white mb-1">
                                 Time's Up!
                              </h2>
                              <p className="text-lg font-bold mb-4 text-green-400">
                                 {getScoreMessage()}
                              </p>

                              <div className="bg-white/5 rounded-2xl p-4 mb-4">
                                 <div className="grid grid-cols-2 gap-3">
                                    <div>
                                       <p className="text-white/80 text-xs">
                                          Final Score
                                       </p>
                                       <p className="text-2xl font-bold text-white">
                                          {score}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-white/80 text-xs">
                                          Best Streak
                                       </p>
                                       <p className="text-2xl font-bold text-white">
                                          {maxStreak}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-white/80 text-xs">
                                          Correct
                                       </p>
                                       <p className="text-xl font-bold text-green-400">
                                          {correctAnswers}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-white/80 text-xs">
                                          Wrong
                                       </p>
                                       <p className="text-xl font-bold text-red-400">
                                          {wrongAnswers}
                                       </p>
                                    </div>
                                 </div>

                                 {correctAnswers > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/20">
                                       <p className="text-white/80 text-xs mb-1">
                                          Accuracy
                                       </p>
                                       <p className="text-lg font-bold text-blue-400">
                                          {Math.round(
                                             (correctAnswers /
                                                (correctAnswers +
                                                   wrongAnswers)) *
                                                100
                                          )}
                                          %
                                       </p>
                                    </div>
                                 )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 <button
                                    onClick={resetGame}
                                    className="shiny-button text-base font-bold py-3"
                                 >
                                    <FaRedo className="text-sm relative z-10" />
                                    <span className="relative z-10">
                                       Play Again
                                    </span>
                                 </button>
                                 <button
                                    onClick={onBack}
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 border border-white/20 text-base"
                                 >
                                    <FaHome className="inline mr-2 text-sm" />
                                    Home
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default TimeRushGame;
