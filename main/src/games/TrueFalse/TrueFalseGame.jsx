import { useCallback, useEffect, useState } from "react";
import {
   FaCheck,
   FaClock,
   FaHome,
   FaPlay,
   FaQuestionCircle,
   FaStar,
   FaTimes,
} from "react-icons/fa";
import "../../components/ShinyButton.css";
import StarfieldCanvas from "../../components/StarfieldCanvas";
import { trueFalseQuestions } from "../../data/questions";

const TrueFalseGame = ({ onBack }) => {
   const [gameStarted, setGameStarted] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [answered, setAnswered] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);
   const [userAnswer, setUserAnswer] = useState(null);

   const handleNextQuestion = useCallback(() => {
      if (currentQuestion + 1 < trueFalseQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
         setAnswered(false);
         setUserAnswer(null);
         setTimeLeft(30);
      } else {
         setShowResult(true);
      }
   }, [currentQuestion]);

   const handleAnswer = useCallback(
      (answer) => {
         if (answered) return;

         setUserAnswer(answer);
         const currentQ = trueFalseQuestions[currentQuestion];
         const isCorrect = answer === currentQ.answer;

         if (isCorrect) {
            const timeBonus = timeLeft * 2; // More time bonus for quick answers
            const questionScore = 50 + timeBonus;
            setScore(score + questionScore);
            setCorrectAnswers(correctAnswers + 1);
         }

         setAnswered(true);
         setTimeout(() => {
            handleNextQuestion();
         }, 2000);
      },
      [
         answered,
         currentQuestion,
         timeLeft,
         score,
         correctAnswers,
         handleNextQuestion,
      ]
   );

   // Timer effect
   useEffect(() => {
      if (gameStarted && !showResult && timeLeft > 0 && !answered) {
         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
         return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !answered) {
         setAnswered(true);
         setTimeout(() => {
            handleNextQuestion();
         }, 2000);
      }
   }, [timeLeft, gameStarted, showResult, answered, handleNextQuestion]);

   const startGame = ({ onBack }) => {
      setGameStarted(true);
      setTimeLeft(30);
   };

   const resetGame = ({ onBack }) => {
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(30);
      setGameStarted(false);
      setAnswered(false);
      setCorrectAnswers(0);
      setUserAnswer(null);
   };

   const getScoreGrade = () => {
      const percentage = (correctAnswers / trueFalseQuestions.length) * 100;
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
                     <FaQuestionCircle className="text-6xl text-purple-400 mx-auto mb-4" />
                     <h1 className="text-4xl font-bold text-white mb-4">
                        True or False Quiz
                     </h1>
                     <p className="text-white/80 text-lg mb-6">
                        Quick true or false questions! Answer fast for bonus
                        points. You have 30 seconds per question.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={startGame}
                        className="shiny-button text-xl font-bold bg-purple-500/20 hover:bg-purple-500/30 text-white px-8 py-4 rounded-xl border border-purple-400/30 transition-all duration-300 flex items-center justify-center gap-3"
                     >
                        <FaPlay className="text-lg" />
                        Start Quiz
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
                                       (trueFalseQuestions.length / 3)
                                 )
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                              }`}
                           />
                        ))}
                     </div>
                     <h2 className="text-4xl font-bold text-white mb-4">
                        Quiz Complete!
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
                        <div className="text-3xl font-bold text-green-400 mb-2">
                           {correctAnswers}
                        </div>
                        <div className="text-white/80">Correct Answers</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-red-400 mb-2">
                           {trueFalseQuestions.length - correctAnswers}
                        </div>
                        <div className="text-white/80">Wrong Answers</div>
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

   const currentQ = trueFalseQuestions[currentQuestion];

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
                     onClick={onBack}
                     className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-white/20"
                  >
                     <FaHome className="inline mr-2" />
                     Back to Home
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                     True or False Quiz
                  </h1>
               </div>
               <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                     <FaClock className="text-purple-400" />
                     <span
                        className={`text-xl font-bold ${
                           timeLeft <= 10 ? "text-red-400 animate-pulse" : ""
                        }`}
                     >
                        {timeLeft}s
                     </span>
                  </div>
                  <div className="text-xl font-bold">Score: {score}</div>
                  <div className="text-lg">
                     {currentQuestion + 1}/{trueFalseQuestions.length}
                  </div>
               </div>
            </div>

            {/* Game Content */}
            <div className="max-w-4xl mx-auto">
               <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                  style={{
                     background: "rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(20px)",
                     boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
               >
                  {/* Category */}
                  <div className="text-center mb-6">
                     <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold">
                        {currentQ.category}
                     </span>
                  </div>

                  {/* Question */}
                  <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-white mb-6 leading-relaxed">
                        {currentQ.question}
                     </h2>
                  </div>

                  {/* Answer Buttons */}
                  {!answered ? (
                     <div className="flex justify-center gap-8 mb-6">
                        <button
                           onClick={() => handleAnswer(true)}
                           className="group relative px-12 py-6 text-2xl font-bold bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl border-2 border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105"
                        >
                           <FaCheck className="inline mr-3 text-3xl" />
                           TRUE
                           <div className="absolute inset-0 bg-green-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <button
                           onClick={() => handleAnswer(false)}
                           className="group relative px-12 py-6 text-2xl font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border-2 border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105"
                        >
                           <FaTimes className="inline mr-3 text-3xl" />
                           FALSE
                           <div className="absolute inset-0 bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                     </div>
                  ) : (
                     <div className="text-center mb-6">
                        <div
                           className={`p-6 rounded-xl border-2 ${
                              userAnswer === currentQ.answer
                                 ? "bg-green-500/20 border-green-400 text-green-300"
                                 : "bg-red-500/20 border-red-400 text-red-300"
                           }`}
                        >
                           {userAnswer === currentQ.answer ? (
                              <div>
                                 <FaCheck className="inline text-3xl mb-3" />
                                 <p className="text-2xl font-bold mb-2">
                                    Correct!
                                 </p>
                                 <p className="text-lg">
                                    {currentQ.explanation}
                                 </p>
                              </div>
                           ) : (
                              <div>
                                 <FaTimes className="inline text-3xl mb-3" />
                                 <p className="text-2xl font-bold mb-2">
                                    Incorrect!
                                 </p>
                                 <p className="text-lg mb-2">
                                    The correct answer is:{" "}
                                    <strong>
                                       {currentQ.answer ? "TRUE" : "FALSE"}
                                    </strong>
                                 </p>
                                 <p className="text-lg">
                                    {currentQ.explanation}
                                 </p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-8">
                     <div className="flex justify-between text-white/60 text-sm mb-2">
                        <span>Progress</span>
                        <span>
                           {currentQuestion + 1} of {trueFalseQuestions.length}
                        </span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                           className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
                           style={{
                              width: `${
                                 ((currentQuestion + 1) /
                                    trueFalseQuestions.length) *
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

export default TrueFalseGame;
