export interface Client {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Entry {
  id: string;
  clientId: string;
  description: string;
  createdAt: Date;
}

export interface ClientTab {
  clientId: string;
  clientName: string;
}
