import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/hooks/useAuth';
import { AppTabs } from '@/components/AppTabs';
import { Briefcase, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const {
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
  } = useAppState();

  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
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
          getClientEntries={getClientEntries}
          onOpenClientTab={openClientTab}
          onCloseClientTab={closeClientTab}
        />
      </main>
    </div>
  );
};

export default Index;
