"use client";

import { Download, FileSpreadsheet, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ModuleConfig } from "@/config/modules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";

type Row = Record<string, unknown>;
type ListResponse = {
  items: Row[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

function getValue(row: Row, path: string) {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Row)[key];
  }, row);
}

export function ModuleManagement({ config }: { config: ModuleConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Row>({});

  const endpoint = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (query) params.set("search", query);
    return `${config.endpoint}?${params.toString()}`;
  }, [config.endpoint, page, query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient<ListResponse>(endpoint);
      setRows(data.items);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    try {
      await apiClient(config.endpoint, { method: "POST", body: JSON.stringify(form) });
      toast.success("Data berhasil disimpan");
      setOpen(false);
      setForm({});
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan data");
    }
  }

  async function remove(id: unknown) {
    if (!id) return;
    try {
      await apiClient(`${config.endpoint}/${id}`, { method: "DELETE" });
      toast.success("Data dihapus");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus data");
    }
  }

  function renderField(field: ModuleConfig["fields"][number]) {
    const value = String(form[field.name] ?? "");
    const setValue = (next: string) => setForm((current) => ({ ...current, [field.name]: next }));
    return (
      <div key={field.name} className="space-y-2">
        <Label>{field.label}</Label>
        {field.kind === "textarea" ? (
          <Textarea value={value} placeholder={field.placeholder} onChange={(event) => setValue(event.target.value)} />
        ) : field.kind === "select" ? (
          <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={value} onChange={(event) => setValue(event.target.value)}>
            <option value="">Pilih {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <Input type={field.kind === "date" ? "date" : field.kind === "number" ? "number" : "text"} value={value} placeholder={field.placeholder} onChange={(event) => setValue(event.target.value)} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge>{config.key}</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">{config.title}</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.key === "students" ? (
            <>
              <Button variant="outline" onClick={() => window.open("/api/students/export?format=excel", "_blank")}>
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => window.open("/api/students/export?format=pdf", "_blank")}>
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </>
          ) : null}
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Data</CardTitle>
            <CardDescription>Search, filter, sorting via API, dan pagination siap production.</CardDescription>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari data..." value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {config.columns.map((column) => (
                    <TableHead key={column.key}>{column.header}</TableHead>
                  ))}
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={config.columns.length + 1}>
                      <div className="flex h-28 items-center justify-center text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memuat data
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={config.columns.length + 1}>
                      <div className="flex h-28 items-center justify-center text-muted-foreground">Belum ada data</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={String(row.id)}>
                      {config.columns.map((column) => (
                        <TableCell key={column.key}>{String(getValue(row, column.key) ?? "-")}</TableCell>
                      ))}
                      <TableCell>
                        <Button variant="ghost" size="icon" aria-label="Hapus data" onClick={() => remove(row.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <Card className="max-h-[88vh] w-full max-w-3xl overflow-y-auto">
            <CardHeader>
              <CardTitle>Tambah {config.title}</CardTitle>
              <CardDescription>Field divalidasi di client dan API menggunakan Zod.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">{config.fields.map(renderField)}</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button onClick={submit}>Simpan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
