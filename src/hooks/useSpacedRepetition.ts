import { useState, useCallback, useEffect } from 'react';

// Learning states based on Anki's SRS system
export enum CardState {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEW = 'review',
  RELEARNING = 'relearning'
}

// Response quality from the user
export enum ResponseQuality {
  AGAIN = 0,
  HARD = 1,
  GOOD = 2,
  EASY = 3
}

export interface Card {
  id: string;
  front: string;
  back: string;
  
  // SM-2 algorithm parameters
  interval: number;         // Current interval in days
  ease: number;             // Ease factor (multiplier for intervals)
  state: CardState;         // Current learning state
  due: number;              // Unix timestamp when card is due
  reviews: number;          // Number of reviews
  lapses: number;           // Number of times forgotten
  lastReview: number | null; // Timestamp of last review
}

interface ReviewLog {
  id: string;
  cardId: string;
  timestamp: number;
  responseQuality: ResponseQuality;
  oldInterval: number;
  newInterval: number;
  oldEase: number;
  newEase: number;
}

interface SpacedRepetitionStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  averageEase: number;
  retentionRate: number;
  cardsPerDay: number[];
}

// Default parameters based on SM-2 algorithm
const DEFAULT_EASE = 2.5;
const EASE_MODIFIER_HARD = -0.15;
const EASE_MODIFIER_GOOD = 0;
const EASE_MODIFIER_EASY = 0.15;
const MINIMUM_EASE = 1.3;
const INITIAL_INTERVALS = [1, 3, 7]; // In days
const LAPSE_INTERVAL_CHANGE = 0.5;

// Default new card settings
const NEW_CARDS_PER_DAY = 20;
const REVIEWS_PER_DAY = 200;

// Load data from localStorage or initialize
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Save data to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useSpacedRepetition = (initialDeck: Card[]) => {
  // Initialize cards with proper defaults if they're new
  const normalizedDeck = initialDeck.map(card => ({
    ...card,
    interval: card.interval || 0,
    ease: card.ease || DEFAULT_EASE,
    state: card.state || CardState.NEW,
    due: card.due || Date.now(),
    reviews: card.reviews || 0,
    lapses: card.lapses || 0,
    lastReview: card.lastReview || null
  }));

  // State for cards, review history, and current card
  const [cards, setCards] = useState<Card[]>(() => 
    loadFromStorage('flashcards', normalizedDeck)
  );
  const [reviewHistory, setReviewHistory] = useState<ReviewLog[]>(() => 
    loadFromStorage('reviewHistory', [])
  );
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [stats, setStats] = useState<SpacedRepetitionStats>(() => ({
    totalCards: cards.length,
    newCards: 0,
    learningCards: 0,
    reviewCards: 0,
    masteredCards: 0,
    averageEase: 0,
    retentionRate: 0,
    cardsPerDay: []
  }));

  // Calculate next due date based on card state and response
  const calculateNextDue = useCallback((card: Card, responseQuality: ResponseQuality): {
    newInterval: number,
    newEase: number,
    newState: CardState
  } => {
    let newInterval = card.interval;
    let newEase = card.ease;
    let newState = card.state;
    
    // Calculate new ease factor based on response quality
    if (card.state === CardState.REVIEW) {
      switch (responseQuality) {
        case ResponseQuality.AGAIN:
          newEase = Math.max(MINIMUM_EASE, card.ease + EASE_MODIFIER_HARD);
          break;
        case ResponseQuality.HARD:
          newEase = Math.max(MINIMUM_EASE, card.ease + EASE_MODIFIER_HARD);
          break;
        case ResponseQuality.GOOD:
          newEase = Math.max(MINIMUM_EASE, card.ease + EASE_MODIFIER_GOOD);
          break;
        case ResponseQuality.EASY:
          newEase = Math.max(MINIMUM_EASE, card.ease + EASE_MODIFIER_EASY);
          break;
      }
    }
    
    // Calculate new interval based on card state and response quality
    switch (card.state) {
      case CardState.NEW:
        if (responseQuality === ResponseQuality.AGAIN) {
          newInterval = 0;
          newState = CardState.LEARNING;
        } else if (responseQuality === ResponseQuality.HARD) {
          newInterval = INITIAL_INTERVALS[0];
          newState = CardState.LEARNING;
        } else if (responseQuality === ResponseQuality.GOOD) {
          newInterval = INITIAL_INTERVALS[1];
          newState = CardState.LEARNING;
        } else {
          newInterval = INITIAL_INTERVALS[2];
          newState = CardState.REVIEW;
        }
        break;
        
      case CardState.LEARNING:
      case CardState.RELEARNING:
        if (responseQuality === ResponseQuality.AGAIN) {
          newInterval = 0;
          // State remains the same
        } else if (responseQuality === ResponseQuality.HARD) {
          newInterval = Math.max(1, Math.floor(card.interval * 1.2));
          if (card.interval >= INITIAL_INTERVALS[1]) {
            newState = CardState.REVIEW;
          }
        } else if (responseQuality === ResponseQuality.GOOD) {
          newInterval = Math.max(1, Math.floor(card.interval * 1.5));
          if (card.interval >= INITIAL_INTERVALS[0]) {
            newState = CardState.REVIEW;
          }
        } else {
          newInterval = INITIAL_INTERVALS[2];
          newState = CardState.REVIEW;
        }
        break;
        
      case CardState.REVIEW:
        if (responseQuality === ResponseQuality.AGAIN) {
          // Card was forgotten, move to relearning
          newInterval = Math.max(1, Math.floor(card.interval * LAPSE_INTERVAL_CHANGE));
          newState = CardState.RELEARNING;
        } else if (responseQuality === ResponseQuality.HARD) {
          // Remembered with difficulty
          newInterval = Math.max(1, Math.floor(card.interval * 1.2));
        } else if (responseQuality === ResponseQuality.GOOD) {
          // Remembered correctly
          newInterval = Math.max(1, Math.floor(card.interval * card.ease));
        } else {
          // Remembered easily
          newInterval = Math.max(1, Math.floor(card.interval * card.ease * 1.3));
        }
        break;
    }
    
    return { newInterval, newEase, newState };
  }, []);

  // Convert interval (days) to milliseconds
  const intervalToMs = useCallback((interval: number): number => {
    return interval * 24 * 60 * 60 * 1000;
  }, []);

  // Get the next card to review
  const getNextCard = useCallback(() => {
    const now = Date.now();
    
    // Filter cards that are due
    const dueCards = cards.filter(card => card.due <= now);
    
    // Sort priority: 1. Relearning, 2. Learning, 3. New cards, 4. Review
    dueCards.sort((a, b) => {
      // First priority is state
      if (a.state !== b.state) {
        if (a.state === CardState.RELEARNING) return -1;
        if (b.state === CardState.RELEARNING) return 1;
        if (a.state === CardState.LEARNING) return -1;
        if (b.state === CardState.LEARNING) return 1;
        if (a.state === CardState.NEW) return -1;
        if (b.state === CardState.NEW) return 1;
      }
      
      // Second priority is due date
      return a.due - b.due;
    });
    
    // Limit new cards per day
    const newCardsToday = reviewHistory.filter(log => {
      const today = new Date();
      const reviewDate = new Date(log.timestamp);
      return reviewDate.toDateString() === today.toDateString();
    }).length;
    
    const availableCards = dueCards.filter(card => {
      if (card.state === CardState.NEW && newCardsToday >= NEW_CARDS_PER_DAY) {
        return false;
      }
      return true;
    });
    
    setCurrentCard(availableCards.length > 0 ? availableCards[0] : null);
  }, [cards, reviewHistory]);

  // Record response and update card
  const recordResponse = useCallback((responseQuality: ResponseQuality) => {
    if (!currentCard) return;
    
    const oldInterval = currentCard.interval;
    const oldEase = currentCard.ease;
    
    const { newInterval, newEase, newState } = calculateNextDue(
      currentCard, 
      responseQuality
    );
    
    // Calculate the new due date
    const now = Date.now();
    const newDue = now + intervalToMs(newInterval);
    
    // Update the card
    const updatedCard: Card = {
      ...currentCard,
      interval: newInterval,
      ease: newEase,
      state: newState,
      due: newDue,
      reviews: currentCard.reviews + 1,
      lapses: responseQuality === ResponseQuality.AGAIN ? 
        currentCard.lapses + 1 : currentCard.lapses,
      lastReview: now
    };
    
    // Create a review log
    const reviewLog: ReviewLog = {
      id: `review_${Date.now()}`,
      cardId: currentCard.id,
      timestamp: now,
      responseQuality,
      oldInterval,
      newInterval,
      oldEase,
      newEase
    };
    
    // Update state
    setCards(prevCards => {
      const newCards = prevCards.map(card => 
        card.id === currentCard.id ? updatedCard : card
      );
      saveToStorage('flashcards', newCards);
      return newCards;
    });
    
    setReviewHistory(prevHistory => {
      const newHistory = [...prevHistory, reviewLog];
      saveToStorage('reviewHistory', newHistory);
      return newHistory;
    });
    
    // Move to the next card
    getNextCard();
  }, [currentCard, calculateNextDue, intervalToMs, getNextCard]);

  // Calculate statistics
  const calculateStats = useCallback(() => {
    if (cards.length === 0) return;
    
    const now = Date.now();
    const newCards = cards.filter(card => card.state === CardState.NEW).length;
    const learningCards = cards.filter(card => 
      card.state === CardState.LEARNING || card.state === CardState.RELEARNING
    ).length;
    const reviewCards = cards.filter(card => card.state === CardState.REVIEW).length;
    
    // Cards with interval > 30 days are considered "mastered"
    const masteredCards = cards.filter(card => card.interval > 30).length;
    
    // Calculate average ease
    const totalEase = cards.reduce((sum, card) => sum + card.ease, 0);
    const averageEase = totalEase / cards.length;
    
    // Calculate retention rate (correct answers / total reviews)
    const totalReviews = reviewHistory.length;
    const correctReviews = reviewHistory.filter(
      log => log.responseQuality > ResponseQuality.AGAIN
    ).length;
    const retentionRate = totalReviews > 0 ? 
      (correctReviews / totalReviews) * 100 : 0;
    
    // Cards reviewed per day (last 7 days)
    const cardsPerDay: number[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const reviewsOnDay = reviewHistory.filter(log => 
        new Date(log.timestamp).toDateString() === dateString
      ).length;
      
      cardsPerDay.unshift(reviewsOnDay);
    }
    
    setStats({
      totalCards: cards.length,
      newCards,
      learningCards,
      reviewCards,
      masteredCards,
      averageEase,
      retentionRate,
      cardsPerDay
    });
  }, [cards, reviewHistory]);

  // Simplified methods for basic 'Know' / 'Don't Know' responses
  const know = useCallback(() => recordResponse(ResponseQuality.GOOD), [recordResponse]);
  const dontKnow = useCallback(() => recordResponse(ResponseQuality.AGAIN), [recordResponse]);

  // Reset all cards to initial state and clear review history
  const resetAllData = useCallback(() => {
    // Reset cards to initial state
    const resetDeck = initialDeck.map(card => ({
      ...card,
      interval: 0,
      ease: DEFAULT_EASE,
      state: CardState.NEW,
      due: Date.now(), // Make all cards due immediately
      reviews: 0,
      lapses: 0,
      lastReview: null
    }));
    
    setCards(resetDeck);
    setReviewHistory([]);
    
    // Save to localStorage
    saveToStorage('flashcards', resetDeck);
    saveToStorage('reviewHistory', []);
    
    // Get the next card to review
    getNextCard();
  }, [initialDeck, getNextCard]);

  // Initialize on first load
  useEffect(() => {
    getNextCard();
  }, [getNextCard]);

  // Update stats whenever cards or history changes
  useEffect(() => {
    calculateStats();
  }, [cards, reviewHistory, calculateStats]);

  return {
    currentCard,
    know,
    dontKnow,
    recordResponse,
    stats,
    reviewHistory,
    cards,
    getNextCard,
    resetAllData,
  };
}; 