"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, BookOpen, Plus, Tag, Globe, Lock, 
  Trash2, AlertCircle, Upload, ZoomIn, ZoomOut, Check, Crop
} from "lucide-react";
import { createPostAction, updatePostAction, deletePostImageAction } from "@/app/actions/postActions";
import { toast } from "sonner";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface PostFormClientProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  mode: "create" | "edit";
  post?: {
    id: number;
    title: string;
    content: string;
    eggPrice: number | null;
    priceRegion: string | null;
    province: string | null;
    regency: string | null;
    published: boolean;
    images?: Array<{
      id: number;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      width: number;
      height: number;
      altText: string | null;
    }>;
  };
}

export function PostFormClient({ user, mode, post }: PostFormClientProps) {
  const router = useRouter();
  const [isActionPending, setIsActionPending] = React.useState(false);

  // Regional States
  const [provinces, setProvinces] = React.useState<Array<{ id: string; name: string }>>([]);
  const [regencies, setRegencies] = React.useState<Array<{ id: string; province_id: string; name: string }>>([]);
  const [selectedProvinceId, setSelectedProvinceId] = React.useState(post?.province || "");
  const [selectedRegencies, setSelectedRegencies] = React.useState<Array<{ id: string; name: string }>>([]);
  const [priceRegionText, setPriceRegionText] = React.useState(post?.priceRegion || "");

  // Image Upload, Preview & Cropper States
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [croppedFile, setCroppedFile] = React.useState<File | null>(null);
  
  // Cropper specific states
  const [cropperSrc, setCropperSrc] = React.useState<string | null>(null);
  const [scale, setScale] = React.useState(1.0);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Post existing images (for edit mode)
  const [uploadedImages, setUploadedImages] = React.useState(post?.images || []);

  const apiBase = process.env.NEXT_PUBLIC_WILAYAH_API || "https://hnzsama.github.io/api-wilayah-indonesia/api";

  // Fetch provinces
  React.useEffect(() => {
    fetch(`${apiBase}/provinces.json`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Gagal mengambil data provinsi:", err));
  }, [apiBase]);

  // Fetch regencies based on province
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

  // Set initial selected regencies on edit mode when regencies list is loaded
  React.useEffect(() => {
    if (post?.regency && regencies.length > 0) {
      const ids = post.regency.split(",");
      const matches = regencies.filter((r) => ids.includes(r.id));
      setSelectedRegencies(matches);
    } else if (!post?.regency) {
      setSelectedRegencies([]);
    }
  }, [regencies, post]);

  const toTitleCase = (str: string): string => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Autocomplete price region text
  React.useEffect(() => {
    if (!selectedProvinceId || mode === "edit") return;

    const provName = provinces.find((p) => p.id === selectedProvinceId)?.name || "";
    const regNames = selectedRegencies.map((r) => toTitleCase(r.name)).join(", ");

    const parts: string[] = [];
    if (regNames) parts.push(regNames);
    if (provName) parts.push(toTitleCase(provName));

    if (parts.length > 0) {
      setPriceRegionText(parts.join(", "));
    }
  }, [selectedProvinceId, selectedRegencies, provinces, mode]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Load file as data URL to launch cropper modal
    const reader = new FileReader();
    reader.onload = () => {
      setCropperSrc(reader.result as string);
      setScale(1.0);
      setOffsetX(0);
      setOffsetY(0);
    };
    reader.readAsDataURL(file);
  };

  // Pointer drag crop handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Save the cropped image from canvas
  const handleCropSave = () => {
    if (!cropperSrc) return;

    const img = new window.Image();
    img.src = cropperSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 576; // 16:9
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clean background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 576);

      // Calculations to map container dimensions (typically ~640x360 box) to canvas dimensions (1024x576)
      const factor = 1024 / 640;

      ctx.save();
      ctx.translate(512, 288);
      ctx.scale(scale, scale);
      ctx.translate((offsetX * factor) / scale, (offsetY * factor) / scale);

      const imgAspect = img.width / img.height;
      const targetAspect = 1024 / 576;

      let drawW, drawH;
      if (imgAspect > targetAspect) {
        drawH = 576;
        drawW = 576 * imgAspect;
      } else {
        drawW = 1024;
        drawH = 1024 / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-cover.jpg", { type: "image/jpeg" });
          setCroppedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setCropperSrc(null); // Close crop view
          toast.success("Gambar berhasil dipotong!");
        }
      }, "image/jpeg", 0.9);
    };
  };

  // Handle post submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionPending(true);

    const formData = new FormData(e.currentTarget);
    
    // If we have a cropped file, append it under 'images' (replaces default input file list)
    if (croppedFile) {
      formData.delete("images");
      formData.append("images", croppedFile);
    }

    if (mode === "edit" && post) {
      formData.append("id", post.id.toString());
      const res = await updatePostAction(formData);
      setIsActionPending(false);
      
      if (res.success) {
        toast.success("Postingan berhasil disimpan!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal memperbarui postingan.");
      }
    } else {
      const res = await createPostAction(formData);
      setIsActionPending(false);
      
      if (res.success) {
        toast.success("Postingan berhasil diterbitkan!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menerbitkan postingan.");
      }
    }
  };

  // Delete individual image (edit mode)
  const handleDeleteUploadedImage = async (imgId: number) => {
    setIsActionPending(true);
    const res = await deletePostImageAction(imgId);
    setIsActionPending(false);

    if (res.success) {
      setUploadedImages(uploadedImages.filter((img) => img.id !== imgId));
      toast.success("Gambar berhasil dihapus.");
    } else {
      toast.error(res.error || "Gagal menghapus gambar.");
    }
  };

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild className="rounded-xl shadow-sm">
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-500" />
            {mode === "create" ? "Tulis Postingan Baru" : "Edit Postingan"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Kembali ke dashboard kelola artikel atau isikan konten postingan Anda di bawah.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
              Judul Artikel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={post?.title || ""}
              className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250 dark:border-zinc-850 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
              placeholder="Contoh: Perkembangan Harga Telur Blitar Mengalami Penurunan"
            />
          </div>

          {/* Regional Selection Section */}
          <div className="p-5 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/40 space-y-4">
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest block">
              Pilih Wilayah Terstruktur (API Indonesia)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="province" className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                  Provinsi
                </label>
                <Combobox
                  items={provinces}
                  value={provinces.find((p) => p.id === selectedProvinceId) || null}
                  onValueChange={(prov: typeof provinces[number] | null) => {
                    setSelectedProvinceId(prov?.id || "");
                    setSelectedRegencies([]);
                  }}
                  itemToStringLabel={(prov) => prov ? toTitleCase(prov.name) : ""}
                  isItemEqualToValue={(a, b) => (a && b) ? a.id === b.id : a === b}
                >
                  <ComboboxInput placeholder="Pilih Provinsi..." className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
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

              <div className="space-y-2">
                <label htmlFor="regency" className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                  Kab / Kota (Bisa Pilih Banyak)
                </label>
                <Combobox
                  items={regencies}
                  value={null}
                  onValueChange={(reg: typeof regencies[number] | null) => {
                    if (reg) {
                      if (!selectedRegencies.some((r) => r.id === reg.id)) {
                        setSelectedRegencies([...selectedRegencies, reg]);
                      }
                    }
                  }}
                  disabled={!selectedProvinceId}
                  itemToStringLabel={(reg) => reg ? toTitleCase(reg.name) : ""}
                  isItemEqualToValue={(a, b) => (a && b) ? a.id === b.id : a === b}
                >
                  <ComboboxInput placeholder={selectedProvinceId ? "Cari & Tambah Kabupaten/Kota..." : "Pilih Provinsi Terlebih Dahulu"} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
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
                    <ComboboxEmpty className="px-3 py-2 text-xs text-zinc-455 dark:text-zinc-550 text-center">
                      Kabupaten tidak ditemukan.
                    </ComboboxEmpty>
                  </ComboboxContent>
                </Combobox>

                {/* Selected Regencies Multi-Badges */}
                {selectedRegencies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {selectedRegencies.map((reg) => (
                      <span
                        key={reg.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/40"
                      >
                        {toTitleCase(reg.name)}
                        <button
                          type="button"
                          onClick={() => setSelectedRegencies(selectedRegencies.filter((r) => r.id !== reg.id))}
                          className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 font-bold ml-0.5 shrink-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="priceRegion" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
                Wilayah Terpilih / Input Manual <span className="text-zinc-400 font-normal normal-case">(Bebas Edit)</span>
              </label>
              <input
                type="text"
                id="priceRegion"
                name="priceRegion"
                value={priceRegionText}
                onChange={(e) => setPriceRegionText(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250 dark:border-zinc-850 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                placeholder="Contoh: Kebonsari, Kabupaten Madiun, Jawa Timur"
              />
              {/* Hidden inputs to save clean structured region IDs */}
              <input type="hidden" name="province" value={selectedProvinceId} />
              <input type="hidden" name="regency" value={selectedRegencies.map((r) => r.id).join(",")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="eggPrice" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
                Harga Telur / kg (Opsional)
              </label>
              <input
                type="number"
                id="eggPrice"
                name="eggPrice"
                defaultValue={post?.eggPrice || ""}
                className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250 dark:border-zinc-850 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                placeholder="Contoh: 24200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
              Isi Artikel <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              defaultValue={post?.content || ""}
              className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250 dark:border-zinc-850 rounded-xl placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 resize-none font-sans"
              placeholder="Tuliskan ulasan, data lengkap, maupun analisis kondisi pasar..."
            />
          </div>

          {/* Image Selector with Premium Preview & Cropper */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="images" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
                Cover Gambar Postingan
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Trigger */}
                <div className="relative group border-2 border-dashed border-zinc-300 hover:border-amber-500/60 dark:border-zinc-800 dark:hover:border-amber-500/50 rounded-2xl p-6 text-center transition-all bg-zinc-50/55 hover:bg-amber-500/5 dark:bg-zinc-950/20 dark:hover:bg-amber-500/2 flex flex-col justify-center min-h-[160px] cursor-pointer">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 mx-auto text-zinc-400 group-hover:text-amber-500 transition-colors" />
                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      {previewUrl ? "Ubah Cover Gambar" : "Pilih Cover Gambar"}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Klik untuk memilih gambar dari PC atau HP (Format 16:9 disarankan)
                    </div>
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/10 rounded-2xl p-4 flex flex-col justify-center items-center min-h-[160px] relative overflow-hidden">
                  {previewUrl ? (
                    <div className="w-full h-full relative flex flex-col items-center">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800">
                        <Image
                          src={previewUrl}
                          alt="Preview Sampul"
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/30 px-2 py-0.5 rounded-full mt-2.5 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Siap Diunggah (Sudah Dipotong)
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-zinc-400 dark:text-zinc-600 p-4">
                      <Crop className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-800" />
                      <p className="text-xs">Belum ada cover gambar baru terpilih.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cropper Section (Dynamic Inline Modal) */}
            {cropperSrc && (
              <div className="p-5 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-250">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Crop className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Potong Cover Gambar (Rasio 16:9)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCropperSrc(null)}
                    className="text-zinc-500 hover:text-zinc-300 font-black text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Viewport Frame */}
                  <div className="w-full flex justify-center">
                    <div 
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className="relative w-full max-w-[480px] aspect-video overflow-hidden rounded-xl border border-zinc-700 bg-black flex items-center justify-center cursor-move touch-none select-none relative shadow-inner group"
                    >
                      <div 
                        className="absolute pointer-events-none transition-transform select-none"
                        style={{
                          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cropperSrc}
                          alt="Crop Preview"
                          className="max-w-full max-h-[270px] object-contain select-none pointer-events-none"
                        />
                      </div>
                      {/* 16:9 crop overlay indicator guides */}
                      <div className="absolute inset-0 border border-amber-500/40 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40 group-hover:opacity-60 transition-opacity">
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-b border-white/20"></div>
                        <div className="border-r border-white/20"></div>
                        <div className="border-r border-white/20"></div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center leading-relaxed max-w-sm mx-auto">
                    💡 <strong>Petunjuk:</strong> Seret/geser gambar dengan jari/mouse untuk memposisikan bagian terbaik di dalam kotak, dan gunakan slider di bawah untuk memperbesar/memperkecil.
                  </div>

                  {/* Scale Controls */}
                  <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-w-sm mx-auto">
                    <ZoomOut className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input
                      type="range"
                      min="1"
                      max="3.5"
                      step="0.01"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <ZoomIn className="w-4 h-4 text-zinc-500 shrink-0" />
                  </div>

                  <div className="flex gap-3 justify-center max-w-xs mx-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCropperSrc(null)}
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 cursor-pointer h-9 text-xs rounded-xl"
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCropSave}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer h-9 text-xs rounded-xl flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Potong Gambar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Display already uploaded images (in edit mode) */}
          {mode === "edit" && uploadedImages.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
                Gambar Sampul Terunggah
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video relative">
                    <Image 
                      src={img.url} 
                      alt={img.altText || "Gambar postingan"} 
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteUploadedImage(img.id)}
                      disabled={isActionPending}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label htmlFor="published" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
                Status Publikasi
              </label>
              <select
                id="published"
                name="published"
                defaultValue={post?.published ? "true" : "false"}
                className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 dark:bg-zinc-800 cursor-pointer"
              >
                <option value="true">Publik (Tampilkan di halaman utama)</option>
                <option value="false">Draf (Sembunyikan / Simpan sebagai draf)</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1 h-11 rounded-xl font-bold transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isActionPending}
              className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              {isActionPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === "create" ? (
                "Terbitkan Postingan"
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
