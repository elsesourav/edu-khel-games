import { useCallback, useEffect, useState } from "react";
import { FaClock, FaHome, FaPlay, FaRandom, FaStar } from "react-icons/fa";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { matchingQuestions } from "../../data/questions";

const MatchingGame = ({ onBack }) => {
   const [gameStarted, setGameStarted] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [timeLeft, setTimeLeft] = useState(60);
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   // Matching game specific states - grouped related state
   const [shuffledTerms, setShuffledTerms] = useState([]);
   const [shuffledDefinitions, setShuffledDefinitions] = useState([]);
   const [matchedPairs, setMatchedPairs] = useState([]); // Store as {termIndex, defIndex} objects

   // Single state for current selection - avoid contradictions
   const [selection, setSelection] = useState({
      termIndex: null,
      definitionIndex: null,
      status: "none", // 'none', 'term_selected', 'definition_selected', 'both_selected'
   });

   // Single state for all connections - avoid duplication
   const [connections, setConnections] = useState([]);
   const [positions, setPositions] = useState({
      terms: {},
      definitions: {},
   });

   // Function to calculate the fixed height based on longest text
   const calculateFixedHeight = useCallback(() => {
      const currentSet = matchingQuestions[currentQuestion];
      let maxLines = 3;

      currentSet.pairs.forEach((pair) => {
         const termLines = Math.ceil(pair.term.length / 100);
         const defLines = Math.ceil(pair.definition.length / 100);
         maxLines = Math.min(maxLines, termLines, defLines);
      });

      // Base height + (lines * line height) + padding
      return Math.max(50, maxLines * 40);
   }, [currentQuestion]);

   const shuffleItems = useCallback(() => {
      const currentSet = matchingQuestions[currentQuestion];
      const terms = [
         ...currentSet.pairs.map((pair, index) => ({
            ...pair,
            originalIndex: index,
         })),
      ];
      const definitions = [
         ...currentSet.pairs.map((pair, index) => ({
            ...pair,
            originalIndex: index,
         })),
      ];

      // Shuffle both arrays
      for (let i = terms.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [terms[i], terms[j]] = [terms[j], terms[i]];
      }

      for (let i = definitions.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [definitions[i], definitions[j]] = [definitions[j], definitions[i]];
      }

      setShuffledTerms(terms);
      setShuffledDefinitions(definitions);
   }, [currentQuestion]);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < matchingQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setAnswered(false);
         setTimeLeft(60);
         setMatchedPairs([]);
         setSelection({
            termIndex: null,
            definitionIndex: null,
            status: "none",
         });
         setConnections([]);
         setPositions({ terms: {}, definitions: {} });
         shuffleItems();
      } else {
         setShowResult(true);
      }
   }, [currentQuestion, shuffleItems]);

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         handleNextQuestion();
      }
   }, [timeLeft, gameStarted, showResult, answered, handleNextQuestion]);

   // Update all element positions function
   const updateAllPositions = useCallback(() => {
      const container = document.querySelector(".matching-container");
      if (!container) return;

      const newTermPositions = {};
      const newDefinitionPositions = {};
      const containerRect = container.getBoundingClientRect();

      // Update term positions (right edge of terms)
      shuffledTerms.forEach((_, index) => {
         const element = container.querySelector(
            `[data-term-index="${index}"]`
         );
         if (element) {
            const rect = element.getBoundingClientRect();
            newTermPositions[index] = {
               x: rect.right - containerRect.left, // Right edge of term button
               y: rect.top + rect.height / 2 - containerRect.top,
            };
         }
      });

      // Update definition positions (left edge of definitions)
      shuffledDefinitions.forEach((_, index) => {
         const element = container.querySelector(`[data-def-index="${index}"]`);
         if (element) {
            const rect = element.getBoundingClientRect();
            newDefinitionPositions[index] = {
               x: rect.left - containerRect.left, // Left edge of definition button
               y: rect.top + rect.height / 2 - containerRect.top,
            };
         }
      });

      setPositions({
         terms: newTermPositions,
         definitions: newDefinitionPositions,
      });
   }, [shuffledTerms, shuffledDefinitions]);

   useEffect(() => {
      if (gameStarted) {
         shuffleItems();
      }
   }, [gameStarted, currentQuestion, shuffleItems]);

   // Update positions when items are shuffled or layout changes
   useEffect(() => {
      if (shuffledTerms.length > 0 && shuffledDefinitions.length > 0) {
         // Small delay to ensure DOM is updated
         const timeoutId = setTimeout(() => {
            updateAllPositions();
         }, 100);

         window.addEventListener("resize", updateAllPositions);
         return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", updateAllPositions);
         };
      }
   }, [shuffledTerms, shuffledDefinitions, updateAllPositions]);

   const startGame = ({ onBack }) => {
      setGameStarted(true);
      setTimeLeft(60);
      shuffleItems();
   };

   const handleTermClick = (termIndex) => {
      if (matchedPairs.includes(termIndex) || answered) return;

      if (selection.termIndex === termIndex) {
         // Clicking same button twice - unselect
         setSelection({
            termIndex: null,
            definitionIndex: null,
            status: "none",
         });
      } else {
         if (selection.definitionIndex !== null) {
            // Both selections made - check match and clear selections immediately
            checkMatch(termIndex, selection.definitionIndex);
            setSelection({
               termIndex: null,
               definitionIndex: null,
               status: "none",
            });
         } else {
            // Select term
            setSelection({
               termIndex: termIndex,
               definitionIndex: selection.definitionIndex,
               status: "term_selected",
            });
         }
      }
   };

   const handleDefinitionClick = (defIndex) => {
      if (matchedPairs.includes(defIndex) || answered) return;

      if (selection.definitionIndex === defIndex) {
         // Clicking same button twice - unselect
         setSelection({
            termIndex: null,
            definitionIndex: null,
            status: "none",
         });
      } else {
         if (selection.termIndex !== null) {
            // Both selections made - check match and clear selections immediately
            checkMatch(selection.termIndex, defIndex);
            setSelection({
               termIndex: null,
               definitionIndex: null,
               status: "none",
            });
         } else {
            // Select definition
            setSelection({
               termIndex: selection.termIndex,
               definitionIndex: defIndex,
               status: "definition_selected",
            });
         }
      }
   };

   const checkMatch = (termIndex, defIndex) => {
      // Prevent checking already matched pairs
      const isTermMatched = matchedPairs.some(
         (pair) => pair.termIndex === termIndex
      );
      const isDefMatched = matchedPairs.some(
         (pair) => pair.defIndex === defIndex
      );
      if (isTermMatched || isDefMatched) {
         return;
      }

      const term = shuffledTerms[termIndex];
      const definition = shuffledDefinitions[defIndex];

      // Create unique connection ID
      const connectionId = `${Date.now()}-${termIndex}-${defIndex}`;

      if (term.originalIndex === definition.originalIndex) {
         // Correct match - add permanent green connection
         const newConnection = {
            id: connectionId,
            termIndex,
            defIndex,
            type: "correct",
            timestamp: Date.now(),
         };

         setConnections((prev) => [...prev, newConnection]);
         setMatchedPairs((prev) => [...prev, { termIndex, defIndex }]);
         setScore((prev) => prev + 20);
         setCorrectAnswers((prev) => prev + 1);

         // Check if all pairs are matched
         if (matchedPairs.length + 1 >= shuffledTerms.length) {
            setAnswered(true);
            setTimeout(() => {
               handleNextQuestion();
            }, 2000);
         }
      } else {
         // Wrong match - show temporary red connection
         const wrongConnection = {
            id: connectionId,
            termIndex,
            defIndex,
            type: "wrong",
            timestamp: Date.now(),
         };

         setConnections((prev) => [...prev, wrongConnection]);

         // Remove wrong connection after delay
         setTimeout(() => {
            setConnections((prev) =>
               prev.filter((conn) => conn.id !== connectionId)
            );
         }, 1500);
      }
   };

   const ConnectionLines = () => {
      return (
         <svg
            className="absolute inset-0 pointer-events-none z-10"
            style={{ width: "100%", height: "100%" }}
         >
            {connections.map((connection) => {
               const termPos = positions.terms[connection.termIndex];
               const defPos = positions.definitions[connection.defIndex];

               if (!termPos || !defPos) return null;

               const isCorrect = connection.type === "correct";
               const strokeColor = isCorrect ? "#10b981" : "#ef4444"; // green or red
               const strokeWidth = isCorrect ? 3 : 2;

               return (
                  <g key={connection.id}>
                     <line
                        x1={termPos.x}
                        y1={termPos.y}
                        x2={defPos.x}
                        y2={defPos.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 1}
                        strokeDasharray={isCorrect ? "none" : "8,4"}
                        style={{
                           filter: `drop-shadow(0 0 6px ${strokeColor}60)`,
                           strokeLinecap: "round",
                           opacity: isCorrect ? 0.9 : 0.7,
                        }}
                     />
                     {/* Add circles at connection points */}
                     <circle
                        cx={termPos.x}
                        cy={termPos.y}
                        r="4"
                        fill={strokeColor}
                        style={{
                           filter: `drop-shadow(0 0 4px ${strokeColor}80)`,
                           opacity: 0.8,
                        }}
                     />
                     <circle
                        cx={defPos.x}
                        cy={defPos.y}
                        r="4"
                        fill={strokeColor}
                        style={{
                           filter: `drop-shadow(0 0 4px ${strokeColor}80)`,
                           opacity: 0.8,
                        }}
                     />
                  </g>
               );
            })}
         </svg>
      );
   };

   const resetGame = ({ onBack }) => {
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(60);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
      setMatchedPairs([]);
      setSelection({ termIndex: null, definitionIndex: null, status: "none" });
      setConnections([]);
      setPositions({ terms: {}, definitions: {} });
   };

   const getScoreGrade = () => {
      const percentage =
         (correctAnswers / (matchingQuestions.length * 5)) * 100;
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

   if (!gameStarted) {
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-green-900/30 to-emerald-900/40"
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
                     <FaRandom className="text-6xl text-green-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Matching Game
                     </h1>
                     <p className="text-white/80 text-lg mb-6">
                        Match terms with their correct definitions. Click on a
                        term and then its matching definition!
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={startGame}
                        className="shiny-button text-xl font-bold bg-green-500/20 hover:bg-green-500/30 text-white px-8 py-4 rounded-xl border border-green-400/30 transition-all duration-300 flex items-center justify-center gap-3"
                     >
                        <FaPlay className="text-lg" />
                        Start Game
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
      const gradeInfo = getScoreGrade();
      return (
         <div className="min-h-screen relative overflow-hidden">
            <StarfieldCanvas height="100vh" />
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-green-900/30 to-emerald-900/40"
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
                                       (matchingQuestions.length * 2)
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
                        <div className="text-3xl font-bold text-green-400 mb-2">
                           {score}
                        </div>
                        <div className="text-white/80">Total Score</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                           {correctAnswers}/{matchingQuestions.length * 5}
                        </div>
                        <div className="text-white/80">Correct Matches</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                           {Math.round(
                              (correctAnswers /
                                 (matchingQuestions.length * 5)) *
                                 100
                           )}
                           %
                        </div>
                        <div className="text-white/80">Accuracy</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={resetGame}
                        className="shiny-button text-xl font-bold bg-green-500/20 hover:bg-green-500/30 text-white px-8 py-4 rounded-xl border border-green-400/30 transition-all duration-300 flex items-center justify-center gap-3"
                     >
                        <FaPlay className="text-lg" />
                        Play Again
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
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-green-900/30 to-emerald-900/40"
            style={{ zIndex: 2 }}
         ></div>

         <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-4">
                  <button
                     onClick={onBack}
                     className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
                  >
                     <FaHome className="inline mr-2" />
                     Back to Home
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                     Matching Game
                  </h1>
               </div>
               <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                     <FaClock className="text-green-400" />
                     <span className="text-xl font-bold">{timeLeft}s</span>
                  </div>
                  <div className="text-xl font-bold">Score: {score}</div>
                  <div className="text-lg">
                     {currentQuestion + 1}/{matchingQuestions.length}
                  </div>
               </div>
            </div>

            {/* Game Content */}
            <div className="max-w-6xl mx-auto">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mb-6 relative matching-container"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                  }}
               >
                  <ConnectionLines />

                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                     {matchingQuestions[currentQuestion].title}
                  </h2>

                  <p className="text-white/80 text-center mb-8">
                     Click on a term, then click on its matching definition!
                  </p>

                  <div className="grid md:grid-cols-2 gap-16 lg:gap-24 relative z-20">
                     {/* Terms Column */}
                     <div>
                        <h3 className="text-xl font-bold text-green-400 mb-4 text-center">
                           Terms
                        </h3>
                        <div className="space-y-3">
                           {shuffledTerms.map((item, index) => (
                              <button
                                 key={index}
                                 data-term-index={index}
                                 onClick={() => handleTermClick(index)}
                                 disabled={matchedPairs.some(
                                    (pair) => pair.termIndex === index
                                 )}
                                 className={`w-full p-1 rounded-xl border-2 transition-all duration-300 text-left flex items-center ${
                                    matchedPairs.some(
                                       (pair) => pair.termIndex === index
                                    )
                                       ? "bg-green-500/20 border-green-400 text-green-300 cursor-not-allowed"
                                       : selection.termIndex === index
                                       ? "bg-green-500/30 border-green-400 text-white"
                                       : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                                 }`}
                                 style={{
                                    minHeight: `${calculateFixedHeight()}px`,
                                 }}
                              >
                                 <div className="font-semibold w-full">
                                    {item.term}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Definitions Column */}
                     <div>
                        <h3 className="text-xl font-bold text-green-400 mb-4 text-center">
                           Definitions
                        </h3>
                        <div className="space-y-3">
                           {shuffledDefinitions.map((item, index) => (
                              <button
                                 key={index}
                                 data-def-index={index}
                                 onClick={() => handleDefinitionClick(index)}
                                 disabled={matchedPairs.some(
                                    (pair) => pair.defIndex === index
                                 )}
                                 className={`w-full p-1 rounded-xl border-2 transition-all duration-300 text-left flex items-center ${
                                    matchedPairs.some(
                                       (pair) => pair.defIndex === index
                                    )
                                       ? "bg-green-500/20 border-green-400 text-green-300 cursor-not-allowed"
                                       : selection.definitionIndex === index
                                       ? "bg-green-500/30 border-green-400 text-white"
                                       : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                                 }`}
                                 style={{
                                    minHeight: `${calculateFixedHeight()}px`,
                                 }}
                              >
                                 <div className="text-sm">
                                    {item.definition}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-8 text-center">
                     <div className="text-white/80 mb-2">
                        Matched: {matchedPairs.length / 2} /{" "}
                        {shuffledTerms.length}
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                           className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                           style={{
                              width: `${
                                 (matchedPairs.length /
                                    2 /
                                    shuffledTerms.length) *
                                 100
                              }%`,
                           }}
                        ></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MatchingGame;
