# Flashcards: Spaced Repetition Learning

A modern flashcard application built with React, TypeScript, and Tailwind CSS that implements the SM-2 spaced repetition algorithm for efficient learning.

## Features

- **SM-2 Spaced Repetition Algorithm**: Implements the proven spaced repetition methodology used by Anki and other effective learning tools
- **Beautiful 3D Card Animations**: Smooth, animated card flipping for an engaging review experience
- **Responsive Design**: Works well on mobile, tablet, and desktop devices
- **Dark/Light Theme**: Easy on the eyes with automatic theme switching
- **Learning States**: Properly tracks NEW, LEARNING, REVIEW, and RELEARNING states
- **Progress Tracking**: Detailed statistics to monitor your learning progress
- **Data Persistence**: Saves your progress automatically using localStorage

## Tech Stack

- **React**: UI components and state management
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Advanced animations
- **Vite**: Fast build tooling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohit-5899/Flashcards.git
   cd flashcards
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Review Cards**: Click on a card to flip it and see the answer
2. **Rate Your Response**: After reviewing a card, rate how well you remembered it:
   - **Again**: You didn't remember (card will be shown again soon)
   - **Hard**: You struggled to remember (shorter interval)
   - **Good**: You remembered with some effort (standard interval)
   - **Easy**: You remembered easily (longer interval)
3. **Track Progress**: View your statistics to see how well you're doing

## How the Spaced Repetition Algorithm Works

The app uses the SM-2 algorithm with these key components:

- **Interval Calculation**: The time between reviews increases based on your performance
- **Ease Factor**: A multiplier that adjusts based on how easily you recall information
- **Learning States**: Cards progress through different states (New → Learning → Review)
- **Retention Optimization**: The system optimizes for long-term memory retention

## Customization

You can easily modify the sample deck in `src/data/sampleDeck.ts` to add your own flashcards.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots

*Add screenshots of your application here* 