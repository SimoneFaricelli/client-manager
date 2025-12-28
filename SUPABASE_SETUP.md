# Configurazione Database Supabase - Guida Passo Passo

## 1. Accedi al tuo progetto Supabase
1. Vai su https://supabase.com e accedi
2. Seleziona il progetto che stai usando per il login (quello con le credenziali in `.env`)

## 2. Crea la tabella `clients`

1. Vai su **SQL Editor** nella sidebar sinistra
2. Clicca su **New Query**
3. Copia e incolla questo codice:

```sql
-- Creazione tabella clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indice per migliorare le performance delle query per user_id
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Abilitare Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: gli utenti possono vedere solo i propri clienti
CREATE POLICY "Users can view their own clients" 
  ON clients FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: gli utenti possono inserire solo i propri clienti
CREATE POLICY "Users can insert their own clients" 
  ON clients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: gli utenti possono aggiornare solo i propri clienti
CREATE POLICY "Users can update their own clients" 
  ON clients FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: gli utenti possono eliminare solo i propri clienti
CREATE POLICY "Users can delete their own clients" 
  ON clients FOR DELETE 
  USING (auth.uid() = user_id);
```

4. Clicca su **Run** per eseguire la query

## 3. Crea la tabella `entries`

1. Sempre nel **SQL Editor**, clicca su **New Query**
2. Copia e incolla questo codice:

```sql
-- Creazione tabella entries
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indici per migliorare le performance
CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_client_id ON entries(client_id);

-- Abilitare Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policy: gli utenti possono vedere solo le proprie entries
CREATE POLICY "Users can view their own entries" 
  ON entries FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: gli utenti possono inserire solo le proprie entries
CREATE POLICY "Users can insert their own entries" 
  ON entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: gli utenti possono eliminare solo le proprie entries
CREATE POLICY "Users can delete their own entries" 
  ON entries FOR DELETE 
  USING (auth.uid() = user_id);
```

3. Clicca su **Run** per eseguire la query

## 4. Aggiorna tabella esistente (se hai già creato il database)

Se hai già creato la tabella `entries` senza il campo `cost`, esegui questa query:

```sql
-- Aggiungi la colonna cost alla tabella entries esistente
ALTER TABLE entries 
ADD COLUMN cost NUMERIC(10, 2) NOT NULL DEFAULT 0;
```

## 5. Abilita Realtime (Opzionale ma consigliato)

Per ricevere aggiornamenti in tempo reale:

1. Vai su **Database** → **Replication** nella sidebar
2. Trova le tabelle `clients` e `entries`
3. Attiva il toggle per abilitare **Realtime** su entrambe le tabelle

## 6. Verifica le tabelle

1. Vai su **Table Editor** nella sidebar
2. Dovresti vedere le due nuove tabelle:
   - `clients` con le colonne: `id`, `user_id`, `name`, `created_at`
   - `entries` con le colonne: `id`, `user_id`, `client_id`, `description`, `cost`, `created_at`

## 7. Test dell'integrazione

1. Assicurati che il file `.env` contenga le credenziali corrette:
   ```
   VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
   VITE_SUPABASE_ANON_KEY=la-tua-anon-key
   ```

2. Avvia l'applicazione:
   ```bash
   npm run dev
   # oppure
   bun dev
   ```

3. Fai il login con il tuo account
4. Prova ad aggiungere un cliente
5. Prova ad aggiungere una entry per quel cliente con un costo
6. Verifica su Supabase che i dati siano stati salvati correttamente

## Cosa è stato modificato nel codice

### File modificati:
1. **src/types/index.ts** - Aggiornati i tipi per usare `created_at` (string) invece di `createdAt` (Date) e aggiunto campo `cost`
2. **src/hooks/useSupabaseClients.ts** - Nuovo hook che sostituisce `useAppState` con operazioni Supabase
3. **src/pages/Index.tsx** - Aggiornato per usare `useSupabaseClients`
4. **src/components/ClientsTab.tsx** - Aggiornato per gestire `created_at` come stringa
5. **src/components/ClientDetailTab.tsx** - Aggiornato per gestire `created_at` come stringa e mostrare colonna costo con export Excel
6. **src/components/MainTab.tsx** - Aggiunto campo input per "Costo Prestazione" con validazione float
7. **src/components/AppTabs.tsx** - Aggiornato per passare il parametro cost

### Funzionalità aggiunte:
- ✅ Sincronizzazione automatica con il database Supabase
- ✅ Realtime updates: i dati si aggiornano automaticamente se modificati da un'altra sessione
- ✅ Row Level Security: ogni utente vede solo i propri dati
- ✅ Toast notifications per feedback all'utente
- ✅ Loading state durante il caricamento iniziale
- ✅ Campo "Costo Prestazione" con validazione numeri float
- ✅ Export Excel con colonna costo formattata

## Note importanti

- **Row Level Security (RLS)**: Le policy create garantiscono che ogni utente possa accedere solo ai propri dati
- **Cascade Delete**: Quando un cliente viene eliminato, tutte le sue entry vengono eliminate automaticamente
- **Realtime**: Se abilitato, l'app riceverà aggiornamenti in tempo reale quando i dati cambiano nel database
