import { useCallback, useEffect, useRef, useState } from "react";
import {
   FaClock,
   FaHome,
   FaLightbulb,
   FaPlay,
   FaRandom,
   FaRedo,
   FaStar,
} from "react-icons/fa";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { wordScrambleQuestions } from "../../data/questions";

const WordScrambleGame = ({ onBack }) => {
   const [gameStarted, setGameStarted] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per word
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   // Word Scramble specific states - Drag and Drop
   const [scrambledLetters, setScrambledLetters] = useState([]);
   const [dropZoneLetters, setDropZoneLetters] = useState([]);
   const [hintsUsed, setHintsUsed] = useState(0);
   const [displayedHints, setDisplayedHints] = useState([]);
   const [draggedLetter, setDraggedLetter] = useState(null);

   // Counter for unique keys
   const letterIdCounter = useRef(0);

   const scrambleWord = useCallback((word) => {
      const letters = word.split("").map((letter, index) => {
         letterIdCounter.current += 1;
         return {
            id: `letter-${letterIdCounter.current}-${Date.now()}-${index}`,
            letter: letter.toLowerCase(),
            originalIndex: index,
         };
      });

      // Shuffle the letters
      for (let i = letters.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters;
   }, []);

   const initializeQuestion = useCallback(() => {
      const currentWord = wordScrambleQuestions[currentQuestion];
      const scrambledLettersArray = scrambleWord(currentWord.word);
      setScrambledLetters(scrambledLettersArray);
      setDropZoneLetters(new Array(currentWord.word.length).fill(null));
      setDisplayedHints([]);
   }, [currentQuestion, scrambleWord]);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < wordScrambleQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setAnswered(false);
         setTimeLeft(120);
         setHintsUsed(0);
         initializeQuestion();
      } else {
         setShowResult(true);
      }
   }, [currentQuestion, initializeQuestion]);

   const checkAnswer = useCallback(() => {
      const currentWord = wordScrambleQuestions[currentQuestion];
      const formedWord = dropZoneLetters
         .filter((letter) => letter !== null)
         .map((letter) => letter.letter)
         .join("");

      const isCorrect =
         formedWord.toLowerCase() === currentWord.word.toLowerCase();

      if (isCorrect) {
         const timeBonus = Math.max(0, timeLeft * 2);
         const hintPenalty = hintsUsed * 10;
         const questionScore = Math.max(10, 50 + timeBonus - hintPenalty);
         setScore(score + questionScore);
         setCorrectAnswers(correctAnswers + 1);
      }

      setAnswered(true);
      setTimeout(() => {
         handleNextQuestion();
      }, 2000);
   }, [
      dropZoneLetters,
      currentQuestion,
      timeLeft,
      hintsUsed,
      score,
      correctAnswers,
      handleNextQuestion,
   ]);

   const handleShuffle = () => {
      const currentWord = wordScrambleQuestions[currentQuestion];
      const newScrambled = scrambleWord(currentWord.word);
      setScrambledLetters(newScrambled);
      // Clear the drop zone when shuffling
      setDropZoneLetters(new Array(currentWord.word.length).fill(null));
   };

   // Drag and Drop handlers
   const handleDragStart = (e, letter) => {
      setDraggedLetter(letter);
      e.dataTransfer.effectAllowed = "move";
   };

   const handleDragEnd = () => {
      // Clear the dragged letter state after a delay to ensure drop handlers run first
      setTimeout(() => {
         setDraggedLetter(null);
      }, 10);
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
   };

   const handleDropToZone = (e, dropIndex) => {
      e.preventDefault();
      if (!draggedLetter) return;

      // Check if dragged letter is coming from scrambled letters or drop zone
      const isFromScrambled = scrambledLetters.some(
         (l) => l.id === draggedLetter.id
      );
      const isFromDropZone = dropZoneLetters.some(
         (l) => l && l.id === draggedLetter.id
      );

      // Get the existing letter that will be displaced
      const existingLetter = dropZoneLetters[dropIndex];

      // Update both states in the correct order
      if (isFromScrambled) {
         // Remove dragged letter from scrambled and update drop zone
         setScrambledLetters((prev) => {
            let newScrambled = prev.filter((l) => l.id !== draggedLetter.id);
            // Add displaced letter if exists
            if (existingLetter) {
               newScrambled = [...newScrambled, existingLetter];
            }
            return newScrambled;
         });
      } else if (isFromDropZone) {
         // Update scrambled letters with displaced letter only
         if (existingLetter) {
            setScrambledLetters((prev) => [...prev, existingLetter]);
         }
         // Remove dragged letter from its original drop zone position
         setDropZoneLetters((prev) =>
            prev.map((letter) =>
               letter && letter.id === draggedLetter.id ? null : letter
            )
         );
      }

      // Always update the drop zone with the dragged letter
      setDropZoneLetters((prev) => {
         const newDropZone = [...prev];
         newDropZone[dropIndex] = draggedLetter;
         return newDropZone;
      });

      setDraggedLetter(null);
   };

   const handleDropToScrambled = (e) => {
      e.preventDefault();
      if (!draggedLetter) return;

      // Remove from drop zone and add back to scrambled
      setDropZoneLetters((prev) =>
         prev.map((letter) =>
            letter && letter.id === draggedLetter.id ? null : letter
         )
      );
      setScrambledLetters((prev) => [...prev, draggedLetter]);
      setDraggedLetter(null);
   };

   const handleLetterClick = (
      letter,
      fromDropZone = false,
      dropIndex = null
   ) => {
      if (fromDropZone) {
         // Move from drop zone back to scrambled
         setDropZoneLetters((prev) => {
            const newDropZone = [...prev];
            newDropZone[dropIndex] = null;
            return newDropZone;
         });
         setScrambledLetters((prev) => [...prev, letter]);
      } else {
         // Move from scrambled to first available drop zone
         const firstEmptyIndex = dropZoneLetters.findIndex(
            (slot) => slot === null
         );
         if (firstEmptyIndex !== -1) {
            setScrambledLetters((prev) =>
               prev.filter((l) => l.id !== letter.id)
            );
            setDropZoneLetters((prev) => {
               const newDropZone = [...prev];
               newDropZone[firstEmptyIndex] = letter;
               return newDropZone;
            });
         }
      }
   };

   const handleHint = () => {
      if (hintsUsed < 2) {
         const currentWord = wordScrambleQuestions[currentQuestion];
         const newHintCount = hintsUsed + 1;

         let hintText = "";
         if (newHintCount === 1) {
            hintText = `Category: ${currentWord.category}`;
         } else if (newHintCount === 2) {
            hintText = currentWord.hint;
         }

         setHintsUsed(newHintCount);
         setDisplayedHints((prev) => [
            ...prev,
            { id: newHintCount, text: hintText },
         ]);
      }
   };

   // Check if word is complete
   const isWordComplete = dropZoneLetters.every((letter) => letter !== null);

   // Auto-check answer when word is complete
   useEffect(() => {
      if (isWordComplete && !answered && gameStarted) {
         checkAnswer();
      }
   }, [isWordComplete, answered, gameStarted, checkAnswer]);

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         setAnswered(true);
         setTimeout(() => {
            handleNextQuestion();
         }, 3000);
      }
   }, [timeLeft, gameStarted, showResult, answered, handleNextQuestion]);

   useEffect(() => {
      if (gameStarted) {
         initializeQuestion();
      }
   }, [gameStarted, currentQuestion, initializeQuestion]);

   const startGame = ({ onBack }) => {
      setGameStarted(true);
      setTimeLeft(120);
      initializeQuestion();
   };

   const resetGame = ({ onBack }) => {
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(120);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
      setHintsUsed(0);
      setScrambledLetters([]);
      setDropZoneLetters([]);
      setDisplayedHints([]);
   };

   const getScoreGrade = () => {
      const percentage = (correctAnswers / wordScrambleQuestions.length) * 100;
      if (percentage >= 90)
         return { grade: "A+", color: "text-green-400", message: "Excellent!" };
      if (percentage >= 80)
         return { grade: "A", color: "text-green-300", message: "Great Job!" };
      if (percentage >= 70)
         return { grade: "B", color: "text-blue-400", message: "Good Work!" };
      if (percentage >= 60)
         return {
            grade: "C",
            color: "text-yellow-400",
            message: "Keep Practicing!",
         };
      return { grade: "F", color: "text-red-400", message: "Try Again!" };
   };

   if (!gameStarted) {
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-blue-900/40"
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
                     <FaRandom className="text-6xl text-purple-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Word Scramble
                     </h1>
                     <p className="text-white/80 text-lg">
                        Unscramble letters to form{" "}
                        {wordScrambleQuestions.length} words
                     </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <h3 className="text-white font-semibold mb-4">
                        How to Play:
                     </h3>
                     <ul className="text-white/80 text-sm space-y-2 text-left">
                        <li>• Drag letters to form the correct word</li>
                        <li>• Or click letters to move them</li>
                        <li>• Use hints if you get stuck (max 2 per word)</li>
                        <li>
                           • Complete words automatically check your answer
                        </li>
                        <li>• Faster completion = higher score!</li>
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

   if (showResult) {
      const { grade, color, message } = getScoreGrade();
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-blue-900/40"
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
                  <FaStar className="text-6xl text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-2">
                     Game Complete!
                  </h2>
                  <p className={`text-2xl font-bold mb-6 ${color}`}>
                     {message}
                  </p>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-white/80">Score</p>
                           <p className="text-3xl font-bold text-white">
                              {score}
                           </p>
                        </div>
                        <div>
                           <p className="text-white/80">Grade</p>
                           <p className={`text-3xl font-bold ${color}`}>
                              {grade}
                           </p>
                        </div>
                        <div>
                           <p className="text-white/80">Correct</p>
                           <p className="text-2xl font-bold text-green-400">
                              {correctAnswers}
                           </p>
                        </div>
                        <div>
                           <p className="text-white/80">Total</p>
                           <p className="text-2xl font-bold text-white">
                              {wordScrambleQuestions.length}
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

   const currentWord = wordScrambleQuestions[currentQuestion];

   return (
      <div className="min-h-screen relative overflow-hidden">
         <StarfieldCanvas height="100vh" />
         <div
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-blue-900/40"
            style={{ zIndex: 2 }}
         ></div>

         <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
               <button
                  onClick={onBack}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
               >
                  <FaHome className="inline mr-2" />
                  Back to Home
               </button>

               <div className="flex items-center space-x-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <span className="text-white/80">Score: </span>
                     <span className="text-white font-bold">{score}</span>
                  </div>
                  <div
                     className={`bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 ${
                        timeLeft <= 30 ? "animate-pulse bg-red-500/20" : ""
                     }`}
                  >
                     <FaClock className="inline mr-2 text-white/80" />
                     <span className="text-white font-bold">
                        {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, "0")}
                     </span>
                  </div>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
               <div className="flex justify-between text-white/80 text-sm mb-2">
                  <span>
                     Word {currentQuestion + 1} of{" "}
                     {wordScrambleQuestions.length}
                  </span>
                  <span>
                     {Math.round(
                        ((currentQuestion + 1) / wordScrambleQuestions.length) *
                           100
                     )}
                     % Complete
                  </span>
               </div>
               <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                     className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                     style={{
                        width: `${
                           ((currentQuestion + 1) /
                              wordScrambleQuestions.length) *
                           100
                        }%`,
                     }}
                  ></div>
               </div>
            </div>

            {/* Game Content Card */}
            <div className="max-w-4xl mx-auto">
               <div
                  className="border border-white/40 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden"
                  style={{
                     background: "rgba(0, 0, 0, 0.4)",
                     backdropFilter: "blur(15px)",
                     boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
                  }}
               >
                  {/* Dark glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/3 to-transparent opacity-30 rounded-3xl"></div>

                  <div className="relative z-10">
                     {/* Category */}
                     <div className="text-center mb-6">
                        <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold">
                           {currentWord.category}
                        </span>
                     </div>

                     {/* Drop Zone - Where user forms the word */}
                     <div className="text-center space-y-4">
                        <h3 className="text-white text-lg font-semibold">
                           Form the word:
                        </h3>
                        <div className="flex justify-center items-center space-x-2 min-h-[80px]">
                           {dropZoneLetters.map((letter, index) => (
                              <div
                                 key={index}
                                 className="w-16 h-16 border border-dashed border-purple-300/60 rounded-lg flex items-center justify-center bg-white/5 transition-all duration-200 hover:bg-white/10 hover:border-purple-300/80"
                                 onDragOver={handleDragOver}
                                 onDrop={(e) => handleDropToZone(e, index)}
                              >
                                 {letter ? (
                                    <div
                                       className="w-14 h-14 text-2xl font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center border-0 outline-none cursor-pointer"
                                       onClick={() =>
                                          handleLetterClick(letter, true, index)
                                       }
                                       draggable
                                       onDragStart={(e) =>
                                          handleDragStart(e, letter)
                                       }
                                       onDragEnd={handleDragEnd}
                                    >
                                       {letter.letter.toUpperCase()}
                                    </div>
                                 ) : (
                                    <span className="text-purple-300/50 text-xs">
                                       Drop
                                    </span>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Scrambled Letters - Available letters to drag */}
                     <div className="text-center space-y-4">
                        <h3 className="text-white text-lg font-semibold">
                           Available letters:
                        </h3>
                        <div
                           className="flex justify-center items-center flex-wrap gap-2 min-h-[80px] bg-white/5 rounded-lg p-4"
                           onDragOver={handleDragOver}
                           onDrop={handleDropToScrambled}
                        >
                           {scrambledLetters.map((letter) => (
                              <div
                                 key={letter.id}
                                 className="w-16 h-16 text-2xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-move shadow-md hover:shadow-xl transform hover:scale-105 flex items-center justify-center border-0 outline-none"
                                 onClick={() => handleLetterClick(letter)}
                                 draggable
                                 onDragStart={(e) => handleDragStart(e, letter)}
                                 onDragEnd={handleDragEnd}
                              >
                                 {letter.letter.toUpperCase()}
                              </div>
                           ))}
                           {scrambledLetters.length === 0 && (
                              <p className="text-gray-400 text-sm py-4">
                                 All letters used!
                              </p>
                           )}
                        </div>
                     </div>

                     <br />

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                           onClick={handleShuffle}
                           disabled={answered}
                           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                           <FaRedo className="text-sm" />
                           <span>Shuffle</span>
                        </button>

                        <button
                           onClick={handleHint}
                           disabled={hintsUsed >= 2 || answered}
                           className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                           <FaLightbulb className="text-sm" />
                           <span>Hint ({2 - hintsUsed} left)</span>
                        </button>
                     </div>

                     {/* Hint Display */}
                     {displayedHints.length > 0 && (
                        <div className="space-y-3">
                           <h3 className="text-white text-lg font-semibold text-center">
                              Hints:
                           </h3>
                           <div className="flex flex-wrap gap-3 justify-center">
                              {displayedHints.map((hint) => (
                                 <div
                                    key={hint.id}
                                    className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-3 text-center min-w-[200px] flex-1 max-w-sm"
                                 >
                                    <p className="text-yellow-200 text-sm">
                                       💡 <strong>Hint {hint.id}:</strong>{" "}
                                       {hint.text}
                                    </p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Feedback */}
                     {answered && (
                        <div className="text-center space-y-4 mt-4">
                           <div
                              className={`p-4 rounded-lg ${
                                 dropZoneLetters
                                    .filter((l) => l !== null)
                                    .map((l) => l.letter)
                                    .join("")
                                    .toLowerCase() ===
                                 currentWord.word.toLowerCase()
                                    ? "bg-green-600/20 border border-green-500/50"
                                    : "bg-red-600/20 border border-red-500/50"
                              }`}
                           >
                              <p
                                 className={`text-xl font-bold ${
                                    dropZoneLetters
                                       .filter((l) => l !== null)
                                       .map((l) => l.letter)
                                       .join("")
                                       .toLowerCase() ===
                                    currentWord.word.toLowerCase()
                                       ? "text-green-400"
                                       : "text-red-400"
                                 }`}
                              >
                                 {dropZoneLetters
                                    .filter((l) => l !== null)
                                    .map((l) => l.letter)
                                    .join("")
                                    .toLowerCase() ===
                                 currentWord.word.toLowerCase()
                                    ? "🎉 Correct!"
                                    : "❌ Incorrect!"}
                              </p>
                              <p className="text-white mt-2">
                                 The correct word was:{" "}
                                 <strong className="text-yellow-400">
                                    {currentWord.word.toUpperCase()}
                                 </strong>
                              </p>
                              <p className="text-gray-300 text-sm mt-1">
                                 {currentWord.hint}
                              </p>
                           </div>
                           <p className="text-white">Moving to next word...</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WordScrambleGame;
