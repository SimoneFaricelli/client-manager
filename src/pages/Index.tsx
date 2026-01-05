import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useAuth } from '@/hooks/useAuth';
import { AppTabs } from '@/components/AppTabs';
import { Briefcase, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const {
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
  } = useSupabaseClients();

  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center transition-colors duration-300">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Client Manager</h1>
                <p className="text-sm text-muted-foreground">
                  Gestione clienti e attività
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <AppTabs
          clients={clients}
          entries={entries}
          openClientTabs={openClientTabs}
          onAddEntry={addEntry}
          onAddClient={addClient}
          onUpdateClient={updateClient}
          onDeleteClient={deleteClient}
          onDeleteEntry={deleteEntry}
          getClientEntries={getClientEntries}
          onOpenClientTab={openClientTab}
          onCloseClientTab={closeClientTab}
        />
      </main>
    </div>
  );
};

export default Index;
