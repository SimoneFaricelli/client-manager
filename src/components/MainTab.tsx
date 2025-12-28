import { useState } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Euro } from 'lucide-react';
import { toast } from 'sonner';

interface MainTabProps {
  clients: Client[];
  onSubmit: (clientId: string, description: string, cost: number) => void;
}

export function MainTab({ clients, onSubmit }: MainTabProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [cost, setCost] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedClientId) {
      toast.error('Seleziona un cliente');
      return;
    }
    if (!description.trim()) {
      toast.error('Inserisci una descrizione');
      return;
    }
    if (!cost || isNaN(parseFloat(cost)) || parseFloat(cost) < 0) {
      toast.error('Inserisci un costo valido');
      return;
    }

    onSubmit(selectedClientId, description.trim(), parseFloat(cost));
    setDescription('');
    setCost('');
    toast.success('Voce aggiunta con successo');
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permetti solo numeri e punto decimale
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCost(value);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="animate-fade-in p-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Nuova Voce</h2>
          <p className="text-sm text-muted-foreground">
            Aggiungi una nuova descrizione per un cliente
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">
              Cliente
            </Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client" className="w-full bg-background">
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

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrizione
            </Label>
            <Textarea
              id="description"
              placeholder="Inserisci la descrizione..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[120px] resize-none bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="text-sm font-medium">
              Costo Prestazione
            </Label>
            <div className="relative">
              <Input
                id="cost"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={cost}
                onChange={handleCostChange}
                className="pr-10 bg-background"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Euro className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full gap-2"
          disabled={!selectedClientId || !description.trim() || !cost}
        >
          <Send className="h-4 w-4" />
          Invia
        </Button>

        {selectedClient && (
          <p className="text-xs text-muted-foreground text-center">
            La voce verrà aggiunta a: <span className="font-medium text-foreground">{selectedClient.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
