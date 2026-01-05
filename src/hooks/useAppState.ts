import { useState, useCallback } from 'react';
import { Client, Entry, ClientTab } from '@/types';

export function useAppState() {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Acme Corp', user_id: '', created_at: new Date().toISOString() },
    { id: '2', name: 'Tech Solutions', user_id: '', created_at: new Date().toISOString() },
    { id: '3', name: 'Global Industries', user_id: '', created_at: new Date().toISOString() },
  ]);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [openClientTabs, setOpenClientTabs] = useState<ClientTab[]>([]);

  const addClient = useCallback((name: string) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      user_id: '',
      created_at: new Date().toISOString(),
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
    setEntries(prev => prev.filter(entry => entry.client_id !== id));
    setOpenClientTabs(prev => prev.filter(tab => tab.clientId !== id));
  }, []);

  const addEntry = useCallback((clientId: string, description: string, cost: number = 0) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      client_id: clientId,
      description,
      cost,
      user_id: '',
      created_at: new Date().toISOString(),
    };
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  const deleteEntry = useCallback((entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  }, []);

  const getClientEntries = useCallback(
    (clientId: string) => {
      return entries.filter(entry => entry.client_id === clientId);
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
    deleteEntry,
    getClientEntries,
    openClientTab,
    closeClientTab,
  };
}
