import { useCallback, useEffect, useState } from "react";
import {
   FaCheck,
   FaClock,
   FaHome,
   FaPlay,
   FaStar,
   FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { mcqQuestions } from "../../data/questions";

const MCQGame = () => {
   const navigate = useNavigate();
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [selectedAnswer, setSelectedAnswer] = useState(null);
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [timeLeft, setTimeLeft] = useState(30);
   const [gameStarted, setGameStarted] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < mcqQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setSelectedAnswer(null);
         setAnswered(false);
         setTimeLeft(30);
      } else {
         setShowResult(true);
      }
   }, [currentQuestion]);

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         handleNextQuestion();
      }
   }, [timeLeft, gameStarted, showResult, answered, handleNextQuestion]);

   const startGame = () => {
      setGameStarted(true);
      setTimeLeft(30);
   };

   const handleAnswerClick = (answerIndex) => {
      if (answered) return;

      setSelectedAnswer(answerIndex);
      setAnswered(true);

      const isCorrect = answerIndex === mcqQuestions[currentQuestion].correct;
      if (isCorrect) {
         setScore(score + 10);
         setCorrectAnswers(correctAnswers + 1);
      }

      setTimeout(() => {
         handleNextQuestion();
      }, 1500);
   };

   const resetGame = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setShowResult(false);
      setTimeLeft(30);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
   };

   const getScoreGrade = () => {
      const percentage = (correctAnswers / mcqQuestions.length) * 100;
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
                     <FaCheck className="text-6xl text-blue-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        Multiple Choice Quiz
                     </h1>
                     <p className="text-white/80 text-lg">
                        Test your knowledge with {mcqQuestions.length} questions
                     </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                     <h3 className="text-white font-semibold mb-4">
                        Game Rules:
                     </h3>
                     <ul className="text-white/80 text-sm space-y-2 text-left">
                        <li>• Each question has 30 seconds</li>
                        <li>• Choose the best answer</li>
                        <li>• 10 points per correct answer</li>
                        <li>• No negative marking</li>
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
                              {mcqQuestions.length}
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

   const question = mcqQuestions[currentQuestion];
   const progress = ((currentQuestion + 1) / mcqQuestions.length) * 100;

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
                  onClick={() => navigate("/")}
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
                        timeLeft <= 10 ? "animate-pulse bg-red-500/20" : ""
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
                     Question {currentQuestion + 1} of {mcqQuestions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
               </div>
               <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                     className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            {/* Question Card */}
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
                     <h2
                        className="text-2xl font-bold text-white mb-6 leading-relaxed drop-shadow-2xl"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                     >
                        {question.question}
                     </h2>

                     <div className="grid gap-4">
                        {question.options.map((option, index) => {
                           let buttonClass =
                              "border border-white/50 text-white hover:border-white/70";
                           let buttonStyle = {
                              background: "rgba(0, 0, 0, 0.3)",
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.4)",
                           };

                           if (answered) {
                              if (index === question.correct) {
                                 buttonClass =
                                    "border border-green-400 text-green-100";
                                 buttonStyle = {
                                    background: "rgba(34, 197, 94, 0.25)",
                                    backdropFilter: "blur(10px)",
                                    boxShadow:
                                       "0 4px 16px 0 rgba(34, 197, 94, 0.4)",
                                 };
                              } else if (
                                 index === selectedAnswer &&
                                 index !== question.correct
                              ) {
                                 buttonClass =
                                    "border border-red-400 text-red-100";
                                 buttonStyle = {
                                    background: "rgba(239, 68, 68, 0.25)",
                                    backdropFilter: "blur(10px)",
                                    boxShadow:
                                       "0 4px 16px 0 rgba(239, 68, 68, 0.4)",
                                 };
                              } else {
                                 buttonClass =
                                    "border border-white/30 text-white/70";
                                 buttonStyle = {
                                    background: "rgba(0, 0, 0, 0.2)",
                                    backdropFilter: "blur(5px)",
                                    boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.3)",
                                 };
                              }
                           }

                           return (
                              <button
                                 key={index}
                                 onClick={() => handleAnswerClick(index)}
                                 disabled={answered}
                                 className={`${buttonClass} rounded-2xl p-5 text-left transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group`}
                                 style={buttonStyle}
                              >
                                 {/* Dark glass effect overlay */}
                                 <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/1 to-transparent opacity-20 rounded-2xl"></div>

                                 {/* Hover shine effect */}
                                 <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-12"></div>

                                 <div className="relative z-10 flex items-center justify-between">
                                    <span
                                       className="text-lg font-medium drop-shadow-lg"
                                       style={{
                                          textShadow:
                                             "1px 1px 2px rgba(0,0,0,0.8)",
                                       }}
                                    >
                                       {option}
                                    </span>
                                    {answered && index === question.correct && (
                                       <FaCheck className="text-green-300 text-xl drop-shadow-lg" />
                                    )}
                                    {answered &&
                                       index === selectedAnswer &&
                                       index !== question.correct && (
                                          <FaTimes className="text-red-300 text-xl drop-shadow-lg" />
                                       )}
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MCQGame;
