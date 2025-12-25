import { useState } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ClientsTabProps {
  clients: Client[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ClientsTab({ clients, onAdd, onUpdate, onDelete }: ClientsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const handleAdd = () => {
    if (!newClientName.trim()) {
      toast.error('Il nome del cliente non può essere vuoto');
      return;
    }
    onAdd(newClientName.trim());
    setNewClientName('');
    setIsAddDialogOpen(false);
    toast.success('Cliente aggiunto');
  };

  const handleEdit = () => {
    if (!editingClient || !editingClient.name.trim()) {
      toast.error('Il nome del cliente non può essere vuoto');
      return;
    }
    onUpdate(editingClient.id, editingClient.name.trim());
    setEditingClient(null);
    setIsEditDialogOpen(false);
    toast.success('Cliente modificato');
  };

  const handleDelete = () => {
    if (!deletingClient) return;
    onDelete(deletingClient.id);
    setDeletingClient(null);
    setIsDeleteDialogOpen(false);
    toast.success('Cliente eliminato');
  };

  const openEditDialog = (client: Client) => {
    setEditingClient({ ...client });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setDeletingClient(client);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="animate-fade-in p-6 max-w-3xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Gestione Clienti</h2>
              <p className="text-sm text-muted-foreground">
                {clients.length} {clients.length === 1 ? 'cliente' : 'clienti'} registrati
              </p>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Cliente
          </Button>
        </div>

        <div className="divide-y divide-border">
          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Nessun cliente presente</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clicca su "Nuovo Cliente" per aggiungerne uno
              </p>
            </div>
          ) : (
            clients.map(client => (
              <div
                key={client.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Aggiunto il {client.createdAt.toLocaleDateString('it-IT')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(client)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(client)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Nuovo Cliente</DialogTitle>
            <DialogDescription>
              Inserisci il nome del nuovo cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="new-client-name">Nome</Label>
            <Input
              id="new-client-name"
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
              placeholder="Nome del cliente..."
              className="bg-background"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleAdd}>Aggiungi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Modifica Cliente</DialogTitle>
            <DialogDescription>
              Modifica il nome del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="edit-client-name">Nome</Label>
            <Input
              id="edit-client-name"
              value={editingClient?.name || ''}
              onChange={e =>
                setEditingClient(prev =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              placeholder="Nome del cliente..."
              className="bg-background"
              onKeyDown={e => e.key === 'Enter' && handleEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleEdit}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutte le voci associate a{' '}
              <span className="font-medium">{deletingClient?.name}</span> verranno eliminate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
