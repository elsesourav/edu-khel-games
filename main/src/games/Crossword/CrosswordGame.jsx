import { useCallback, useEffect, useState } from "react";
import {
   FaCheck,
   FaClock,
   FaHome,
   FaLightbulb,
   FaPlay,
   FaPuzzlePiece,
   FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { crosswordQuestions } from "../../data/questions";

// Custom CSS for blinking cursor
const cursorStyles = `
   @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
   }
   .cursor-blink {
      animation: blink 1s infinite;
   }
`;

// Inject the styles
if (typeof document !== "undefined") {
   const styleSheet = document.createElement("style");
   styleSheet.type = "text/css";
   styleSheet.innerText = cursorStyles;
   document.head.appendChild(styleSheet);
}

const CrosswordGame = () => {
   const navigate = useNavigate();
   const [gameStarted, setGameStarted] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for crossword
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   // Crossword specific states
   const [userGrid, setUserGrid] = useState([]);
   const [selectedCell, setSelectedCell] = useState(null);
   const [completedClues, setCompletedClues] = useState([]);
   const [hintsUsed, setHintsUsed] = useState(0);
   const [direction, setDirection] = useState("horizontal"); // 'horizontal' or 'vertical'
   const [currentWord, setCurrentWord] = useState(null); // Track current word being filled

   const initializeGrid = useCallback(() => {
      const currentCrossword = crosswordQuestions[currentQuestion];
      const grid = currentCrossword.grid.map((row) =>
         row.map((cell) => (cell === null ? null : ""))
      );
      setUserGrid(grid);
   }, [currentQuestion]);

   const checkAllAnswers = useCallback(() => {
      setScore(score + completedClues.length * 30);
      setCorrectAnswers(correctAnswers + completedClues.length);
   }, [score, completedClues.length, correctAnswers]);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < crosswordQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setAnswered(false);
         setTimeLeft(180);
         setSelectedCell(null);
         setCompletedClues([]);
         setHintsUsed(0);
         initializeGrid();
      } else {
         setShowResult(true);
      }
   }, [currentQuestion, initializeGrid]);

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         checkAllAnswers();
         setAnswered(true);
         setTimeout(() => {
            handleNextQuestion();
         }, 3000);
      }
   }, [
      timeLeft,
      gameStarted,
      showResult,
      answered,
      handleNextQuestion,
      checkAllAnswers,
   ]);

   useEffect(() => {
      if (gameStarted) {
         initializeGrid();
      }
   }, [gameStarted, currentQuestion, initializeGrid]);

   const startGame = () => {
      setGameStarted(true);
      setTimeLeft(180);
      initializeGrid();
   };

   const findWordBounds = useCallback(
      (row, col, direction) => {
         const currentCrossword = crosswordQuestions[currentQuestion];
         const cells = [];

         if (direction === "horizontal") {
            // Find start of word
            let startCol = col;
            while (
               startCol > 0 &&
               currentCrossword.grid[row][startCol - 1] !== null
            ) {
               startCol--;
            }

            // Find end of word
            let endCol = col;
            while (
               endCol < currentCrossword.grid[row].length - 1 &&
               currentCrossword.grid[row][endCol + 1] !== null
            ) {
               endCol++;
            }

            // Add all cells in the word
            for (let c = startCol; c <= endCol; c++) {
               if (currentCrossword.grid[row][c] !== null) {
                  cells.push({ row, col: c });
               }
            }
         } else {
            // Find start of word
            let startRow = row;
            while (
               startRow > 0 &&
               currentCrossword.grid[startRow - 1][col] !== null
            ) {
               startRow--;
            }

            // Find end of word
            let endRow = row;
            while (
               endRow < currentCrossword.grid.length - 1 &&
               currentCrossword.grid[endRow + 1][col] !== null
            ) {
               endRow++;
            }

            // Add all cells in the word
            for (let r = startRow; r <= endRow; r++) {
               if (currentCrossword.grid[r][col] !== null) {
                  cells.push({ row: r, col });
               }
            }
         }

         return cells;
      },
      [currentQuestion]
   );

   const detectBestDirection = (row, col) => {
      const currentCrossword = crosswordQuestions[currentQuestion];

      // Check horizontal word length
      let horizontalLength = 1;
      let leftCount = 0,
         rightCount = 0;

      // Count left
      for (
         let c = col - 1;
         c >= 0 && currentCrossword.grid[row][c] !== null;
         c--
      ) {
         leftCount++;
      }
      // Count right
      for (
         let c = col + 1;
         c < currentCrossword.grid[row].length &&
         currentCrossword.grid[row][c] !== null;
         c++
      ) {
         rightCount++;
      }
      horizontalLength = leftCount + rightCount + 1;

      // Check vertical word length
      let verticalLength = 1;
      let upCount = 0,
         downCount = 0;

      // Count up
      for (
         let r = row - 1;
         r >= 0 && currentCrossword.grid[r][col] !== null;
         r--
      ) {
         upCount++;
      }
      // Count down
      for (
         let r = row + 1;
         r < currentCrossword.grid.length &&
         currentCrossword.grid[r][col] !== null;
         r++
      ) {
         downCount++;
      }
      verticalLength = upCount + downCount + 1;

      // Return the direction with longer word, or keep current direction if equal
      if (horizontalLength > verticalLength) {
         return "horizontal";
      } else if (verticalLength > horizontalLength) {
         return "vertical";
      } else {
         return direction; // Keep current direction if both are equal length
      }
   };

   const handleCellClick = (row, col) => {
      if (userGrid[row] && userGrid[row][col] !== null) {
         setSelectedCell({ row, col });

         // Auto-detect best direction based on word lengths
         const bestDirection = detectBestDirection(row, col);
         setDirection(bestDirection);

         // Update current word bounds with the detected direction
         const wordCells = findWordBounds(row, col, bestDirection);
         setCurrentWord(wordCells);
      }
   };

   const checkCompletedWords = useCallback(
      (grid) => {
         const currentCrossword = crosswordQuestions[currentQuestion];
         const newCompletedClues = [];

         // Check across clues
         currentCrossword.clues.across.forEach((clue) => {
            let word = "";
            for (let i = 0; i < clue.length; i++) {
               word += grid[clue.row][clue.col + i] || "";
            }
            if (word === clue.answer) {
               newCompletedClues.push(`across-${clue.number}`);
            }
         });

         // Check down clues
         currentCrossword.clues.down.forEach((clue) => {
            let word = "";
            for (let i = 0; i < clue.length; i++) {
               word += grid[clue.row + i][clue.col] || "";
            }
            if (word === clue.answer) {
               newCompletedClues.push(`down-${clue.number}`);
            }
         });

         setCompletedClues(newCompletedClues);

         // Check if all clues are completed
         const totalClues =
            currentCrossword.clues.across.length +
            currentCrossword.clues.down.length;
         if (newCompletedClues.length === totalClues && !answered) {
            setAnswered(true);
            const bonus = Math.max(0, timeLeft * 2); // Time bonus
            setScore(score + newCompletedClues.length * 30 + bonus);
            setCorrectAnswers(correctAnswers + newCompletedClues.length);
            setTimeout(() => {
               handleNextQuestion();
            }, 2000);
         }
      },
      [
         currentQuestion,
         answered,
         timeLeft,
         score,
         correctAnswers,
         handleNextQuestion,
      ]
   );

   const moveToNextCell = useCallback(
      (currentRow, currentCol) => {
         const currentCrossword = crosswordQuestions[currentQuestion];

         if (direction === "horizontal") {
            // Move right
            for (
               let col = currentCol + 1;
               col < currentCrossword.grid[currentRow].length;
               col++
            ) {
               if (currentCrossword.grid[currentRow][col] !== null) {
                  setSelectedCell({ row: currentRow, col });
                  const wordCells = findWordBounds(currentRow, col, direction);
                  setCurrentWord(wordCells);
                  return;
               }
            }
         } else {
            // Move down
            for (
               let row = currentRow + 1;
               row < currentCrossword.grid.length;
               row++
            ) {
               if (currentCrossword.grid[row][currentCol] !== null) {
                  setSelectedCell({ row, col: currentCol });
                  const wordCells = findWordBounds(row, currentCol, direction);
                  setCurrentWord(wordCells);
                  return;
               }
            }
         }
      },
      [currentQuestion, direction, findWordBounds]
   );

   const moveToPreviousCell = useCallback(
      (currentRow, currentCol) => {
         const currentCrossword = crosswordQuestions[currentQuestion];

         if (direction === "horizontal") {
            // Move left
            for (let col = currentCol - 1; col >= 0; col--) {
               if (currentCrossword.grid[currentRow][col] !== null) {
                  setSelectedCell({ row: currentRow, col });
                  const wordCells = findWordBounds(currentRow, col, direction);
                  setCurrentWord(wordCells);
                  return;
               }
            }
         } else {
            // Move up
            for (let row = currentRow - 1; row >= 0; row--) {
               if (currentCrossword.grid[row][currentCol] !== null) {
                  setSelectedCell({ row, col: currentCol });
                  const wordCells = findWordBounds(row, currentCol, direction);
                  setCurrentWord(wordCells);
                  return;
               }
            }
         }
      },
      [currentQuestion, direction, findWordBounds]
   );

   const handleKeyboardInput = useCallback(
      (letter) => {
         if (!selectedCell) return;

         const { row, col } = selectedCell;
         const newGrid = [...userGrid];
         newGrid[row][col] = letter;
         setUserGrid(newGrid);

         // Check if any words are completed
         checkCompletedWords(newGrid);

         // Auto-navigate to next cell
         moveToNextCell(row, col);
      },
      [selectedCell, userGrid, checkCompletedWords, moveToNextCell]
   );

   const handleBackspace = useCallback(() => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      const newGrid = [...userGrid];
      newGrid[row][col] = "";
      setUserGrid(newGrid);

      // Move to previous cell
      moveToPreviousCell(row, col);
   }, [selectedCell, userGrid, moveToPreviousCell]);

   const getHint = (clueType, clueNumber) => {
      const currentCrossword = crosswordQuestions[currentQuestion];
      const clue =
         clueType === "across"
            ? currentCrossword.clues.across.find((c) => c.number === clueNumber)
            : currentCrossword.clues.down.find((c) => c.number === clueNumber);

      if (clue && hintsUsed < 3) {
         const newGrid = [...userGrid];
         // Fill first letter as hint
         if (clueType === "across") {
            newGrid[clue.row][clue.col] = clue.answer[0];
         } else {
            newGrid[clue.row][clue.col] = clue.answer[0];
         }
         setUserGrid(newGrid);
         setHintsUsed(hintsUsed + 1);
         setScore(Math.max(0, score - 10)); // Penalty for using hint
      }
   };

   const resetGame = () => {
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(180);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
      setSelectedCell(null);
      setCompletedClues([]);
      setHintsUsed(0);
   };

   const getScoreGrade = () => {
      const totalPossibleClues = crosswordQuestions.reduce(
         (acc, q) => acc + q.clues.across.length + q.clues.down.length,
         0
      );
      const percentage = (correctAnswers / totalPossibleClues) * 100;
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
            message: "Keep Trying!",
         };
      return { grade: "D", color: "text-red-400", message: "Practice More!" };
   };

   // Keyboard event listener for desktop
   useEffect(() => {
      const handleKeyPress = (event) => {
         if (!gameStarted || !selectedCell || showResult) return;

         const key = event.key.toUpperCase();

         // Handle letter keys
         if (key >= "A" && key <= "Z") {
            event.preventDefault();
            handleKeyboardInput(key);
         }
         // Handle backspace
         else if (key === "BACKSPACE") {
            event.preventDefault();
            handleBackspace();
         }
         // Handle arrow keys for navigation
         else if (key === "ARROWLEFT" || key === "ARROWRIGHT") {
            event.preventDefault();
            setDirection("horizontal");
            if (selectedCell) {
               const wordCells = findWordBounds(
                  selectedCell.row,
                  selectedCell.col,
                  "horizontal"
               );
               setCurrentWord(wordCells);
               if (key === "ARROWLEFT") {
                  moveToPreviousCell(selectedCell.row, selectedCell.col);
               } else {
                  moveToNextCell(selectedCell.row, selectedCell.col);
               }
            }
         } else if (key === "ARROWUP" || key === "ARROWDOWN") {
            event.preventDefault();
            setDirection("vertical");
            if (selectedCell) {
               const wordCells = findWordBounds(
                  selectedCell.row,
                  selectedCell.col,
                  "vertical"
               );
               setCurrentWord(wordCells);
               if (key === "ARROWUP") {
                  moveToPreviousCell(selectedCell.row, selectedCell.col);
               } else {
                  moveToNextCell(selectedCell.row, selectedCell.col);
               }
            }
         }
      };

      // Add event listener
      document.addEventListener("keydown", handleKeyPress);

      // Cleanup
      return () => {
         document.removeEventListener("keydown", handleKeyPress);
      };
   }, [
      gameStarted,
      selectedCell,
      showResult,
      direction,
      handleKeyboardInput,
      handleBackspace,
      findWordBounds,
      moveToNextCell,
      moveToPreviousCell,
   ]);

   if (!gameStarted) {
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-indigo-900/40"
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
                     <FaPuzzlePiece className="text-6xl text-purple-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Crossword Puzzle
                     </h1>
                     <p className="text-white/80 text-lg mb-6">
                        Fill in the crossword grid using the given clues! Click
                        on cells and type letters.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={startGame}
                        className="shiny-button text-xl font-bold bg-purple-500/20 hover:bg-purple-500/30 text-white px-8 py-4 rounded-xl border border-purple-400/30 transition-all duration-300 flex items-center justify-center gap-3"
                     >
                        <FaPlay className="text-lg" />
                        Start Game
                     </button>

                     <button
                        onClick={() => navigate("/")}
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
      const gradeInfo = getScoreGrade();
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-indigo-900/40"
               style={{ zIndex: 2 }}
            ></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                     boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
               >
                  <div className="mb-8">
                     <div className="flex justify-center mb-4">
                        {[...Array(3)].map((_, i) => (
                           <FaStar
                              key={i}
                              className={`text-4xl mx-1 ${
                                 i <
                                 Math.ceil(
                                    correctAnswers /
                                       (crosswordQuestions.length * 3)
                                 )
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                              }`}
                           />
                        ))}
                     </div>
                     <h2 className="text-4xl font-bold text-white mb-4">
                        Game Complete!
                     </h2>
                     <div
                        className={`text-6xl font-bold mb-4 ${gradeInfo.color}`}
                     >
                        {gradeInfo.grade}
                     </div>
                     <p className="text-2xl text-white mb-4">
                        {gradeInfo.message}
                     </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                           {score}
                        </div>
                        <div className="text-white/80">Total Score</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                           {correctAnswers}
                        </div>
                        <div className="text-white/80">Completed Clues</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                           {hintsUsed}
                        </div>
                        <div className="text-white/80">Hints Used</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={resetGame}
                        className="shiny-button text-xl font-bold bg-purple-500/20 hover:bg-purple-500/30 text-white px-8 py-4 rounded-xl border border-purple-400/30 transition-all duration-300 flex items-center justify-center gap-3"
                     >
                        <FaPlay className="text-lg" />
                        Play Again
                     </button>

                     <button
                        onClick={() => navigate("/")}
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

   const currentCrossword = crosswordQuestions[currentQuestion];

   return (
      <div className="min-h-screen relative overflow-hidden">
         <StarfieldCanvas height="100vh" />
         <div
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-indigo-900/40"
            style={{ zIndex: 2 }}
         ></div>

         <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => navigate("/")}
                     className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
                  >
                     <FaHome className="inline mr-2" />
                     Back to Home
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                     Crossword Puzzle
                  </h1>
               </div>
               <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                     <FaClock className="text-purple-400" />
                     <span className="text-xl font-bold">
                        {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, "0")}
                     </span>
                  </div>
                  <div className="text-xl font-bold">Score: {score}</div>
                  <div className="text-lg">
                     {currentQuestion + 1}/{crosswordQuestions.length}
                  </div>
               </div>
            </div>

            {/* Game Content */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
               {/* Crossword Grid */}
               <div className="lg:col-span-2">
                  <div
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
                     style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                     }}
                  >
                     <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        {currentCrossword.title}
                     </h2>

                     <div className="flex justify-center">
                        <div className="grid gap-1 p-4 bg-white/5 rounded-xl">
                           {currentCrossword.grid.map((row, rowIndex) => (
                              <div key={rowIndex} className="flex gap-1">
                                 {row.map((cell, colIndex) => (
                                    <div
                                       key={colIndex}
                                       className={`w-10 h-10 border-2 flex items-center justify-center text-lg font-bold relative ${
                                          cell === null
                                             ? "bg-gray-800 border-gray-700"
                                             : selectedCell?.row === rowIndex &&
                                               selectedCell?.col === colIndex
                                             ? "bg-purple-500/40 border-purple-300 text-white cursor-pointer"
                                             : currentWord?.some(
                                                  (wordCell) =>
                                                     wordCell.row ===
                                                        rowIndex &&
                                                     wordCell.col === colIndex
                                               )
                                             ? "bg-purple-500/20 border-purple-400/50 text-white cursor-pointer"
                                             : "bg-white/10 border-white/30 text-white cursor-pointer hover:bg-white/20"
                                       }`}
                                       onClick={() =>
                                          handleCellClick(rowIndex, colIndex)
                                       }
                                    >
                                       {cell !== null && (
                                          <>
                                             <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                                {userGrid[rowIndex]?.[
                                                   colIndex
                                                ] || ""}
                                             </div>
                                             {selectedCell?.row === rowIndex &&
                                                selectedCell?.col ===
                                                   colIndex && (
                                                   <div className="absolute inset-0 border-2 border-white cursor-blink pointer-events-none rounded-sm"></div>
                                                )}
                                          </>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Virtual Keyboard */}
                  <div
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl mt-6"
                     style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                     }}
                  >
                     {/* Direction Selection */}
                     <div className="flex justify-center gap-4 mb-4">
                        <button
                           onClick={() => {
                              setDirection("horizontal");
                              if (selectedCell) {
                                 const wordCells = findWordBounds(
                                    selectedCell.row,
                                    selectedCell.col,
                                    "horizontal"
                                 );
                                 setCurrentWord(wordCells);
                              }
                           }}
                           className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                              direction === "horizontal"
                                 ? "bg-purple-500/30 border-purple-400 text-white border-2"
                                 : "bg-white/10 border-white/20 text-white/70 border-2 hover:bg-white/20"
                           }`}
                        >
                           → Horizontal
                        </button>
                        <button
                           onClick={() => {
                              setDirection("vertical");
                              if (selectedCell) {
                                 const wordCells = findWordBounds(
                                    selectedCell.row,
                                    selectedCell.col,
                                    "vertical"
                                 );
                                 setCurrentWord(wordCells);
                              }
                           }}
                           className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                              direction === "vertical"
                                 ? "bg-purple-500/30 border-purple-400 text-white border-2"
                                 : "bg-white/10 border-white/20 text-white/70 border-2 hover:bg-white/20"
                           }`}
                        >
                           ↓ Vertical
                        </button>
                     </div>

                     {/* Keyboard Layout */}
                     <div className="space-y-1">
                        {/* Row 1 */}
                        <div className="flex justify-center gap-0.5">
                           {[
                              "Q",
                              "W",
                              "E",
                              "R",
                              "T",
                              "Y",
                              "U",
                              "I",
                              "O",
                              "P",
                           ].map((letter) => (
                              <button
                                 key={letter}
                                 onClick={() => handleKeyboardInput(letter)}
                                 disabled={!selectedCell}
                                 className={`w-12 h-12 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 ${
                                    selectedCell
                                       ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50"
                                       : "bg-gray-600/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                                 }`}
                              >
                                 {letter}
                              </button>
                           ))}
                        </div>

                        {/* Row 2 */}
                        <div className="flex justify-center gap-0.5">
                           {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(
                              (letter) => (
                                 <button
                                    key={letter}
                                    onClick={() => handleKeyboardInput(letter)}
                                    disabled={!selectedCell}
                                    className={`w-12 h-12 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 ${
                                       selectedCell
                                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50"
                                          : "bg-gray-600/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                                    }`}
                                 >
                                    {letter}
                                 </button>
                              )
                           )}
                        </div>

                        {/* Row 3 */}
                        <div className="flex justify-center gap-0.5">
                           {["Z", "X", "C", "V", "B", "N", "M"].map(
                              (letter) => (
                                 <button
                                    key={letter}
                                    onClick={() => handleKeyboardInput(letter)}
                                    disabled={!selectedCell}
                                    className={`w-12 h-12 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 ${
                                       selectedCell
                                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50"
                                          : "bg-gray-600/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                                    }`}
                                 >
                                    {letter}
                                 </button>
                              )
                           )}
                        </div>

                        {/* Control buttons */}
                        <div className="flex justify-center gap-1 mt-2">
                           <button
                              onClick={handleBackspace}
                              disabled={!selectedCell}
                              className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 ${
                                 selectedCell
                                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 hover:border-red-400/50"
                                    : "bg-gray-600/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                              }`}
                           >
                              ← Backspace
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Clues Panel */}
               <div className="space-y-4">
                  {/* Across Clues */}
                  <div
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                     style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                     }}
                  >
                     <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <FaCheck />
                        Across
                     </h3>
                     <div className="space-y-2">
                        {currentCrossword.clues.across.map((clue) => (
                           <div
                              key={clue.number}
                              className={`p-2 rounded-lg border ${
                                 completedClues.includes(
                                    `across-${clue.number}`
                                 )
                                    ? "bg-green-500/20 border-green-400 text-green-300"
                                    : "bg-white/5 border-white/20 text-white"
                              }`}
                           >
                              <div className="flex justify-between items-start">
                                 <div>
                                    <span className="font-bold">
                                       {clue.number}.
                                    </span>{" "}
                                    {clue.clue}
                                 </div>
                                 {!completedClues.includes(
                                    `across-${clue.number}`
                                 ) &&
                                    hintsUsed < 3 && (
                                       <button
                                          onClick={() =>
                                             getHint("across", clue.number)
                                          }
                                          className="text-yellow-400 hover:text-yellow-300 text-sm"
                                       >
                                          <FaLightbulb />
                                       </button>
                                    )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Down Clues */}
                  <div
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                     style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                     }}
                  >
                     <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <FaCheck />
                        Down
                     </h3>
                     <div className="space-y-2">
                        {currentCrossword.clues.down.map((clue) => (
                           <div
                              key={clue.number}
                              className={`p-2 rounded-lg border ${
                                 completedClues.includes(`down-${clue.number}`)
                                    ? "bg-green-500/20 border-green-400 text-green-300"
                                    : "bg-white/5 border-white/20 text-white"
                              }`}
                           >
                              <div className="flex justify-between items-start">
                                 <div>
                                    <span className="font-bold">
                                       {clue.number}.
                                    </span>{" "}
                                    {clue.clue}
                                 </div>
                                 {!completedClues.includes(
                                    `down-${clue.number}`
                                 ) &&
                                    hintsUsed < 3 && (
                                       <button
                                          onClick={() =>
                                             getHint("down", clue.number)
                                          }
                                          className="text-yellow-400 hover:text-yellow-300 text-sm"
                                       >
                                          <FaLightbulb />
                                       </button>
                                    )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Progress */}
                  <div
                     className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                     style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                     }}
                  >
                     <div className="text-white/80 mb-2">
                        Completed: {completedClues.length} /{" "}
                        {currentCrossword.clues.across.length +
                           currentCrossword.clues.down.length}
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                           className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
                           style={{
                              width: `${
                                 (completedClues.length /
                                    (currentCrossword.clues.across.length +
                                       currentCrossword.clues.down.length)) *
                                 100
                              }%`,
                           }}
                        ></div>
                     </div>
                     <div className="text-white/60 text-sm mt-2">
                        Hints remaining: {3 - hintsUsed}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CrosswordGame;
