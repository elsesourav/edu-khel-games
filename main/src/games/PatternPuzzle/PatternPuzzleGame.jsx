import { useCallback, useEffect, useState } from "react";
import {
   FaBrain,
   FaClock,
   FaHome,
   FaPlay,
   FaPuzzlePiece,
   FaRedo,
   FaStar,
   FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";

const difficultySettings = {
   easy: { patternLength: 4, optionsCount: 3, timeLimit: 30 },
   medium: { patternLength: 5, optionsCount: 4, timeLimit: 25 },
   hard: { patternLength: 6, optionsCount: 5, timeLimit: 20 },
};

const PatternPuzzleGame = () => {
   const navigate = useNavigate();
   const [gameStarted, setGameStarted] = useState(false);
   const [difficulty, setDifficulty] = useState("medium");
   const [level, setLevel] = useState(1);
   const [score, setScore] = useState(0);
   const [gameOver, setGameOver] = useState(false);
   const [currentPattern, setCurrentPattern] = useState([]);
   const [options, setOptions] = useState([]);
   const [correctAnswer, setCorrectAnswer] = useState(null);
   const [selectedAnswer, setSelectedAnswer] = useState(null);
   const [showResult, setShowResult] = useState(false);
   const [timeLeft, setTimeLeft] = useState(0);
   const [streak, setStreak] = useState(0);
   const [maxStreak, setMaxStreak] = useState(0);
   const [totalCorrect, setTotalCorrect] = useState(0);
   const [patternType, setPatternType] = useState("arithmetic");
   const [missingPosition, setMissingPosition] = useState(0);

   const settings = difficultySettings[difficulty];

   // Generate a pattern based on type
   const generatePattern = useCallback(() => {
      const length = settings.patternLength;
      let fullSequence = [];
      let correctAnswer = null;
      let options = [];

      // Choose random missing position (0 to length-1)
      const missingPos = Math.floor(Math.random() * length);
      setMissingPosition(missingPos);

      // Generate the complete sequence first
      if (patternType === "arithmetic") {
         // Arithmetic sequence: 2, 5, 8, 11, 14
         const start = Math.floor(Math.random() * 10) + 1;
         const diff = Math.floor(Math.random() * 5) + 2;

         for (let i = 0; i < length; i++) {
            fullSequence.push({
               value: start + i * diff,
               display: start + i * diff,
               type: "number",
            });
         }
      } else if (patternType === "geometric") {
         // Geometric sequence: 2, 6, 18, 54, 162
         const start = Math.floor(Math.random() * 5) + 2;
         const ratio = Math.floor(Math.random() * 3) + 2;

         for (let i = 0; i < length; i++) {
            fullSequence.push({
               value: start * Math.pow(ratio, i),
               display: start * Math.pow(ratio, i),
               type: "number",
            });
         }
      } else if (patternType === "squares") {
         // Perfect squares: 1, 4, 9, 16, 25
         for (let i = 1; i <= length; i++) {
            fullSequence.push({
               value: i * i,
               display: i * i,
               type: "number",
            });
         }
      } else if (patternType === "cubes") {
         // Perfect cubes: 1, 8, 27, 64, 125
         for (let i = 1; i <= length; i++) {
            fullSequence.push({
               value: i * i * i,
               display: i * i * i,
               type: "number",
            });
         }
      } else if (patternType === "primes") {
         // Prime numbers: 2, 3, 5, 7, 11
         const primes = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
         ];
         for (let i = 0; i < length; i++) {
            fullSequence.push({
               value: primes[i],
               display: primes[i],
               type: "number",
            });
         }
      } else if (patternType === "multiples") {
         // Multiples: 3, 6, 9, 12, 15
         const multiplier = Math.floor(Math.random() * 7) + 2; // 2-8
         for (let i = 1; i <= length; i++) {
            fullSequence.push({
               value: i * multiplier,
               display: i * multiplier,
               type: "number",
            });
         }
      } else if (patternType === "powers") {
         // Powers of 2: 2, 4, 8, 16, 32
         const base = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
         for (let i = 1; i <= length; i++) {
            fullSequence.push({
               value: Math.pow(base, i),
               display: Math.pow(base, i),
               type: "number",
            });
         }
      } else if (patternType === "alphabet") {
         // Alphabet pattern: A, C, E, G, I
         const startChar = 65; // 'A'
         const step = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

         for (let i = 0; i < length; i++) {
            const char = String.fromCharCode(startChar + i * step);
            fullSequence.push({
               value: char,
               display: char,
               type: "letter",
            });
         }
      } else if (patternType === "fibonacci") {
         // Fibonacci: 1, 1, 2, 3, 5, 8
         const fib = [1, 1];
         for (let i = 2; i < length; i++) {
            fib.push(fib[i - 1] + fib[i - 2]);
         }

         for (let i = 0; i < length; i++) {
            fullSequence.push({
               value: fib[i],
               display: fib[i],
               type: "number",
            });
         }
      } else if (patternType === "factorials") {
         // Factorials: 1, 2, 6, 24, 120
         let factorial = 1;
         for (let i = 1; i <= length; i++) {
            factorial = factorial * i;
            fullSequence.push({
               value: factorial,
               display: factorial,
               type: "number",
            });
         }
      }

      // Set the correct answer (the missing item)
      correctAnswer = fullSequence[missingPos];

      // Create pattern array with missing position
      const pattern = fullSequence.filter((_, index) => index !== missingPos);

      // Generate wrong options
      options = [correctAnswer];
      for (let i = 0; i < settings.optionsCount - 1; i++) {
         let wrongAnswer;
         if (correctAnswer.type === "number") {
            wrongAnswer =
               correctAnswer.value +
               (Math.random() > 0.5 ? 1 : -1) *
                  (Math.floor(Math.random() * 15) + 1);
            if (
               wrongAnswer > 0 &&
               !options.some((opt) => opt.value === wrongAnswer)
            ) {
               options.push({
                  value: wrongAnswer,
                  display: wrongAnswer,
                  type: "number",
               });
            }
         } else if (correctAnswer.type === "letter") {
            do {
               wrongAnswer = String.fromCharCode(
                  65 + Math.floor(Math.random() * 26)
               );
            } while (options.some((opt) => opt.value === wrongAnswer));

            options.push({
               value: wrongAnswer,
               display: wrongAnswer,
               type: "letter",
            });
         }
      }

      // Shuffle options
      options = options.sort(() => Math.random() - 0.5);

      setCurrentPattern(pattern);
      setCorrectAnswer(correctAnswer);
      setOptions(options);
   }, [settings.patternLength, settings.optionsCount, patternType]);

   // Start new game
   const startGame = useCallback(() => {
      setGameStarted(true);
      setGameOver(false);
      setLevel(1);
      setScore(0);
      setStreak(0);
      setTotalCorrect(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(settings.timeLimit);

      // Set random pattern type for first level
      const types = [
         "arithmetic",
         "geometric",
         "squares",
         "cubes",
         "primes",
         "multiples",
         "powers",
         "alphabet",
         "fibonacci",
         "factorials",
      ];
      setPatternType(types[Math.floor(Math.random() * types.length)]);

      generatePattern();
   }, [settings.timeLimit, generatePattern]);

   // Handle answer selection
   const handleAnswerSelect = useCallback(
      (selectedOption) => {
         if (showResult) return;

         setSelectedAnswer(selectedOption);
         setShowResult(true);

         const isCorrect = selectedOption.value === correctAnswer.value;

         if (isCorrect) {
            const points = level * 100 + streak * 50;
            setScore((prev) => prev + points);
            setStreak((prev) => {
               const newStreak = prev + 1;
               setMaxStreak((current) => Math.max(current, newStreak));
               return newStreak;
            });
            setTotalCorrect((prev) => prev + 1);

            // Next level after delay
            setTimeout(() => {
               const types = [
                  "arithmetic",
                  "geometric",
                  "squares",
                  "cubes",
                  "primes",
                  "multiples",
                  "powers",
                  "alphabet",
                  "fibonacci",
                  "factorials",
               ];
               setPatternType(types[Math.floor(Math.random() * types.length)]);
               setLevel((prev) => prev + 1);
               setSelectedAnswer(null);
               setShowResult(false);
               setTimeLeft(settings.timeLimit);
               generatePattern();
            }, 2000);
         } else {
            setStreak(0);
            setTimeout(() => {
               setGameOver(true);
            }, 1500);
         }
      },
      [
         showResult,
         correctAnswer,
         level,
         streak,
         settings.timeLimit,
         generatePattern,
      ]
   );

   // Timer effect
   useEffect(() => {
      if (gameStarted && !gameOver && !showResult && timeLeft > 0) {
         const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
         }, 1000);

         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameStarted && !gameOver && !showResult) {
         setStreak(0);
         setGameOver(true);
      }
   }, [gameStarted, gameOver, showResult, timeLeft]);

   // Reset game
   const resetGame = useCallback(() => {
      setGameStarted(false);
      setGameOver(false);
      setLevel(1);
      setScore(0);
      setStreak(0);
      setTotalCorrect(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(0);
      setCurrentPattern([]);
      setOptions([]);
   }, []);

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

   const getScoreMessage = () => {
      if (level >= 15) return "🧩 Pattern Master!";
      if (level >= 10) return "⭐ Pattern Expert!";
      if (level >= 7) return "👍 Great Pattern Skills!";
      if (level >= 5) return "💪 Good Progress!";
      return "🎯 Keep Practicing!";
   };

   const getPatternTypeLabel = () => {
      switch (patternType) {
         case "arithmetic":
            return "🔢 Arithmetic Sequence";
         case "geometric":
            return "📈 Geometric Sequence";
         case "squares":
            return "⬜ Perfect Squares";
         case "cubes":
            return "🧊 Perfect Cubes";
         case "primes":
            return "🔍 Prime Numbers";
         case "multiples":
            return "✖️ Multiples";
         case "powers":
            return "⚡ Powers";
         case "alphabet":
            return "🔤 Alphabet Pattern";
         case "fibonacci":
            return "🌀 Fibonacci Sequence";
         case "factorials":
            return "❗ Factorials";
         default:
            return "🧩 Pattern";
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
         <StarfieldCanvas />

         <div className="relative z-10 min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
               {/* Header */}
               <div className="w-full max-w-4xl mx-auto mb-8">
                  <div className="flex justify-between items-center mb-6">
                     <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                     >
                        <FaHome className="text-lg" />
                        <span>Home</span>
                     </button>

                     <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center">
                        <FaPuzzlePiece className="inline mr-3 text-purple-400" />
                        Pattern Puzzle
                     </h1>

                     <div className="w-24"></div>
                  </div>
               </div>

               {!gameStarted ? (
                  /* Start Screen */
                  <div className="w-full max-w-md mx-auto text-center">
                     <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                        <FaPuzzlePiece className="text-4xl text-purple-400 mb-4 mx-auto" />
                        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                           Pattern Puzzle
                        </h2>
                        <p className="text-sm mb-6 text-gray-300">
                           Find the missing number or letter in the sequence
                        </p>

                        {/* Difficulty Selection */}
                        <div className="mb-6">
                           <h3 className="text-lg font-semibold mb-3">
                              Difficulty:
                           </h3>
                           <div className="grid grid-cols-3 gap-2">
                              {Object.keys(difficultySettings).map((diff) => (
                                 <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`px-3 py-2 rounded-xl border-2 capitalize font-semibold transition-all duration-300 text-sm ${
                                       difficulty === diff
                                          ? `${getDifficultyColor(
                                               diff
                                            )} bg-white/20`
                                          : "border-gray-500 text-gray-400 hover:border-white/50 hover:text-white"
                                    }`}
                                 >
                                    {diff}
                                    <div className="text-xs mt-1">
                                       {difficultySettings[diff].patternLength}{" "}
                                       items
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <button
                           onClick={startGame}
                           className="shiny-button flex items-center gap-2 mx-auto text-lg px-6 py-3"
                        >
                           <FaPlay />
                           Start Game
                        </button>
                     </div>
                  </div>
               ) : (
                  /* Game Screen */
                  <div className="w-full max-w-4xl mx-auto">
                     {/* Game Stats */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 text-center">
                           <FaTrophy className="text-yellow-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">{score}</div>
                           <div className="text-xs text-gray-400">Score</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 text-center">
                           <FaStar className="text-purple-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">{level}</div>
                           <div className="text-xs text-gray-400">Level</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 text-center">
                           <FaBrain className="text-orange-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">{streak}</div>
                           <div className="text-xs text-gray-400">Streak</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 text-center">
                           <FaClock className="text-blue-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">{timeLeft}</div>
                           <div className="text-xs text-gray-400">Time</div>
                        </div>
                     </div>

                     {!gameOver ? (
                        /* Active Game */
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                           {/* Pattern Type */}
                           <div className="text-center mb-5">
                              <div className="text-xl font-bold mb-2">
                                 {getPatternTypeLabel()}
                              </div>
                              <div className="text-sm text-gray-400">
                                 Level {level} • {difficulty.toUpperCase()}
                              </div>
                           </div>

                           {/* Pattern Display */}
                           <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-4 text-center">
                                 Find the missing value:
                              </h3>
                              <div className="flex justify-center items-center gap-3 mb-4 flex-wrap">
                                 {/* Display sequence with missing position */}
                                 {Array.from({
                                    length: settings.patternLength,
                                 }).map((_, index) => {
                                    if (index === missingPosition) {
                                       // Show the missing position
                                       if (
                                          showResult &&
                                          selectedAnswer &&
                                          selectedAnswer.value ===
                                             correctAnswer.value
                                       ) {
                                          // Show correct answer when answered correctly
                                          return (
                                             <div
                                                key={index}
                                                className="w-16 h-16 rounded-xl border-4 border-green-400 bg-green-500/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg animate-pulse"
                                             >
                                                {correctAnswer.display}
                                             </div>
                                          );
                                       } else {
                                          // Show question mark
                                          return (
                                             <div
                                                key={index}
                                                className="w-16 h-16 rounded-xl border-4 border-dashed border-white/50 flex items-center justify-center"
                                             >
                                                <span className="text-white/50 text-3xl">
                                                   ?
                                                </span>
                                             </div>
                                          );
                                       }
                                    } else {
                                       // Show the known pattern items
                                       const patternIndex =
                                          index > missingPosition
                                             ? index - 1
                                             : index;
                                       const item =
                                          currentPattern[patternIndex];
                                       if (item) {
                                          return (
                                             <div
                                                key={index}
                                                className="w-16 h-16 rounded-xl border-4 border-purple-400 bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                                             >
                                                {item.display}
                                             </div>
                                          );
                                       }
                                    }
                                    return null;
                                 })}
                              </div>
                           </div>

                           {/* Options */}
                           <div className="mb-6">
                              <h3 className="text-lg font-semibold mb-4 text-center">
                                 Choose the missing value:
                              </h3>
                              <div className="flex justify-center gap-4 flex-wrap">
                                 {options.map((option, index) => (
                                    <div
                                       key={index}
                                       onClick={() =>
                                          handleAnswerSelect(option)
                                       }
                                       className={`w-16 h-16 rounded-xl border-4 border-blue-400 bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white cursor-pointer transition-all duration-300 shadow-lg hover:scale-110 hover:bg-white/20 ${
                                          selectedAnswer === option
                                             ? selectedAnswer.value ===
                                               correctAnswer.value
                                                ? "ring-4 ring-green-400 bg-green-500/20"
                                                : "ring-4 ring-red-400 bg-red-500/20"
                                             : ""
                                       }`}
                                    >
                                       {option.display}
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* Result Message */}
                           {showResult && (
                              <div className="text-center">
                                 {selectedAnswer.value ===
                                 correctAnswer.value ? (
                                    <div className="text-green-400 text-xl font-bold">
                                       ✅ Correct! Moving to next level...
                                    </div>
                                 ) : (
                                    <div className="text-red-400 text-xl font-bold">
                                       ❌ Wrong! The answer was{" "}
                                       {correctAnswer.display}
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     ) : (
                        /* Game Over Screen */
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 text-center max-w-md mx-auto">
                           <h2 className="text-2xl font-bold mb-4 text-red-400">
                              Game Over!
                           </h2>

                           <div className="text-4xl mb-4">
                              {getScoreMessage()}
                           </div>

                           <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3">
                                 <div className="text-2xl font-bold text-yellow-400">
                                    {score}
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    Final Score
                                 </div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3">
                                 <div className="text-2xl font-bold text-purple-400">
                                    {level}
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    Level Reached
                                 </div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3">
                                 <div className="text-2xl font-bold text-orange-400">
                                    {maxStreak}
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    Best Streak
                                 </div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3">
                                 <div className="text-2xl font-bold text-green-400">
                                    {totalCorrect}
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    Correct Answers
                                 </div>
                              </div>
                           </div>

                           <div className="flex gap-3 justify-center">
                              <button
                                 onClick={resetGame}
                                 className="shiny-button flex items-center gap-2 px-5 py-2.5 text-sm"
                              >
                                 <FaRedo />
                                 Play Again
                              </button>
                              <button
                                 onClick={() => navigate("/")}
                                 className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                              >
                                 <FaHome />
                                 Home
                              </button>
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

export default PatternPuzzleGame;
