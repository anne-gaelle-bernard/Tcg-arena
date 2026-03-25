import { apiRequest } from './api';

export interface Card {
  id: number;
  name: string;
  team: string;
  position: string;
  pts: number;
  reb: number;
  ast: number;
  rarity: string;
  color: string;
}

export async function getCards(): Promise<Card[]> {
  return apiRequest<Card[]>('/cards');
}

export async function getCard(id: number): Promise<Card> {
  return apiRequest<Card>(`/cards/${id}`);
}
