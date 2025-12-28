export interface Client {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface Entry {
  id: string;
  client_id: string;
  description: string;
  cost: number;
  user_id: string;
  created_at: string;
}

export interface ClientTab {
  clientId: string;
  clientName: string;
}
