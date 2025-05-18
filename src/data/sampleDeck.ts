import { Card, CardState } from '../hooks/useSpacedRepetition';

// Calculate a timestamp for a card due date
const getDueDate = (daysFromNow: number = 0): number => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.getTime();
};

// Default ease factor
const DEFAULT_EASE = 2.5;

export const sampleDeck: Card[] = [
  { 
    id: '1', 
    front: 'Hola', 
    back: 'Hello', 
    interval: 0,
    ease: DEFAULT_EASE,
    state: CardState.NEW,
    due: getDueDate(0),
    reviews: 0,
    lapses: 0,
    lastReview: null
  },
  { 
    id: '2', 
    front: 'Adiós', 
    back: 'Goodbye', 
    interval: 0,
    ease: DEFAULT_EASE,
    state: CardState.NEW, 
    due: getDueDate(0),
    reviews: 0,
    lapses: 0,
    lastReview: null
  },
  { 
    id: '3', 
    front: 'Gracias', 
    back: 'Thank you', 
    interval: 0,
    ease: DEFAULT_EASE,
    state: CardState.NEW,
    due: getDueDate(0),
    reviews: 0,
    lapses: 0,
    lastReview: null
  },
  { 
    id: '4', 
    front: 'Por favor', 
    back: 'Please', 
    interval: 0,
    ease: DEFAULT_EASE,
    state: CardState.NEW,
    due: getDueDate(0),
    reviews: 0,
    lapses: 0,
    lastReview: null
  },
  { 
    id: '5', 
    front: 'Lo siento', 
    back: 'Sorry', 
    interval: 0,
    ease: DEFAULT_EASE,
    state: CardState.NEW,
    due: getDueDate(0),
    reviews: 0,
    lapses: 0,
    lastReview: null
  },
]; 