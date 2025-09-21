import { useNavigate, useParams } from "react-router-dom";

const GamePlaceholder = () => {
   const navigate = useNavigate();
   const { gameName } = useParams();

   const gameInfo = {
      "balloon-drop": {
         title: "Balloon Drop",
         icon: "🎈",
         description: "Pop balloons with correct answers",
      },
      crossword: {
         title: "Crossword Puzzle",
         icon: "📝",
         description: "Fill in the crossword with correct words",
      },
      "hint-&-guess": {
         title: "Hint & Guess",
         icon: "💡",
         description: "Guess the word from given hints",
      },
      "time-rush": {
         title: "Time Rush",
         icon: "⏰",
         description: "Answer questions quickly before time runs out",
      },
      "memory-test": {
         title: "Memory Test",
         icon: "🧠",
         description: "Remember and recall information",
      },
      "jumble-correction": {
         title: "Jumble Correction",
         icon: "🔀",
         description: "Unscramble jumbled words or sentences",
      },
      "drag-&-drop": {
         title: "Drag & Drop",
         icon: "👆",
         description: "Drag items to their correct positions",
      },
      "equation-builder": {
         title: "Equation Builder",
         icon: "🧮",
         description: "Build mathematical equations step by step",
      },
      "math-bingo": {
         title: "Math Bingo",
         icon: "🎲",
         description: "Solve math problems to complete bingo",
      },
      "pattern-puzzle": {
         title: "Pattern Puzzle",
         icon: "🧩",
         description: "Find the pattern and complete the sequence",
      },
      "fraction-pizza": {
         title: "Fraction Pizza",
         icon: "🍕",
         description: "Learn fractions with pizza slices",
      },
      "energy-match": {
         title: "Energy Match",
         icon: "⚡",
         description: "Match different forms of energy",
      },
      "word-ladder": {
         title: "Word Ladder",
         icon: "🪜",
         description: "Transform one word to another by changing letters",
      },
      "body-organ-match": {
         title: "Body Organ Match",
         icon: "🫀",
         description: "Match organs with their functions",
      },
      "geometry-dash": {
         title: "Geometry Dash",
         icon: "📐",
         description: "Navigate through geometric shapes and obstacles",
      },
   };

   const currentGame = gameInfo[gameName] || {
      title: "Game",
      icon: "🎮",
      description: "Fun educational game",
   };

   return (
      <div className="max-w-4xl mx-auto p-5 min-h-screen">
         <div className="bg-white rounded-2xl p-10 shadow-2xl text-center max-w-2xl mx-auto mt-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
               {currentGame.icon} {currentGame.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
               {currentGame.description}
            </p>

            <div className="my-8 p-5 bg-gray-50 rounded-xl">
               <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  🚧 Coming Soon! 🚧
               </h3>
               <p className="text-gray-600 mb-4">
                  This game is currently under development. We're working hard
                  to bring you an amazing gaming experience!
               </p>
               <p className="text-sm text-gray-500 mt-4">
                  In the meantime, try our fully functional games:{" "}
                  <strong className="text-blue-600">MCQ</strong>,{" "}
                  <strong className="text-blue-600">MSQ</strong>, and{" "}
                  <strong className="text-blue-600">Matching</strong>!
               </p>
            </div>

            <button
               className="bg-gray-600 text-white py-3 px-6 rounded-2xl text-base hover:bg-gray-700 transition-colors"
               onClick={() => navigate("/")}
            >
               ← Back to Home
            </button>
         </div>
      </div>
   );
};

export default GamePlaceholder;
