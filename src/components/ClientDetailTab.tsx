import { Entry, Client } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ClientDetailTabProps {
  client: Client;
  entries: Entry[];
  onDeleteEntry?: (entryId: string) => void;
}

export function ClientDetailTab({ client, entries, onDeleteEntry }: ClientDetailTabProps) {
  const handleExportToExcel = () => {
    try {
      // Prepara i dati per l'export
      const exportData = entries.map(entry => ({
        Data: new Date(entry.created_at).toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        Descrizione: entry.description,
        'Costo (€)': entry.cost.toFixed(2),
      }));

      // Crea un nuovo workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');

      // Imposta la larghezza delle colonne
      worksheet['!cols'] = [
        { wch: 20 }, // Data
        { wch: 60 }, // Descrizione
        { wch: 15 }, // Costo
      ];

      // Genera il file e scaricalo
      const fileName = `${client.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success('File Excel scaricato con successo');
    } catch (error) {
      console.error('Errore durante l\'export:', error);
      toast.error('Errore durante l\'export del file');
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    if (onDeleteEntry) {
      onDeleteEntry(entryId);
      toast.success('Record eliminato');
    }
  };

  return (
    <div className="animate-fade-in p-6 max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
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
            {entries.length > 0 && (
              <Button
                onClick={handleExportToExcel}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Esporta Excel
              </Button>
            )}
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
                <TableHead className="w-[120px] text-right">Costo</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id} className="group">
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
                  <TableCell className="text-right font-medium">€ {entry.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
