import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainTab } from './MainTab';
import { ClientsTab } from './ClientsTab';
import { AddClientTab } from './AddClientTab';
import { ClientDetailTab } from './ClientDetailTab';
import { Client, Entry, ClientTab } from '@/types';
import { FileText, Users, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppTabsProps {
  clients: Client[];
  entries: Entry[];
  openClientTabs: ClientTab[];
  onAddEntry: (clientId: string, description: string, cost: number) => void;
  onAddClient: (name: string) => void;
  onUpdateClient: (id: string, name: string) => void;
  onDeleteClient: (id: string) => void;
  getClientEntries: (clientId: string) => Entry[];
  onOpenClientTab: (client: Client) => void;
  onCloseClientTab: (clientId: string) => void;
}

export function AppTabs({
  clients,
  entries,
  openClientTabs,
  onAddEntry,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  getClientEntries,
  onOpenClientTab,
  onCloseClientTab,
}: AppTabsProps) {
  const [activeTab, setActiveTab] = useState('main');

  const handleOpenClientTab = (client: Client) => {
    onOpenClientTab(client);
    setActiveTab(`client-${client.id}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <TabsList className="h-12 bg-transparent gap-1 p-0">
            <TabsTrigger
              value="main"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <FileText className="h-4 w-4" />
              Principale
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Users className="h-4 w-4" />
              Clienti
            </TabsTrigger>

            {openClientTabs.map(tab => (
              <TabsTrigger
                key={tab.clientId}
                value={`client-${tab.clientId}`}
                className="gap-2 pr-1 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary group"
              >
                <span className="max-w-[120px] truncate">{tab.clientName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  onClick={e => {
                    e.stopPropagation();
                    onCloseClientTab(tab.clientId);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TabsTrigger>
            ))}

            <TabsTrigger
              value="add"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Plus className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="min-h-[calc(100vh-8rem)]">
        <TabsContent value="main" className="m-0">
          <MainTab clients={clients} onSubmit={onAddEntry} />
        </TabsContent>

        <TabsContent value="clients" className="m-0">
          <ClientsTab
            clients={clients}
            onAdd={onAddClient}
            onUpdate={onUpdateClient}
            onDelete={onDeleteClient}
          />
        </TabsContent>

        {openClientTabs.map(tab => {
          const client = clients.find(c => c.id === tab.clientId);
          if (!client) return null;
          return (
            <TabsContent key={tab.clientId} value={`client-${tab.clientId}`} className="m-0">
              <ClientDetailTab
                client={client}
                entries={getClientEntries(tab.clientId)}
              />
            </TabsContent>
          );
        })}

        <TabsContent value="add" className="m-0">
          <AddClientTab clients={clients} onSelectClient={handleOpenClientTab} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
