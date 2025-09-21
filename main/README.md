# 🎮 Edu Khel Games - Educational Gaming Platform

An interactive educational gaming platform built with React and Vite, featuring multiple game types designed to enhance learning through gamification.

## 🌟 Features

-  **10+ Educational Games** - Diverse game types covering various subjects
-  **Modern UI/UX** - Glass morphism design with animated backgrounds
-  **Responsive Design** - Works seamlessly on desktop and mobile devices
-  **Real-time Scoring** - Track progress and achievements
-  **Multiple Difficulty Levels** - Adaptive learning experience

## 🎯 Available Games

### 🧠 **Cognitive & Memory Games**

-  **🧩 Pattern Puzzle** - Complete mathematical sequences and patterns
-  **🧠 Memory Test** - Remember and recall color sequences
-  **⏰ Time Rush** - Quick-fire questions with time pressure

### 📚 **Educational Content Games**

-  **❓ MCQ (Multiple Choice)** - Single correct answer questions
-  **✅ MSQ (Multiple Select)** - Multiple correct answers
-  **✓/✗ True/False Quiz** - Binary choice questions with explanations
-  **🔗 Matching Game** - Connect related items together
-  **🧩 Crossword Puzzle** - Fill crosswords with correct words
-  **🔤 Word Scramble** - Unscramble letters to form words

### 🎪 **Interactive & Fun Games**

-  **🎈 Balloon Drop** - 3D balloon popping with quiz elements

## 🛠️ Technology Stack

-  **Frontend Framework**: React 19.1.1
-  **Build Tool**: Vite 7.1.6
-  **Styling**: Tailwind CSS 4.1.13
-  **3D Graphics**: Three.js + React Three Fiber
-  **Routing**: React Router DOM 7.9.1
-  **Icons**: React Icons 5.5.0

## 🚀 Getting Started

### Prerequisites

-  Node.js (v18 or higher)
-  npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd games/main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📦 Build & Deployment

### Development

```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Production Build

```bash
npm run build        # Build for production
```

The build outputs to the root directory (`../`) for easy GitHub Pages hosting.

### GitHub Pages Deployment

1. Build the project: `npm run build`
2. Commit the generated assets to your repository
3. Enable GitHub Pages in repository settings
4. Set source to root directory

## 🎮 Game Features

### 🧩 Pattern Puzzle

-  **10 Pattern Types**: Arithmetic, Geometric, Fibonacci, Squares, Cubes, Primes, Multiples, Powers, Alphabet, Factorials
-  **Random Missing Position**: Missing element can be anywhere in sequence
-  **Visual Feedback**: Shows correct answer when answered right
-  **Progressive Difficulty**: Increasing sequence length

### 🧠 Memory Test

-  **Color Sequences**: Remember patterns of colored squares
-  **Compact Grid**: Optimized 5x5 layout for harder difficulties
-  **Level Progression**: Sequences get longer as you advance
-  **Streak Tracking**: Bonus points for consecutive correct answers

### ⏰ Time Rush

-  **Timed Challenges**: Answer before time runs out
-  **Multiple Subjects**: Math, Science, General Knowledge
-  **Difficulty Scaling**: Questions get harder with each level
-  **Score Multipliers**: Higher difficulty = more points

## 🏗️ Project Structure

```
main/
├── public/                 # Static assets
│   └── icon.png           # App icon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── GameCard.jsx   # Game selection cards
│   │   ├── Home.jsx       # Main homepage
│   │   └── StarfieldCanvas.jsx # Animated background
│   ├── games/            # Individual game components
│   │   ├── PatternPuzzle/
│   │   ├── MemoryTest/
│   │   ├── MCQ/
│   │   └── ...           # Other games
│   ├── data/
│   │   └── questions.js  # Question datasets
│   └── assets/           # Images, styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md            # This file
```

## 🎨 Design Philosophy

-  **Glass Morphism UI**: Modern, translucent design elements
-  **Animated Backgrounds**: Dynamic starfield and gradient effects
-  **Consistent Theming**: Purple/pink gradient color scheme
-  **Accessibility**: WCAG compliant color contrasts and interactions
-  **Mobile-First**: Responsive design for all screen sizes

## 🔧 Configuration

### Vite Configuration

-  **Output Directory**: Builds to root folder for GitHub Pages
-  **Plugins**: React, Tailwind CSS
-  **Hot Module Replacement**: Fast development experience

### Build Process

-  Automatically clears previous build assets
-  Optimizes for production deployment
-  Generates static files for hosting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Educational Goals

-  **Pattern Recognition**: Mathematical sequences and logical thinking
-  **Memory Enhancement**: Visual and sequential memory training
-  **Quick Thinking**: Time-pressure decision making
-  **Subject Knowledge**: Curriculum-based question content
-  **Problem Solving**: Multiple approaches to finding solutions

## 🚀 Future Enhancements

-  [ ] User accounts and progress tracking
-  [ ] Leaderboards and competitions
-  [ ] More game types (Physics simulations, Math graphing)
-  [ ] Multiplayer capabilities
-  [ ] Teacher dashboard for classroom use
-  [ ] Analytics and learning insights

---

**Made with ❤️ for education and fun learning!**
