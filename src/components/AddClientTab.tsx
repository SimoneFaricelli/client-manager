import { Client } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderOpen } from 'lucide-react';

interface AddClientTabProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export function AddClientTab({ clients, onSelectClient }: AddClientTabProps) {
  const handleSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      onSelectClient(client);
    }
  };

  return (
    <div className="animate-fade-in p-6 max-w-md mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Apri Scheda Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Seleziona un cliente per visualizzare le sue voci
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="select-client" className="text-sm font-medium">
            Cliente
          </Label>
          <Select onValueChange={handleSelect}>
            <SelectTrigger id="select-client" className="w-full bg-background">
              <SelectValue placeholder="Seleziona un cliente..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              {clients.length === 0 ? (
                <div className="py-4 px-3 text-sm text-muted-foreground text-center">
                  Nessun cliente disponibile
                </div>
              ) : (
                clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
