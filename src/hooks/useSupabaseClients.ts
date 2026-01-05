import { useState, useCallback, useEffect } from 'react';
import { Client, Entry, ClientTab } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [openClientTabs, setOpenClientTabs] = useState<ClientTab[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carica i clienti dal database
  const loadClients = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i clienti: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Carica le entry dal database
  const loadEntries = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le entry: ' + error.message,
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  // Effetto per caricare i dati all'inizio
  useEffect(() => {
    if (user) {
      loadClients();
      loadEntries();
    }
  }, [user, loadClients, loadEntries]);

  // Sottoscrizione real-time per i clienti
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('clients_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClients((prev) => [payload.new as Client, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setClients((prev) =>
              prev.map((client) =>
                client.id === payload.new.id ? (payload.new as Client) : client
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setClients((prev) =>
              prev.filter((client) => client.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Sottoscrizione real-time per le entry
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries((prev) => [payload.new as Entry, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setEntries((prev) =>
              prev.filter((entry) => entry.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addClient = useCallback(
    async (name: string) => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([{ name, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Cliente aggiunto',
          description: `${name} è stato aggiunto con successo`,
        });

        return data as Client;
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: 'Impossibile aggiungere il cliente: ' + error.message,
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast]
  );

  const updateClient = useCallback(
    async (id: string, name: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('clients')
          .update({ name })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setOpenClientTabs((prev) =>
          prev.map((tab) =>
            tab.clientId === id ? { ...tab, clientName: name } : tab
          )
        );

        toast({
          title: 'Cliente aggiornato',
          description: 'Il nome del cliente è stato modificato',
        });
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: 'Impossibile aggiornare il cliente: ' + error.message,
          variant: 'destructive',
        });
      }
    },
    [user, toast]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        // Elimina prima le entry associate (se non hai CASCADE)
        const { error: entriesError } = await supabase
          .from('entries')
          .delete()
          .eq('client_id', id)
          .eq('user_id', user.id);

        if (entriesError) throw entriesError;

        // Poi elimina il cliente
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setOpenClientTabs((prev) => prev.filter((tab) => tab.clientId !== id));

        toast({
          title: 'Cliente eliminato',
          description: 'Il cliente e le sue entry sono stati eliminati',
        });
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: 'Impossibile eliminare il cliente: ' + error.message,
          variant: 'destructive',
        });
      }
    },
    [user, toast]
  );

  const addEntry = useCallback(
    async (clientId: string, description: string, cost: number) => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('entries')
          .insert([{ client_id: clientId, description, cost, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Entry aggiunta',
          description: 'La nuova entry è stata salvata',
        });

        return data as Entry;
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: 'Impossibile aggiungere l\'entry: ' + error.message,
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast]
  );

  const deleteEntry = useCallback(
    async (entryId: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('entries')
          .delete()
          .eq('id', entryId)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Errore',
          description: 'Impossibile eliminare il record: ' + error.message,
          variant: 'destructive',
        });
      }
    },
    [user, toast]
  );

  const getClientEntries = useCallback(
    (clientId: string) => {
      return entries.filter((entry) => entry.client_id === clientId);
    },
    [entries]
  );

  const openClientTab = useCallback((client: Client) => {
    setOpenClientTabs((prev) => {
      if (prev.some((tab) => tab.clientId === client.id)) {
        return prev;
      }
      return [...prev, { clientId: client.id, clientName: client.name }];
    });
  }, []);

  const closeClientTab = useCallback((clientId: string) => {
    setOpenClientTabs((prev) => prev.filter((tab) => tab.clientId !== clientId));
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
    loading,
  };
}
