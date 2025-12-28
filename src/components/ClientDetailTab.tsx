import { Entry, Client } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText } from 'lucide-react';

interface ClientDetailTabProps {
  client: Client;
  entries: Entry[];
}

export function ClientDetailTab({ client, entries }: ClientDetailTabProps) {
  return (
    <div className="animate-fade-in p-6 max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
              <p className="text-sm text-muted-foreground">
                {entries.length} {entries.length === 1 ? 'voce' : 'voci'} registrate
              </p>
            </div>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nessuna voce per questo cliente</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aggiungi una voce dalla pagina principale
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px]">Data</TableHead>
                <TableHead>Descrizione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
