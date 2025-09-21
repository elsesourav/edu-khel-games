// Question datasets for different subjects and classes
export const questionSets = {
   math: {
      class6: [
         {
            id: 1,
            question: "What is 15 × 8?",
            options: ["120", "125", "130", "115"],
            correct: 0,
            type: "mcq",
         },
         {
            id: 2,
            question: "Which of the following are prime numbers?",
            options: ["2", "9", "11", "15"],
            correct: [0, 2],
            type: "msq",
         },
         {
            id: 3,
            question: "What is 3/4 + 1/4?",
            options: ["1", "4/8", "2/4", "1/2"],
            correct: 0,
            type: "mcq",
         },
      ],
      class7: [
         {
            id: 4,
            question: "Solve: 2x + 5 = 15",
            options: ["x = 5", "x = 10", "x = 7", "x = 3"],
            correct: 0,
            type: "mcq",
         },
         {
            id: 5,
            question:
               "What is the area of a rectangle with length 8 cm and width 5 cm?",
            options: ["40 sq cm", "26 sq cm", "13 sq cm", "35 sq cm"],
            correct: 0,
            type: "mcq",
         },
      ],
      class8: [
         {
            id: 6,
            question: "What is √64?",
            options: ["6", "7", "8", "9"],
            correct: 2,
            type: "mcq",
         },
         {
            id: 7,
            question: "Which are perfect squares?",
            options: ["16", "20", "25", "30"],
            correct: [0, 2],
            type: "msq",
         },
      ],
   },
   science: {
      class6: [
         {
            id: 8,
            question: "What is the main source of energy for plants?",
            options: ["Water", "Sunlight", "Soil", "Air"],
            correct: 1,
            type: "mcq",
         },
         {
            id: 9,
            question: "Which of the following are states of matter?",
            options: ["Solid", "Liquid", "Gas", "Energy"],
            correct: [0, 1, 2],
            type: "msq",
         },
      ],
      class7: [
         {
            id: 10,
            question: "What is the chemical formula for water?",
            options: ["CO2", "H2O", "O2", "NaCl"],
            correct: 1,
            type: "mcq",
         },
      ],
      class8: [
         {
            id: 11,
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Earth", "Mercury", "Mars"],
            correct: 2,
            type: "mcq",
         },
      ],
   },
   english: {
      class6: [
         {
            id: 12,
            question: "Choose the correct spelling:",
            options: ["Recieve", "Receive", "Receve", "Receeve"],
            correct: 1,
            type: "mcq",
         },
         {
            id: 13,
            question: "Which are nouns?",
            options: ["Table", "Run", "Beautiful", "Book"],
            correct: [0, 3],
            type: "msq",
         },
      ],
      class7: [
         {
            id: 14,
            question: "What is the past tense of 'go'?",
            options: ["Goed", "Went", "Gone", "Going"],
            correct: 1,
            type: "mcq",
         },
      ],
      class8: [
         {
            id: 15,
            question:
               "Identify the adjective in: 'The beautiful flower bloomed.'",
            options: ["The", "Beautiful", "Flower", "Bloomed"],
            correct: 1,
            type: "mcq",
         },
      ],
   },
   social: {
      class6: [
         {
            id: 16,
            question: "What is the capital of India?",
            options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
            correct: 1,
            type: "mcq",
         },
      ],
      class7: [
         {
            id: 17,
            question: "Who was the first President of India?",
            options: [
               "Jawaharlal Nehru",
               "Dr. Rajendra Prasad",
               "Mahatma Gandhi",
               "Sardar Patel",
            ],
            correct: 1,
            type: "mcq",
         },
      ],
      class8: [
         {
            id: 18,
            question: "Which river is known as the Ganga of the South?",
            options: ["Krishna", "Godavari", "Kaveri", "Narmada"],
            correct: 2,
            type: "mcq",
         },
      ],
   },
};

// Matching pairs for matching games
export const matchingData = {
   math: [
      { left: "2 + 2", right: "4" },
      { left: "5 × 3", right: "15" },
      { left: "10 ÷ 2", right: "5" },
      { left: "3²", right: "9" },
   ],
   science: [
      { left: "H2O", right: "Water" },
      { left: "CO2", right: "Carbon Dioxide" },
      { left: "O2", right: "Oxygen" },
      { left: "NaCl", right: "Salt" },
   ],
   english: [
      { left: "Happy", right: "Joyful" },
      { left: "Big", right: "Large" },
      { left: "Fast", right: "Quick" },
      { left: "Smart", right: "Intelligent" },
   ],
   social: [
      { left: "Delhi", right: "Capital of India" },
      { left: "Ganges", right: "Holy River" },
      { left: "Taj Mahal", right: "Wonder of the World" },
      { left: "1947", right: "Independence Year" },
   ],
};

// Word puzzles for crossword and word games
export const wordPuzzles = {
   math: {
      words: ["ADDITION", "SUBTRACT", "MULTIPLY", "DIVIDE", "FRACTION"],
      clues: [
         "Process of combining numbers",
         "Taking away numbers",
         "Repeated addition",
         "Splitting into equal parts",
         "Part of a whole",
      ],
   },
   science: {
      words: ["PHOTOSYNTHESIS", "GRAVITY", "ATOM", "MOLECULE", "ENERGY"],
      clues: [
         "Plants making food from sunlight",
         "Force that pulls objects down",
         "Smallest unit of matter",
         "Group of atoms",
         "Ability to do work",
      ],
   },
};

// Balloon drop answers (correct answers that balloons should contain)
export const balloonAnswers = {
   math: ["12", "25", "8", "100", "50"],
   science: ["Water", "Oxygen", "Carbon", "Energy", "Light"],
   english: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
   social: ["Delhi", "Gandhi", "India", "Freedom", "Constitution"],
};

// Pattern sequences for pattern puzzle
export const patterns = [
   [2, 4, 6, 8, "?"], // Answer: 10
   [1, 4, 9, 16, "?"], // Answer: 25
   ["A", "B", "C", "D", "?"], // Answer: E
   [5, 10, 15, 20, "?"], // Answer: 25
   [1, 1, 2, 3, 5, "?"], // Answer: 8 (Fibonacci)
];

// Body organ matching data
export const bodyOrgans = [
   { organ: "Heart", function: "Pumps blood" },
   { organ: "Lungs", function: "Help in breathing" },
   { organ: "Brain", function: "Controls the body" },
   { organ: "Liver", function: "Filters toxins" },
   { organ: "Kidneys", function: "Filter waste from blood" },
];

// Helper function to extract MCQ questions from all subjects and classes
export const mcqQuestions = Object.values(questionSets)
   .flatMap((subject) => Object.values(subject))
   .flat()
   .filter((question) => question.type === "mcq");

// Helper function to extract MSQ questions from all subjects and classes
export const msqQuestions = Object.values(questionSets)
   .flatMap((subject) => Object.values(subject))
   .flat()
   .filter((question) => question.type === "msq");

// Balloon Drop Game specific questions - quick and fun
export const balloonDropQuestions = [
   {
      id: 1,
      question: "What is 5 + 3?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 2,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 3,
      question: "What is 12 ÷ 4?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 4,
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 5,
      question: "What is 7 × 6?",
      options: ["36", "42", "48", "54"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 6,
      question: "What color do you get mixing red and blue?",
      options: ["Green", "Purple", "Orange", "Yellow"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 7,
      question: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 8,
      question: "What is the largest ocean?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 9,
      question: "What is 9 × 9?",
      options: ["72", "81", "90", "99"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 10,
      question: "Which animal is known as the King of the Jungle?",
      options: ["Tiger", "Lion", "Elephant", "Leopard"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 11,
      question: "What is the opposite of 'hot'?",
      options: ["Warm", "Cool", "Cold", "Freezing"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 12,
      question: "How many days are in a week?",
      options: ["5", "6", "7", "8"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 13,
      question: "What is H2O?",
      options: ["Oxygen", "Water", "Hydrogen", "Carbon"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 14,
      question: "Which season comes after winter?",
      options: ["Summer", "Spring", "Autumn", "Fall"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 15,
      question: "What is 100 ÷ 10?",
      options: ["5", "10", "15", "20"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 16,
      question: "Which continent is India in?",
      options: ["Africa", "Asia", "Europe", "Australia"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 17,
      question: "What do bees make?",
      options: ["Milk", "Honey", "Butter", "Cheese"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 18,
      question: "How many wheels does a bicycle have?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 19,
      question: "What is the first letter of the alphabet?",
      options: ["B", "A", "C", "D"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 20,
      question: "Which is the fastest land animal?",
      options: ["Horse", "Cheetah", "Lion", "Tiger"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 21,
      question: "What is 15 + 25?",
      options: ["30", "35", "40", "45"],
      correct: 2,
      type: "mcq",
   },
   {
      id: 22,
      question: "Which organ pumps blood in our body?",
      options: ["Brain", "Heart", "Lungs", "Liver"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 23,
      question: "What comes after Thursday?",
      options: ["Wednesday", "Friday", "Saturday", "Sunday"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 24,
      question: "How many minutes are in an hour?",
      options: ["50", "60", "70", "80"],
      correct: 1,
      type: "mcq",
   },
   {
      id: 25,
      question: "Which shape has 4 equal sides?",
      options: ["Triangle", "Square", "Circle", "Rectangle"],
      correct: 1,
      type: "mcq",
   },
];

// Matching Game Data
export const matchingQuestions = [
   {
      id: 1,
      title: "Match Scientific Terms",
      pairs: [
         {
            term: "Photosynthesis",
            definition: "Process by which plants make food using sunlight",
         },
         {
            term: "Mitosis",
            definition: "Cell division that produces two identical cells",
         },
         {
            term: "Gravity",
            definition: "Force that pulls objects toward Earth",
         },
         { term: "Atom", definition: "Smallest unit of matter" },
         {
            term: "Ecosystem",
            definition: "Community of living and non-living things",
         },
      ],
   },
   {
      id: 2,
      title: "Match Mathematical Terms",
      pairs: [
         {
            term: "Perimeter",
            definition: "Distance around the outside of a shape",
         },
         { term: "Area", definition: "Amount of space inside a shape" },
         { term: "Fraction", definition: "Part of a whole number" },
         {
            term: "Prime Number",
            definition: "Number divisible only by 1 and itself",
         },
         { term: "Polygon", definition: "Closed figure with straight sides" },
      ],
   },
   {
      id: 3,
      title: "Match Historical Events",
      pairs: [
         { term: "1947", definition: "India gained independence" },
         { term: "1857", definition: "First War of Indian Independence" },
         { term: "1930", definition: "Salt March by Mahatma Gandhi" },
         { term: "1919", definition: "Jallianwala Bagh Massacre" },
         { term: "1942", definition: "Quit India Movement launched" },
      ],
   },
];

// Crossword Game Data
export const crosswordQuestions = [
   {
      id: 1,
      title: "Science Crossword",
      grid: [
         [null, null, "S", null, null, null, null],
         [null, null, "U", null, null, null, null],
         ["W", "A", "T", "E", "R", null, null],
         [null, null, "O", null, null, null, null],
         [null, null, "M", null, null, null, null],
      ],
      clues: {
         across: [
            {
               number: 1,
               clue: "H2O in liquid form",
               answer: "WATER",
               row: 2,
               col: 0,
               length: 5,
            },
         ],
         down: [
            {
               number: 2,
               clue: "Our nearest star",
               answer: "SUN",
               row: 0,
               col: 2,
               length: 3,
            },
            {
               number: 3,
               clue: "Smallest particle of matter",
               answer: "ATOM",
               row: 1,
               col: 2,
               length: 4,
            },
         ],
      },
   },
   {
      id: 2,
      title: "Geography Crossword",
      grid: [
         ["I", "N", "D", "I", "A", null, null],
         [null, null, null, null, "S", null, null],
         [null, null, null, null, "I", null, null],
         [null, null, null, null, "A", null, null],
      ],
      clues: {
         across: [
            {
               number: 1,
               clue: "Our country",
               answer: "INDIA",
               row: 0,
               col: 0,
               length: 5,
            },
         ],
         down: [
            {
               number: 2,
               clue: "Largest continent",
               answer: "ASIA",
               row: 0,
               col: 4,
               length: 4,
            },
         ],
      },
   },
];

// Word Scramble Questions
export const wordScrambleQuestions = [
   {
      word: "elephant",
      hint: "A large gray mammal with a trunk",
      category: "Animals",
   },
   {
      word: "computer",
      hint: "Electronic device for processing data",
      category: "Technology",
   },
   {
      word: "rainbow",
      hint: "Colorful arc in the sky after rain",
      category: "Nature",
   },
   {
      word: "library",
      hint: "Place where books are kept",
      category: "Places",
   },
   {
      word: "mathematics",
      hint: "Subject dealing with numbers and equations",
      category: "Education",
   },
   {
      word: "butterfly",
      hint: "Colorful insect with wings",
      category: "Animals",
   },
   {
      word: "telescope",
      hint: "Instrument for viewing distant objects",
      category: "Science",
   },
   {
      word: "democracy",
      hint: "Government by the people",
      category: "Social Studies",
   },
   {
      word: "volcano",
      hint: "Mountain that can erupt lava",
      category: "Geography",
   },
   {
      word: "symphony",
      hint: "Large orchestral musical composition",
      category: "Arts",
   },
   {
      word: "molecule",
      hint: "Smallest unit of a chemical compound",
      category: "Science",
   },
   {
      word: "adventure",
      hint: "Exciting or unusual experience",
      category: "General",
   },
   {
      word: "architecture",
      hint: "Art and science of building design",
      category: "Arts",
   },
   {
      word: "environment",
      hint: "Natural world around us",
      category: "Science",
   },
   {
      word: "revolution",
      hint: "Complete change or overthrow",
      category: "History",
   },
];

// True/False Questions
export const trueFalseQuestions = [
   {
      question: "The sun is a star.",
      answer: true,
      explanation: "The sun is indeed a star - it's the closest star to Earth.",
      category: "Science",
   },
   {
      question: "All birds can fly.",
      answer: false,
      explanation: "Some birds like penguins and ostriches cannot fly.",
      category: "Biology",
   },
   {
      question: "Water boils at 100°C at sea level.",
      answer: true,
      explanation:
         "At standard atmospheric pressure, water boils at exactly 100°C (212°F).",
      category: "Science",
   },
   {
      question: "There are 8 planets in our solar system.",
      answer: true,
      explanation:
         "Since Pluto was reclassified as a dwarf planet, there are 8 planets.",
      category: "Astronomy",
   },
   {
      question: "Shakespeare wrote 'Romeo and Juliet'.",
      answer: true,
      explanation:
         "William Shakespeare wrote this famous tragedy in the early part of his career.",
      category: "Literature",
   },
   {
      question: "Lightning never strikes the same place twice.",
      answer: false,
      explanation:
         "Lightning can and often does strike the same place multiple times.",
      category: "Science",
   },
   {
      question: "The Great Wall of China is visible from space.",
      answer: false,
      explanation:
         "This is a common myth - the Great Wall is not visible from space with the naked eye.",
      category: "Geography",
   },
   {
      question: "Humans have five senses.",
      answer: false,
      explanation:
         "Humans actually have more than five senses, including balance, temperature, and pain.",
      category: "Biology",
   },
   {
      question: "The Amazon River is longer than the Nile River.",
      answer: true,
      explanation:
         "Recent studies suggest the Amazon is slightly longer than the Nile.",
      category: "Geography",
   },
   {
      question: "Gold is heavier than silver.",
      answer: true,
      explanation: "Gold has a higher density than silver, making it heavier.",
      category: "Science",
   },
   {
      question: "Antarctica is the largest continent.",
      answer: false,
      explanation: "Asia is the largest continent, not Antarctica.",
      category: "Geography",
   },
   {
      question: "A triangle has 4 sides.",
      answer: false,
      explanation:
         "A triangle has exactly 3 sides. A shape with 4 sides is called a quadrilateral.",
      category: "Mathematics",
   },
   {
      question: "The human heart has 4 chambers.",
      answer: true,
      explanation:
         "The heart has 4 chambers: left and right atrium, left and right ventricle.",
      category: "Biology",
   },
   {
      question: "Mount Everest is the tallest mountain on Earth.",
      answer: true,
      explanation: "Mount Everest stands at 8,848.86 meters above sea level.",
      category: "Geography",
   },
   {
      question: "All metals conduct electricity.",
      answer: false,
      explanation:
         "While most metals conduct electricity, some don't conduct it well under all conditions.",
      category: "Science",
   },
];

export default questionSets;
