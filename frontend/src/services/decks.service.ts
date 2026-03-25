import { apiRequest } from './api';
import { type Card } from './cards.service';

export interface Deck {
  id: number;
  name: string;
  cards: Card[];
  createdAt: string;
}

export async function getDecks(): Promise<Deck[]> {
  return apiRequest<Deck[]>('/decks');
}

export async function getDeck(id: number): Promise<Deck> {
  return apiRequest<Deck>(`/decks/${id}`);
}

export async function createDeck(name: string, cardIds: number[]): Promise<Deck> {
  return apiRequest<Deck>('/decks', {
    method: 'POST',
    body: JSON.stringify({ name, cardIds }),
  });
}
