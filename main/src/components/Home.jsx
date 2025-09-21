import {
   FaBolt,
   FaBrain,
   FaBullseye,
   FaCalculator,
   FaCheckSquare,
   FaChevronUp,
   FaClock,
   FaDice,
   FaHeart,
   FaLink,
   FaListUl,
   FaMousePointer,
   FaPizzaSlice,
   FaPlay,
   FaPuzzlePiece,
   FaQuestionCircle,
   FaRandom,
   FaRuler,
   FaTh,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import iconImage from "../assets/imgs/icon.png";
import GameCard from "./GameCard";
import "./ShinyButton.css";
import StarfieldCanvas from "./StarfieldCanvas";

const Home = () => {
   const navigate = useNavigate();

   const games = [
      {
         id: 6,
         name: "Balloon Drop",
         title: "Balloon Drop",
         description: "Pop balloons with correct answers",
         icon: FaBullseye,
         textColor: "text-purple-600",
      },
      {
         id: 4,
         name: "Crossword",
         title: "Crossword Puzzle",
         description: "Fill in the crossword with correct words",
         icon: FaTh,
         textColor: "text-green-600",
      },
      {
         id: 9,
         name: "word-scramble",
         title: "Word Scramble",
         description: "Unscramble letters to form correct words",
         icon: FaRandom,
         textColor: "text-cyan-600",
      },
      {
         id: 7,
         name: "Time Rush",
         title: "Time Rush",
         description: "Answer questions quickly before time runs out",
         icon: FaClock,
         textColor: "text-red-600",
      },
      {
         id: 8,
         name: "Memory Test",
         title: "Memory Test",
         description: "Remember and recall information",
         icon: FaBrain,
         textColor: "text-indigo-600",
      },
      {
         id: 3,
         name: "Matching",
         title: "Matching Game",
         description: "Match related items together",
         icon: FaLink,
         textColor: "text-blue-600",
      },
      {
         id: 1,
         name: "MCQ",
         title: "Multiple Choice Questions",
         description: "Choose the correct answer from given options",
         icon: FaCheckSquare,
         textColor: "text-red-600",
      },
      {
         id: 2,
         name: "MSQ",
         title: "Multiple Select Questions",
         description: "Select all correct answers from options",
         icon: FaListUl,
         textColor: "text-teal-600",
      },
      {
         id: 5,
         name: "true-false",
         title: "True or False Quiz",
         description: "Quick true or false questions with explanations",
         icon: FaQuestionCircle,
         textColor: "text-yellow-600",
      },
      {
         id: 10,
         name: "Drag & Drop",
         title: "Drag & Drop",
         description: "Drag items to their correct positions",
         icon: FaMousePointer,
         textColor: "text-pink-600",
      },
      {
         id: 11,
         name: "Equation Builder",
         title: "Equation Builder",
         description: "Build mathematical equations step by step",
         icon: FaCalculator,
         textColor: "text-orange-600",
      },
      {
         id: 12,
         name: "Math Bingo",
         title: "Math Bingo",
         description: "Solve math problems to complete bingo",
         icon: FaDice,
         textColor: "text-violet-600",
      },
      {
         id: 13,
         name: "Pattern Puzzle",
         title: "Pattern Puzzle",
         description: "Find the pattern and complete the sequence",
         icon: FaPuzzlePiece,
         textColor: "text-slate-600",
      },
      {
         id: 14,
         name: "Fraction Pizza",
         title: "Fraction Pizza",
         description: "Learn fractions with pizza slices",
         icon: FaPizzaSlice,
         textColor: "text-amber-600",
      },
      {
         id: 15,
         name: "Energy Match",
         title: "Energy Match",
         description: "Match different forms of energy",
         icon: FaBolt,
         textColor: "text-emerald-600",
      },
      {
         id: 16,
         name: "Word Ladder",
         title: "Word Ladder",
         description: "Transform one word to another by changing letters",
         icon: FaChevronUp,
         textColor: "text-rose-600",
      },
      {
         id: 17,
         name: "Body Organ Match",
         title: "Body Organ Match",
         description: "Match organs with their functions",
         icon: FaHeart,
         textColor: "text-red-600",
      },
      {
         id: 18,
         name: "Geometry Dash",
         title: "Geometry Dash",
         description: "Navigate through geometric shapes and obstacles",
         icon: FaRuler,
         textColor: "text-teal-600",
      },
   ];

   const handleGameClick = (gameName) => {
      navigate(`/game/${gameName.toLowerCase().replace(/\s+/g, "-")}`);
   };

   return (
      <div className="w-full min-h-screen">
         {/* Hero Section */}
         <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10">
               <header className="text-center py-20 px-6">
                  <div className="flex items-center justify-center mb-8">
                     <img
                        src={iconImage}
                        alt="Edu Khel Games Icon"
                        className="w-16 h-16 mr-4 drop-shadow-2xl"
                     />
                     <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl bg-gradient-to-r from-orange-500 via-white to-green-600 bg-clip-text text-transparent">
                        Edu Khel Games
                     </h1>
                  </div>
                  <p className="text-xl md:text-2xl text-white opacity-95 max-w-3xl mx-auto leading-relaxed mb-10">
                     Discover 18 interactive games designed to make learning fun
                     and engaging for students
                  </p>
                  <div className="mt-8">
                     <div className="inline-flex items-center px-8 py-4 bg-white bg-opacity-30 backdrop-blur-md rounded-full text-white border border-white border-opacity-30 shadow-xl">
                        <FaPlay className="mr-3 text-lg text-purple-600" />
                        <span className="font-semibold text-lg text-indigo-800">
                           Choose Your Adventure Below
                        </span>
                     </div>
                  </div>
               </header>
            </div>
         </div>

         {/* Games Grid Section */}
         <div className="relative py-20 px-6 overflow-hidden min-h-screen">
            {/* Animated 3D Starfield Canvas Background */}
            <StarfieldCanvas height="100%" />
            {/* Background Overlay for better glass effect visibility */}
            <div
               className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-purple-900/40"
               style={{ zIndex: 2 }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                     Interactive Learning Games
                  </h2>
                  <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
                     Each game is carefully designed to enhance different
                     learning skills across various subjects
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {games.map((game) => (
                     <GameCard
                        key={game.id}
                        game={game}
                        onClick={(selectedGame) =>
                           handleGameClick(selectedGame.name)
                        }
                        variant="glass"
                        showPlayButton={true}
                     />
                  ))}
               </div>

               {/* Apple Glass Stats Section */}
               <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-xl">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-80 rounded-2xl"></div>
                     <div className="relative z-10">
                        <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                           18
                        </div>
                        <div className="text-white/80 font-medium">
                           Interactive Games
                        </div>
                     </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-xl relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-80 rounded-2xl"></div>
                     <div className="relative z-10">
                        <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                           4
                        </div>
                        <div className="text-white/80 font-medium">
                           Subject Areas
                        </div>
                     </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-xl relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-80 rounded-2xl"></div>
                     <div className="relative z-10">
                        <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                           3
                        </div>
                        <div className="text-white/80 font-medium">
                           Grade Levels
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Home;
