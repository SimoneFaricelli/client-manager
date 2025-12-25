import { useState, useCallback } from 'react';
import { Client, Entry, ClientTab } from '@/types';

export function useAppState() {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Acme Corp', createdAt: new Date() },
    { id: '2', name: 'Tech Solutions', createdAt: new Date() },
    { id: '3', name: 'Global Industries', createdAt: new Date() },
  ]);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [openClientTabs, setOpenClientTabs] = useState<ClientTab[]>([]);

  const addClient = useCallback((name: string) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, name: string) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, name } : client
      )
    );
    setOpenClientTabs(prev =>
      prev.map(tab =>
        tab.clientId === id ? { ...tab, clientName: name } : tab
      )
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    setEntries(prev => prev.filter(entry => entry.clientId !== id));
    setOpenClientTabs(prev => prev.filter(tab => tab.clientId !== id));
  }, []);

  const addEntry = useCallback((clientId: string, description: string) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      clientId,
      description,
      createdAt: new Date(),
    };
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  const getClientEntries = useCallback(
    (clientId: string) => {
      return entries.filter(entry => entry.clientId === clientId);
    },
    [entries]
  );

  const openClientTab = useCallback((client: Client) => {
    setOpenClientTabs(prev => {
      if (prev.some(tab => tab.clientId === client.id)) {
        return prev;
      }
      return [...prev, { clientId: client.id, clientName: client.name }];
    });
  }, []);

  const closeClientTab = useCallback((clientId: string) => {
    setOpenClientTabs(prev => prev.filter(tab => tab.clientId !== clientId));
  }, []);

  return {
    clients,
    entries,
    openClientTabs,
    addClient,
    updateClient,
    deleteClient,
    addEntry,
    getClientEntries,
    openClientTab,
    closeClientTab,
  };
}
