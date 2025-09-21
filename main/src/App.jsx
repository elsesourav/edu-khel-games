import { useState } from "react";
import GamePlaceholder from "./components/GamePlaceholder.jsx";
import Home from "./components/Home.jsx";
import BalloonDropGame from "./games/BalloonDrop/BalloonDropGame.jsx";
import CrosswordGame from "./games/Crossword/CrosswordGame.jsx";
import MCQGame from "./games/MCQ/MCQGame.jsx";
import MSQGame from "./games/MSQ/MSQGame.jsx";
import MatchingGame from "./games/Matching/MatchingGame.jsx";
import MemoryTestGame from "./games/MemoryTest/MemoryTestGame.jsx";
import PatternPuzzleGame from "./games/PatternPuzzle/PatternPuzzleGame.jsx";
import TimeRushGame from "./games/TimeRush/TimeRushGame.jsx";
import TrueFalseGame from "./games/TrueFalse/TrueFalseGame.jsx";
import WordScrambleGame from "./games/WordScramble/WordScrambleGame.jsx";

function App() {
   const [currentGame, setCurrentGame] = useState("home");

   const navigateToGame = (gameName) => {
      setCurrentGame(gameName);
   };

   const navigateToHome = () => {
      setCurrentGame("home");
   };

   const renderCurrentView = () => {
      switch (currentGame) {
         case "home":
            return <Home onNavigateToGame={navigateToGame} />;
         case "mcq":
            return <MCQGame onBack={navigateToHome} />;
         case "msq":
            return <MSQGame onBack={navigateToHome} />;
         case "matching":
            return <MatchingGame onBack={navigateToHome} />;
         case "crossword":
            return <CrosswordGame onBack={navigateToHome} />;
         case "word-scramble":
            return <WordScrambleGame onBack={navigateToHome} />;
         case "true-false":
            return <TrueFalseGame onBack={navigateToHome} />;
         case "balloon-drop":
            return <BalloonDropGame onBack={navigateToHome} />;
         case "time-rush":
            return <TimeRushGame onBack={navigateToHome} />;
         case "memory-test":
            return <MemoryTestGame onBack={navigateToHome} />;
         case "pattern-puzzle":
            return <PatternPuzzleGame onBack={navigateToHome} />;
         default:
            return (
               <GamePlaceholder
                  gameName={currentGame}
                  onBack={navigateToHome}
               />
            );
      }
   };

   return <div className="min-h-screen">{renderCurrentView()}</div>;
}

export default App;
