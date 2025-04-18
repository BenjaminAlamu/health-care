"use client"

import { useState, useMemo } from "react";
import { BillingRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface ClaimsTableProps {
  data: BillingRecord[];
}

export function ClaimsTable({ data }: ClaimsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<keyof BillingRecord>("claim_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(record => {
      if (searchTerm === "") return true;
      const term = searchTerm.toLowerCase();
      return (
        record.patient_name.toLowerCase().includes(term) ||
        record.patient_id.toLowerCase().includes(term) ||
        record.billing_code.toLowerCase().includes(term) ||
        record.insurance_provider.toLowerCase().includes(term) ||
        record.payment_status.toLowerCase().includes(term)
      );
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.payment_status === statusFilter);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);

      return sortDirection === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, searchTerm, statusFilter, sortColumn, sortDirection]);

  const handleSort = (column: keyof BillingRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (column: keyof BillingRecord) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claims Table</CardTitle>
        <CardDescription>Manage and filter billing claims</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("patient_id")}>
                  <div className="flex items-center">
                    Patient ID {renderSortIndicator("patient_id")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("patient_name")}>
                  <div className="flex items-center">
                    Patient Name {renderSortIndicator("patient_name")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("billing_code")}>
                  <div className="flex items-center">
                    Billing Code {renderSortIndicator("billing_code")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                  <div className="flex items-center justify-end">
                    Amount {renderSortIndicator("amount")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("insurance_provider")}>
                  <div className="flex items-center">
                    Insurance Provider {renderSortIndicator("insurance_provider")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("payment_status")}>
                  <div className="flex items-center">
                    Status {renderSortIndicator("payment_status")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("claim_date")}>
                  <div className="flex items-center">
                    Claim Date {renderSortIndicator("claim_date")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No claims found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((record) => (
                  <TableRow key={record.patient_id}>
                    <TableCell>{record.patient_id}</TableCell>
                    <TableCell>{record.patient_name}</TableCell>
                    <TableCell>{record.billing_code}</TableCell>
                    <TableCell className="text-right">
                      ${record.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{record.insurance_provider}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${record.payment_status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            record.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {record.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(record.claim_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}