import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
   return (
      <Router>
         <div className="min-h-screen">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/game/mcq" element={<MCQGame />} />
               <Route path="/game/msq" element={<MSQGame />} />
               <Route path="/game/matching" element={<MatchingGame />} />
               <Route path="/game/crossword" element={<CrosswordGame />} />
               <Route
                  path="/game/word-scramble"
                  element={<WordScrambleGame />}
               />
               <Route path="/game/true-false" element={<TrueFalseGame />} />
               <Route path="/game/balloon-drop" element={<BalloonDropGame />} />
               <Route path="/game/time-rush" element={<TimeRushGame />} />
               <Route path="/game/memory-test" element={<MemoryTestGame />} />
               <Route
                  path="/game/pattern-puzzle"
                  element={<PatternPuzzleGame />}
               />
               <Route path="/game/:gameName" element={<GamePlaceholder />} />
            </Routes>
         </div>
      </Router>
   );
}

export default App;
