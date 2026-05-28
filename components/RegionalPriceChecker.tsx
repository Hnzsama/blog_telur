"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Building2, Calendar, AlertCircle } from "lucide-react";
import { getRegionalPriceAction } from "@/app/actions/postActions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface Report {
  id: number;
  price: number;
  region: string;
  author: string;
  date: string;
}

export function RegionalPriceChecker() {
  const [provinces, setProvinces] = React.useState<Array<{ id: string; name: string }>>([]);
  const [regencies, setRegencies] = React.useState<Array<{ id: string; province_id: string; name: string }>>([]);

  const [selectedProvinceId, setSelectedProvinceId] = React.useState("");
  const [selectedRegencyId, setSelectedRegencyId] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTriggered, setSearchTriggered] = React.useState(false);
  const [averagePrice, setAveragePrice] = React.useState<number>(0);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [errorMsg, setErrorMsg] = React.useState("");

  const apiBase = process.env.NEXT_PUBLIC_WILAYAH_API || "https://hnzsama.github.io/api-wilayah-indonesia/api";

  React.useEffect(() => {
    fetch(`${apiBase}/provinces.json`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Gagal mengambil data provinsi:", err));
  }, [apiBase]);

  React.useEffect(() => {
    if (!selectedProvinceId) {
      setRegencies([]);
      return;
    }
    fetch(`${apiBase}/regencies/${selectedProvinceId}.json`)
      .then((res) => res.json())
      .then((data) => {
        setRegencies(data);
      })
      .catch((err) => console.error("Gagal mengambil data kabupaten:", err));
  }, [selectedProvinceId, apiBase]);

  const toTitleCase = (str: string): string => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvinceId) {
      setErrorMsg("Silakan pilih Provinsi terlebih dahulu.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setSearchTriggered(true);

    const res = await getRegionalPriceAction(selectedProvinceId, selectedRegencyId);
    setIsLoading(false);

    if (res.success) {
      setAveragePrice(res.averagePrice || 0);
      setReports((res.reports as Report[]) || []);
    } else {
      setErrorMsg(res.error || "Gagal mencari data harga.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Provinsi <span className="text-rose-500">*</span>
          </label>
          <Combobox
            items={provinces}
            value={provinces.find((p) => p.id === selectedProvinceId) || null}
            onValueChange={(prov: typeof provinces[number] | null) => {
              setSelectedProvinceId(prov?.id || "");
              setSelectedRegencyId("");
            }}
            itemToStringLabel={(prov) => prov ? toTitleCase(prov.name) : ""}
            isItemEqualToValue={(a, b) => (a && b) ? a.id === b.id : a === b}
          >
            <ComboboxInput placeholder="Pilih Provinsi..." className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl" />
            <ComboboxContent className="w-[var(--anchor-width)]">
              <ComboboxList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-60 overflow-y-auto p-1 shadow-lg">
                {(prov: typeof provinces[number]) => (
                  <ComboboxItem
                    key={prov.id}
                    value={prov}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors text-left cursor-pointer"
                  >
                    {toTitleCase(prov.name)}
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxEmpty className="px-3 py-2 text-xs text-zinc-400 dark:text-zinc-500 text-center">
                Provinsi tidak ditemukan.
              </ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Kabupaten / Kota <span className="text-zinc-400 font-normal">(Opsional)</span>
          </label>
          <Combobox
            items={regencies}
            value={regencies.find((r) => r.id === selectedRegencyId) || null}
            onValueChange={(reg: typeof regencies[number] | null) => {
              setSelectedRegencyId(reg?.id || "");
            }}
            disabled={!selectedProvinceId}
            itemToStringLabel={(reg) => reg ? toTitleCase(reg.name) : ""}
            isItemEqualToValue={(a, b) => (a && b) ? a.id === b.id : a === b}
          >
            <ComboboxInput placeholder="Pilih Kabupaten..." className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl" />
            <ComboboxContent className="w-[var(--anchor-width)]">
              <ComboboxList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-60 overflow-y-auto p-1 shadow-lg">
                {(reg: typeof regencies[number]) => (
                  <ComboboxItem
                    key={reg.id}
                    value={reg}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors text-left cursor-pointer"
                  >
                    {toTitleCase(reg.name)}
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxEmpty className="px-3 py-2 text-xs text-zinc-450 dark:text-zinc-500 text-center">
                Kabupaten tidak ditemukan.
              </ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-10 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" /> Cari Harga
            </>
          )}
        </Button>
      </form>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {/* Lookup results */}
      {searchTriggered && !isLoading && !errorMsg && (
        <div className="animate-in fade-in slide-in-from-bottom duration-300 space-y-6">
          {reports.length === 0 ? (
            <Card className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-10 text-center">
              <MapPin className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Belum Ada Laporan Harga</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Belum ada peternak atau agen yang melaporkan harga telur ayam ras untuk wilayah yang Anda cari saat ini.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Average Price Callout */}
              <div className="lg:col-span-1 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white rounded-3xl p-6 shadow-xl border border-amber-400/20 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xs w-fit block">
                  Rerata Wilayah
                </span>
                
                <h3 className="text-sm font-semibold text-amber-100/90 mt-5 uppercase tracking-wider block">Harga Rata-Rata</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black tracking-tight text-white">
                    Rp {averagePrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-amber-150 font-bold">/ kg</span>
                </div>

                <p className="text-[11px] text-amber-50/90 mt-4 leading-relaxed border-t border-white/10 pt-4">
                  Dihitung berdasarkan {reports.length} laporan terbaru dari komunitas di wilayah terpilih.
                </p>
              </div>

              {/* Individual Reports Timeline */}
              <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-500" /> Rincian Laporan Lapangan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {reports.map((report) => (
                      <div key={report.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                              Rp {report.price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-zinc-400">/ kg</span>
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                              {report.region}
                            </span>
                            <span>•</span>
                            <span>Dilaporkan oleh: {report.author}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
                          <Calendar className="w-3 h-3" /> {report.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
