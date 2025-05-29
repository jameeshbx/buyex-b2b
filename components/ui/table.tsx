// src/components/ui/table.tsx
import React from "react";

export const Table = ({ children, className }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
);

export const TableHeader = ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody = ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody>{children}</tbody>
);

export const TableRow = ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b hover:bg-gray-50">{children}</tr>
);

export const TableCell = ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-2">{children}</td>
);

export const TableHead = ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="px-4 py-2 font-semibold">{children}</th>
);
