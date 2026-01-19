import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key]?.toString()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
