import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableData {
  date_reported: string;
  country_code: string;
  country: string;
  who_region: string;
  new_cases: number;
  cumulative_cases: number;
  new_deaths: number;
  cumulative_deaths: number;
}

interface DataTableProps {
  data: TableData[];
}

export function DataTable({ data: tableData }: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Rinci (Live)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8">
                    Tanggal <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8">
                    Kode <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8">
                    Negara <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8">
                    Wilayah WHO <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    Kasus Baru <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    Total Kasus <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    Kematian Baru <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    Total Kematian <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={`${row.country_code}-${row.date_reported}-${index}`}>
                  <TableCell className="font-medium">{row.date_reported}</TableCell>
                  <TableCell>{row.country_code}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.who_region}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.new_cases.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.cumulative_cases.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.new_deaths.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.cumulative_deaths.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
