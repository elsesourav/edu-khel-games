import { useCallback, useEffect, useState } from "react";
import {
   FaBrain,
   FaClock,
   FaEye,
   FaHome,
   FaPlay,
   FaRedo,
   FaStar,
   FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";

const colors = [
   { name: "red", bg: "bg-red-500", border: "border-red-500" },
   { name: "blue", bg: "bg-blue-500", border: "border-blue-500" },
   { name: "green", bg: "bg-green-500", border: "border-green-500" },
   { name: "yellow", bg: "bg-yellow-500", border: "border-yellow-500" },
   { name: "purple", bg: "bg-purple-500", border: "border-purple-500" },
   { name: "orange", bg: "bg-orange-500", border: "border-orange-500" },
   { name: "pink", bg: "bg-pink-500", border: "border-pink-500" },
   { name: "teal", bg: "bg-teal-500", border: "border-teal-500" },
   { name: "indigo", bg: "bg-indigo-500", border: "border-indigo-500" },
];

const difficultySettings = {
   easy: { gridSize: 3, sequenceStart: 3, displayTime: 1500, memoryTime: 3000 },
   medium: {
      gridSize: 4,
      sequenceStart: 4,
      displayTime: 1200,
      memoryTime: 2500,
   },
   hard: { gridSize: 5, sequenceStart: 5, displayTime: 1000, memoryTime: 2000 },
};

const MemoryTestGame = () => {
   const navigate = useNavigate();
   const [gameStarted, setGameStarted] = useState(false);
   const [difficulty, setDifficulty] = useState("medium");
   const [level, setLevel] = useState(1);
   const [score, setScore] = useState(0);
   const [gameOver, setGameOver] = useState(false);
   const [gamePhase, setGamePhase] = useState("waiting"); // 'waiting', 'showing', 'memorizing', 'testing'
   const [sequence, setSequence] = useState([]);
   const [playerSequence, setPlayerSequence] = useState([]);
   const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
   const [showingIndex, setShowingIndex] = useState(-1);
   const [gridCells, setGridCells] = useState([]);
   const [timeLeft, setTimeLeft] = useState(0);
   const [streak, setStreak] = useState(0);
   const [maxStreak, setMaxStreak] = useState(0);
   const [totalCorrect, setTotalCorrect] = useState(0);

   const settings = difficultySettings[difficulty];

   // Initialize grid
   const initializeGrid = useCallback(() => {
      const totalCells = settings.gridSize * settings.gridSize;
      const cells = [];

      for (let i = 0; i < totalCells; i++) {
         cells.push({
            id: i,
            color: colors[i % colors.length],
            row: Math.floor(i / settings.gridSize),
            col: i % settings.gridSize,
         });
      }

      setGridCells(cells);
   }, [settings.gridSize]);

   // Handle cell click during testing
   const handleCellClick = useCallback(
      (cellId) => {
         if (gamePhase !== "testing") return;

         const expectedCell = sequence[currentSequenceIndex];

         if (cellId === expectedCell) {
            // Correct!
            const newPlayerSequence = [...playerSequence, cellId];
            setPlayerSequence(newPlayerSequence);
            setCurrentSequenceIndex((prev) => prev + 1);

            if (newPlayerSequence.length === sequence.length) {
               // Level completed!
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
                  setLevel((prev) => prev + 1);
               }, 1000);
            }
         } else {
            // Wrong!
            setStreak(0);
            setGameOver(true);
         }
      },
      [gamePhase, sequence, currentSequenceIndex, playerSequence, level, streak]
   );

   // Start new game
   const startGame = useCallback(() => {
      setGameStarted(true);
      setGameOver(false);
      setLevel(1);
      setScore(0);
      setStreak(0);
      setTotalCorrect(0);
      setGamePhase("waiting");
      initializeGrid();

      // Generate sequence and start showing it
      setTimeout(() => {
         const sequenceLength = settings.sequenceStart;
         const totalCells = settings.gridSize * settings.gridSize;
         const newSequence = [];

         for (let i = 0; i < sequenceLength; i++) {
            const randomCell = Math.floor(Math.random() * totalCells);
            newSequence.push(randomCell);
         }

         setSequence(newSequence);
         setPlayerSequence([]);
         setCurrentSequenceIndex(0);

         // Start showing sequence after setting it
         setTimeout(() => {
            setGamePhase("showing");
            setShowingIndex(-1);

            let index = 0;
            const showNext = () => {
               if (index < newSequence.length) {
                  setShowingIndex(newSequence[index]);

                  setTimeout(() => {
                     setShowingIndex(-1);
                     index++;

                     setTimeout(() => {
                        if (index < newSequence.length) {
                           showNext();
                        } else {
                           // Start memory phase
                           setGamePhase("memorizing");
                           setTimeLeft(Math.floor(settings.memoryTime / 1000));

                           // Start countdown
                           const timer = setInterval(() => {
                              setTimeLeft((prev) => {
                                 if (prev <= 1) {
                                    clearInterval(timer);
                                    setGamePhase("testing");
                                    return 0;
                                 }
                                 return prev - 1;
                              });
                           }, 1000);
                        }
                     }, 200);
                  }, settings.displayTime);
               }
            };

            setTimeout(showNext, 500);
         }, 200);
      }, 500);
   }, [initializeGrid, settings]);

   // Reset game
   const resetGame = useCallback(() => {
      setGameStarted(false);
      setGameOver(false);
      setLevel(1);
      setScore(0);
      setStreak(0);
      setTotalCorrect(0);
      setGamePhase("waiting");
      setSequence([]);
      setPlayerSequence([]);
      setCurrentSequenceIndex(0);
      setShowingIndex(-1);
      setTimeLeft(0);
   }, []);

   // Generate sequence when level changes
   useEffect(() => {
      if (gameStarted && !gameOver && level > 1) {
         setTimeout(() => {
            const sequenceLength = settings.sequenceStart + level - 1;
            const totalCells = settings.gridSize * settings.gridSize;
            const newSequence = [];

            for (let i = 0; i < sequenceLength; i++) {
               const randomCell = Math.floor(Math.random() * totalCells);
               newSequence.push(randomCell);
            }

            setSequence(newSequence);
            setPlayerSequence([]);
            setCurrentSequenceIndex(0);

            setTimeout(() => {
               setGamePhase("showing");
               setShowingIndex(-1);

               let index = 0;
               const showNext = () => {
                  if (index < newSequence.length) {
                     setShowingIndex(newSequence[index]);

                     setTimeout(() => {
                        setShowingIndex(-1);
                        index++;

                        setTimeout(() => {
                           if (index < newSequence.length) {
                              showNext();
                           } else {
                              // Start memory phase
                              setGamePhase("memorizing");
                              setTimeLeft(
                                 Math.floor(settings.memoryTime / 1000)
                              );

                              // Start countdown
                              const timer = setInterval(() => {
                                 setTimeLeft((prev) => {
                                    if (prev <= 1) {
                                       clearInterval(timer);
                                       setGamePhase("testing");
                                       return 0;
                                    }
                                    return prev - 1;
                                 });
                              }, 1000);
                           }
                        }, 200);
                     }, settings.displayTime);
                  }
               };

               setTimeout(showNext, 500);
            }, 1000);
         }, 100);
      }
   }, [level, gameStarted, gameOver, settings]);

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

   const getPhaseMessage = () => {
      switch (gamePhase) {
         case "showing":
            return "👀 Watch the sequence...";
         case "memorizing":
            return `🧠 Memorize the pattern... ${timeLeft}s`;
         case "testing":
            return "🎯 Click the sequence in order!";
         default:
            return "Get ready...";
      }
   };

   const getScoreMessage = () => {
      if (level >= 10) return "🏆 Memory Master!";
      if (level >= 7) return "⭐ Excellent Memory!";
      if (level >= 5) return "👍 Great Job!";
      if (level >= 3) return "💪 Good Start!";
      return "🎯 Keep Trying!";
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
                        <FaBrain className="inline mr-3 text-purple-400" />
                        Memory Test
                     </h1>

                     <div className="w-24"></div>
                  </div>
               </div>

               {!gameStarted ? (
                  /* Start Screen */
                  <div className="w-full max-w-md mx-auto text-center">
                     <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                        <FaBrain className="text-4xl text-purple-400 mb-4 mx-auto" />
                        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                           Memory Test
                        </h2>
                        <p className="text-sm mb-6 text-gray-300">
                           Watch the sequence, then repeat it back in order
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
                                       {difficultySettings[diff].gridSize}×
                                       {difficultySettings[diff].gridSize}
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
                           <FaEye className="text-orange-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">{streak}</div>
                           <div className="text-xs text-gray-400">Streak</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 text-center">
                           <FaClock className="text-blue-400 text-xl mx-auto mb-1" />
                           <div className="text-xl font-bold">
                              {sequence.length}
                           </div>
                           <div className="text-xs text-gray-400">Sequence</div>
                        </div>
                     </div>

                     {!gameOver ? (
                        /* Active Game */
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                           {/* Phase Message */}
                           <div className="text-center mb-5">
                              <div className="text-xl font-bold mb-2">
                                 {getPhaseMessage()}
                              </div>
                              <div className="text-sm text-gray-400">
                                 Level {level} • {difficulty.toUpperCase()}
                              </div>
                           </div>

                           {/* Memory Grid */}
                           <div className="flex justify-center">
                              <div
                                 className={`grid gap-2`}
                                 style={{
                                    gridTemplateColumns: `repeat(${settings.gridSize}, 1fr)`,
                                    width: "fit-content",
                                 }}
                              >
                                 {gridCells.map((cell) => {
                                    const isInSequence = sequence.includes(
                                       cell.id
                                    );

                                    return (
                                       <div
                                          key={cell.id}
                                          onClick={() =>
                                             gamePhase === "testing" &&
                                             handleCellClick(cell.id)
                                          }
                                          className={`
                                             ${
                                                settings.gridSize === 5
                                                   ? "w-14 h-14"
                                                   : "w-16 h-16"
                                             } rounded-lg border-4 transition-all duration-300 relative flex items-center justify-center font-bold text-white
                                             ${
                                                showingIndex === cell.id
                                                   ? `${cell.color.bg} ${cell.color.border} shadow-lg scale-110`
                                                   : gamePhase ===
                                                        "memorizing" &&
                                                     isInSequence
                                                   ? `${cell.color.bg} ${cell.color.border} shadow-lg`
                                                   : playerSequence.includes(
                                                        cell.id
                                                     ) &&
                                                     gamePhase === "testing"
                                                   ? `${cell.color.bg} ${cell.color.border} shadow-lg`
                                                   : "bg-white/20 border-white/30 hover:bg-white/30"
                                             }
                                             ${
                                                gamePhase === "testing"
                                                   ? "cursor-pointer"
                                                   : "cursor-default"
                                             }
                                          `}
                                       ></div>
                                    );
                                 })}
                              </div>
                           </div>

                           {/* Progress */}
                           {gamePhase === "testing" && (
                              <div className="mt-5 text-center">
                                 <div className="text-base mb-2">
                                    Progress: {playerSequence.length} /{" "}
                                    {sequence.length}
                                 </div>
                                 <div className="w-full max-w-sm mx-auto bg-white/20 rounded-full h-2">
                                    <div
                                       className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                                       style={{
                                          width: `${
                                             (playerSequence.length /
                                                sequence.length) *
                                             100
                                          }%`,
                                       }}
                                    />
                                 </div>
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
                                    Levels Passed
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

export default MemoryTestGame;
