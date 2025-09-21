import { useCallback, useEffect, useState } from "react";
import {
   FaCheck,
   FaClock,
   FaHome,
   FaListUl,
   FaPlay,
   FaStar,
   FaTimes,
} from "react-icons/fa";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { msqQuestions } from "../../data/questions";

const MSQGame = ({ onBack }) => {
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [selectedAnswers, setSelectedAnswers] = useState([]);
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [timeLeft, setTimeLeft] = useState(45); // More time for MSQ
   const [gameStarted, setGameStarted] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < msqQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setSelectedAnswers([]);
         setAnswered(false);
         setTimeLeft(45);
      } else {
         setShowResult(true);
      }
   }, [currentQuestion]);

   const handleSubmitAnswer = useCallback(() => {
      if (answered) return;

      setAnswered(true);

      const question = msqQuestions[currentQuestion];
      const correctIndices = question.correct;

      // Check if selected answers match exactly with correct answers
      const isCorrect =
         selectedAnswers.length === correctIndices.length &&
         selectedAnswers.every((index) => correctIndices.includes(index)) &&
         correctIndices.every((index) => selectedAnswers.includes(index));

      if (isCorrect) {
         setScore(score + 15); // Higher points for MSQ
         setCorrectAnswers(correctAnswers + 1);
      }

      setTimeout(() => {
         handleNextQuestion();
      }, 2000); // More time to see results
   }, [
      answered,
      currentQuestion,
      selectedAnswers,
      score,
      correctAnswers,
      handleNextQuestion,
   ]);

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         handleSubmitAnswer();
      }
   }, [timeLeft, gameStarted, showResult, answered, handleSubmitAnswer]);

   const startGame = ({ onBack }) => {
      setGameStarted(true);
      setTimeLeft(45);
   };

   const handleAnswerToggle = (answerIndex) => {
      if (answered) return;

      setSelectedAnswers((prev) => {
         if (prev.includes(answerIndex)) {
            return prev.filter((index) => index !== answerIndex);
         } else {
            return [...prev, answerIndex];
         }
      });
   };

   const resetGame = ({ onBack }) => {
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setScore(0);
      setShowResult(false);
      setTimeLeft(45);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
   };

   const getScoreGrade = () => {
      const percentage = (correctAnswers / msqQuestions.length) * 100;
      if (percentage >= 90)
         return {
            grade: "A+",
            color: "text-green-400",
            message: "Outstanding!",
         };
      if (percentage >= 80)
         return { grade: "A", color: "text-green-300", message: "Excellent!" };
      if (percentage >= 70)
         return { grade: "B", color: "text-blue-400", message: "Well Done!" };
      if (percentage >= 60)
         return {
            grade: "C",
            color: "text-yellow-400",
            message: "Good Effort!",
         };
      return { grade: "D", color: "text-red-400", message: "Keep Practicing!" };
   };

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
                     <FaListUl className="text-6xl text-teal-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Multiple Select Quiz
                     </h1>
                     <p className="text-white/80 text-lg">
                        Select all correct answers from {msqQuestions.length}{" "}
                        questions
                     </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <h3 className="text-white font-semibold mb-4">
                        Game Rules:
                     </h3>
                     <ul className="text-white/80 text-sm space-y-2 text-left">
                        <li>• Each question has 45 seconds</li>
                        <li>• Select ALL correct answers</li>
                        <li>• 15 points per perfect answer</li>
                        <li>• Must get all selections right</li>
                        <li>• Click Submit when ready</li>
                     </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={startGame}
                        className="shiny-button text-xl font-bold"
                     >
                        <FaPlay className="text-lg relative z-10" />
                        <span className="relative z-10">Start Quiz</span>
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
                  <FaStar className="text-6xl text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-2">
                     Quiz Complete!
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
                              {msqQuestions.length}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={resetGame}
                        className="shiny-button text-xl font-bold"
                     >
                        <FaPlay className="text-lg relative z-10" />
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

   const question = msqQuestions[currentQuestion];
   const progress = ((currentQuestion + 1) / msqQuestions.length) * 100;

   return (
      <div className="min-h-screen relative overflow-hidden">
         <StarfieldCanvas height="100vh" />
         <div
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
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
                        timeLeft <= 15 ? "animate-pulse bg-red-500/20" : ""
                     }`}
                  >
                     <FaClock className="inline mr-2 text-white/80" />
                     <span className="text-white font-bold">{timeLeft}s</span>
                  </div>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
               <div className="flex justify-between text-white/80 text-sm mb-2">
                  <span>
                     Question {currentQuestion + 1} of {msqQuestions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
               </div>
               <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                     className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            {/* Question Card */}
            <div className="max-w-4xl mx-auto">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                     boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
               >
                  <div className="flex items-center mb-4">
                     <FaListUl className="text-teal-400 mr-3" />
                     <span className="text-teal-300 font-semibold">
                        Select ALL correct answers
                     </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                     {question.question}
                  </h2>

                  <div className="grid gap-4 mb-6">
                     {question.options.map((option, index) => {
                        let buttonClass =
                           "bg-white/5 hover:bg-white/15 border-white/20 text-white transform hover:scale-[1.02]";
                        let checkboxClass = "border-white/40";

                        if (selectedAnswers.includes(index)) {
                           buttonClass =
                              "bg-teal-500/20 border-teal-400/50 text-white";
                           checkboxClass = "border-teal-400 bg-teal-500";
                        }

                        if (answered) {
                           if (question.correct.includes(index)) {
                              buttonClass =
                                 "bg-green-500/30 border-green-400 text-green-100";
                              checkboxClass = "border-green-400 bg-green-500";
                           } else if (
                              selectedAnswers.includes(index) &&
                              !question.correct.includes(index)
                           ) {
                              buttonClass =
                                 "bg-red-500/30 border-red-400 text-red-100";
                              checkboxClass = "border-red-400 bg-red-500";
                           } else if (
                              !selectedAnswers.includes(index) &&
                              !question.correct.includes(index)
                           ) {
                              buttonClass =
                                 "bg-white/5 border-white/10 text-white/60";
                              checkboxClass = "border-white/20";
                           }
                        }

                        return (
                           <button
                              key={index}
                              onClick={() => handleAnswerToggle(index)}
                              disabled={answered}
                              className={`${buttonClass} border rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-lg backdrop-blur-md`}
                           >
                              <div className="flex items-center">
                                 <div
                                    className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center ${checkboxClass} transition-all duration-200`}
                                 >
                                    {(selectedAnswers.includes(index) ||
                                       (answered &&
                                          question.correct.includes(
                                             index
                                          ))) && (
                                       <FaCheck className="text-white text-xs" />
                                    )}
                                    {answered &&
                                       selectedAnswers.includes(index) &&
                                       !question.correct.includes(index) && (
                                          <FaTimes className="text-white text-xs" />
                                       )}
                                 </div>
                                 <span className="text-lg flex-1">
                                    {option}
                                 </span>
                              </div>
                           </button>
                        );
                     })}
                  </div>

                  {!answered && (
                     <div className="text-center">
                        <button
                           onClick={handleSubmitAnswer}
                           disabled={selectedAnswers.length === 0}
                           className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                              selectedAnswers.length === 0
                                 ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                                 : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg"
                           }`}
                        >
                           Submit Answer ({selectedAnswers.length} selected)
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default MSQGame;
