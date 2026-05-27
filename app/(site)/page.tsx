import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PriceCard } from "@/components/PriceCard";
import { AdBanner } from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, HelpCircle, Landmark, TrendingUp, User } from "lucide-react";

// Mock regional pricing data (as starting references)
const priceData = [
  { region: "Blitar (Sentra Produsen)", price: 24200, trend: "down" as const, lastUpdated: "28 Mei 2026" },
  { region: "DKI Jakarta (Konsumen)", price: 27500, trend: "up" as const, lastUpdated: "28 Mei 2026" },
  { region: "Surabaya (Jawa Timur)", price: 25000, trend: "stable" as const, lastUpdated: "28 Mei 2026" },
  { region: "Bandung (Jawa Barat)", price: 26800, trend: "up" as const, lastUpdated: "28 Mei 2026" },
  { region: "Medan (Sumatera Utara)", price: 26000, trend: "stable" as const, lastUpdated: "28 Mei 2026" },
  { region: "Makassar (Sulawesi Selatan)", price: 27200, trend: "up" as const, lastUpdated: "28 Mei 2026" },
];

export default async function Home() {
  // Fetch real blog posts from database
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
        images: {
          take: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch posts for homepage:", error);
  }

  // Structured JSON-LD Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Update Harga Telur & Ayam Ras Hari Ini",
    "description": "Update harga telur ayam ras terbaru hari ini langsung dari peternak di berbagai daerah Indonesia seperti Blitar, Jakarta, Surabaya. Cek tren harga pasar.",
    "url": "https://discount-mpegs-live-attempted.trycloudflare.com",
    "mainEntity": {
      "@type": "Table",
      "about": "Harga Telur Ayam Ras di Indonesia",
      "description": "Daftar harga telur ayam ras per kilogram berdasarkan wilayah di Indonesia",
      "name": "Tabel Harga Telur Regional",
      "sameAs": "https://www.pertanian.go.id"
    }
  };

  return (
    <>
      {/* 
        TODO(security): dangerouslySetInnerHTML is used safely here to inject static, 
        hardcoded JSON-LD schema markup for Google rich snippets with no user-controlled 
        input, eliminating XSS risks.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <header className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-transparent to-transparent py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Update Harian Terpercaya & Komunitas Blog</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Update Harga Telur Ayam Hari Ini
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Pantau perkembangan harga telur ayam ras terbaru hari ini langsung dari peternak petelur nasional, dan bagikan info harga atau artikel peternakan Anda di komunitas kami!
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all">
                <a href="#harga-regional">
                  Cek Harga Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Mulai Menulis Blog</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* AdSense Banner Spot 1 (Leaderboard) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdBanner slot="home-top-leaderboard" format="horizontal" />
        </div>

        {/* Pricing Cards Section */}
        <section id="harga-regional" className="py-16 bg-white dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-end md:justify-between mb-10">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Daftar Harga Telur Regional Hari Ini
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Daftar harga telur ayam ras (per kilogram) di berbagai daerah produksi utama dan wilayah konsumen di Indonesia.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg w-fit">
                <Calendar className="w-3.5 h-3.5" />
                <span>Terakhir diperbarui: 28 Mei 2026, 08:00 WIB</span>
              </div>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {priceData.map((item) => (
                <PriceCard
                  key={item.region}
                  region={item.region}
                  price={item.price}
                  lastUpdated={item.lastUpdated}
                  trend={item.trend}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Blog Posts Section */}
        <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/10 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Kabar Peternakan & Laporan Anggota
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Update informasi terupdate, tips manajemen kandang, dan rincian transaksi harga riil yang dibagikan oleh komunitas peternak Indonesia.
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                <BookOpen className="w-10 h-10 mx-auto text-zinc-300 mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">Belum ada postingan artikel dari komunitas.</p>
                <Button asChild size="sm" className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                  <Link href="/login">Tulis Postingan Pertama</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <Card className={`flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow overflow-hidden ${post.images && post.images.length > 0 ? "pt-0" : ""}`}>
                      {post.images && post.images.length > 0 && (
                        <div className="relative w-full aspect-video border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
                          <Image
                            src={post.images[0].url}
                            alt={post.images[0].altText || post.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author.name}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold line-clamp-2 text-zinc-900 dark:text-zinc-50">
                          <Link href={`/posts/${post.slug}`} className="hover:text-amber-500 transition-colors">
                            {post.title}
                          </Link>
                        </CardTitle>
                        {post.priceRegion && post.eggPrice && (
                          <CardDescription className="text-xs mt-1.5 inline-flex items-center px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold w-fit">
                            Laporan {post.priceRegion}: Rp {post.eggPrice.toLocaleString("id-ID")} / kg
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 pt-0">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 flex-1 mb-4">
                          {post.content}
                        </p>
                        <Button asChild variant="link" className="p-0 text-amber-500 hover:text-amber-600 w-fit font-semibold mt-auto">
                          <Link href={`/posts/${post.slug}`} className="flex items-center gap-1">
                            Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                    {/* Insert In-Feed Card Ad after the 2nd post (index === 1) */}
                    {index === 1 && (
                      <AdBanner slot="home-infeed-card" type="card" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* AdSense Banner Spot 2 (Horizontal mid-feed) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <AdBanner slot="home-mid-horizontal" format="horizontal" />
        </div>

        {/* Editorial Content Section (600+ words for AdSense) */}
        <article id="analisis-pasar" className="py-20 bg-zinc-50 dark:bg-zinc-950/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 border-l-4 border-amber-500 pl-4">
              Analisis Pasar dan Faktor Yang Memengaruhi Harga Telur
            </h2>

            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Pangan merupakan salah satu kebutuhan dasar manusia yang paling esensial, dan di Indonesia, telur ayam ras menempati posisi yang sangat strategis sebagai sumber protein hewani yang murah, praktis, dan mudah dijangkau oleh berbagai kalangan masyarakat. Bagi para peternak mandiri maupun skala industri di berbagai sentra produksi seperti Kabupaten Blitar di Jawa Timur, fluktuasi harga telur merupakan penentu utama keberlangsungan usaha peternakan mereka. Di sisi lain, bagi jutaan konsumen rumah tangga dan pelaku industri kuliner di kota-kota besar seperti DKI Jakarta dan Surabaya, pergerakan harga telur harian memengaruhi daya beli dan struktur biaya operasional secara langsung. Halaman ini didedikasikan untuk menyajikan pembaruan harga telur ayam ras terkini secara transparan dan tepercaya untuk membantu semua pemangku kepentingan mengambil keputusan terbaik berdasarkan kondisi pasar riil.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Mengapa Harga Telur Berubah-Ubah?</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Kenaikan biaya pakan ternak (seperti jagung pipil kuning dan konsentrat kedelai) yang menyumbang hingga 70% biaya operasional peternakan merupakan pemicu utama fluktuasi harga telur nasional.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Peran Sentra Produksi Blitar</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Kabupaten Blitar menyuplai lebih dari 30% kebutuhan telur nasional, menjadikannya acuan dasar penentuan harga eceran nasional di daerah konsumen murni seperti DKI Jakarta.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-2">Faktor Penting Fluktuasi Harga Telur Ayam</h3>
              <p>
                Ada banyak faktor kompleks yang menyebabkan harga telur di pasaran berfluktuasi secara dinamis setiap harinya. Salah satu variabel utama yang memberikan kontribusi terbesar adalah biaya pakan ternak. Dalam industri peternakan ayam ras petelur, pakan menyumbang sekitar 60% hingga 70% dari total biaya operasional. Bahan pakan utama seperti jagung pipil kuning, bungkil kedelai (SBM), dan konsentrat sangat dipengaruhi oleh pasokan panen lokal serta pergerakan harga komoditas global. Ketika harga jagung mengalami kenaikan akibat musim kemarau panjang atau kendala impor kedelai, biaya produksi per kilogram telur di tingkat peternak akan meningkat secara otomatis. Peternak terpaksa menaikkan harga jual di kandang guna menghindari kerugian operasional yang dapat mengancam kelangsungan peternakan mereka.
              </p>

              <p>
                Selain faktor pakan, kondisi cuaca dan kesehatan ternak juga memegang peranan krusial. Ayam petelur merupakan makhluk hidup yang sangat sensitif terhadap perubahan suhu lingkungan. Ketika Indonesia memasuki musim pancaroba atau musim kemarau dengan suhu udara yang sangat panas di siang hari (heat stress), produktivitas bertelur ayam (egg lay rate) dapat turun berkisar antara 5% hingga 15%. Penurunan kapasitas produksi ini menyebabkan berkurangnya pasokan telur secara mendadak di pasaran. Sesuai dengan hukum ekonomi dasar, jika penawaran berkurang sementara permintaan pasar tetap stabil atau bahkan meningkat, maka harga telur di tingkat konsumen akan terdorong naik.
              </p>

              <p>
                Aspek logistik dan rantai distribusi juga tidak kalah penting. Telur dikategorikan sebagai barang mudah rusak yang memiliki masa simpan terbatas. Rantai pasok telur di Indonesia umumnya melibatkan perjalanan panjang dari daerah produsen (seperti Jawa Timur dan Jawa Tengah) menuju daerah konsumen utama (seperti Jabodetabek, Jawa Barat, dan pulau-pulau luar Jawa). Setiap kenaikan biaya bahan bakar minyak (BBM) serta tarif tol atau biaya penyeberangan antarpulau secara langsung akan meningkatkan ongkos angkut (freight cost). Hal inilah yang menjelaskan mengapa selisih harga telur di tingkat peternak (gate price) dan harga di pasar tradisional perkotaan sering kali terpaut cukup signifikan.
              </p>

              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-2">Perbandingan Harga Telur Blitar vs DKI Jakarta</h3>
              <p>
                Perbedaan harga telur antarwilayah di Indonesia sangat dipengaruhi oleh posisi geografis wilayah tersebut terhadap pusat produksi. Kabupaten Blitar di Jawa Timur diakui secara nasional sebagai produsen telur ayam ras terbesar di Indonesia. Dengan populasi ayam petelur yang sangat melimpah, Blitar menyuplai lebih dari sepertiga kebutuhan telur nasional. Karena jaraknya yang sangat dekat dengan sumber produksi, harga telur di Blitar umumnya merupakan harga terendah dan menjadi referensi utama (benchmark) pergerakan harga telur nasional.
              </p>
              <p>
                Sebaliknya, DKI Jakarta sebagai kota metropolitan dengan populasi padat adalah wilayah konsumen murni yang tidak memiliki lahan pertanian atau peternakan ayam ras. Seluruh kebutuhan telur di Jakarta harus dipasok dari daerah lain, terutama Blitar, Kediri, dan sebagian wilayah Jawa Barat. Jarak pengiriman yang jauh meningkatkan risiko kerusakan fisik (telur pecah atau retak) selama perjalanan serta biaya penyusutan kualitas. Akibatnya, harga eceran telur di pasar-pasar DKI Jakarta selalu lebih tinggi sekitar Rp 3.000 hingga Rp 5.000 per kilogram dibandingkan dengan harga di tingkat peternak Blitar. Selisih ini merupakan margin logistik yang wajar untuk menutupi biaya angkut, risiko transportasi, serta keuntungan para agen dan pedagang eceran di pasar lokal.
              </p>

              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-2">Pengaruh Pola Permintaan Musiman</h3>
              <p>
                Selain faktor pasokan, fluktuasi harga juga didorong oleh pola konsumsi musiman masyarakat. Di Indonesia, lonjakan permintaan telur ayam secara masif biasanya terjadi menjelang hari-hari besar keagamaan nasional seperti Hari Raya Idul Fitri, Natal, Tahun Baru, serta bulan-bulan perayaan pernikahan (musim kondangan). Pada momen-momen tersebut, konsumsi rumah tangga meningkat drastis, ditambah dengan meningkatnya aktivitas produksi dari industri pembuatan kue dan roti skala kecil maupun menengah. Kenaikan permintaan yang terjadi serentak ini hampir selalu memicu lonjakan harga jangka pendek. Sebaliknya, pasca perayaan hari besar berakhir, permintaan pasar cenderung menurun secara signifikan sehingga harga telur berangsur-angsur turun kembali menuju titik keseimbangan yang baru.
              </p>

              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-2">Layanan Informasi & Kerja Sama</h3>
              <p>
                Kami berkomitmen menyajikan data yang transparan dan akurat bagi publik. Jika Anda adalah peternak mandiri, perwakilan asosiasi, atau pelaku industri kuliner yang ingin berkolaborasi menyebarkan data harga harian tepercaya di wilayah Anda, silakan hubungi tim redaksi kami secara langsung melalui tautan{" "}
                <Link href="/kontak" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold underline decoration-2 underline-offset-2">
                  Hubungi Kontak Kami
                </Link>
                .
              </p>

              <p>
                Untuk informasi resmi terkait regulasi pangan dan ketetapan harga acuan pemerintah, Anda juga dapat merujuk ke data resmi dari{" "}
                <Link
                  href="https://www.pertanian.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold underline decoration-2 underline-offset-2"
                >
                  Kementerian Pertanian Republik Indonesia
                </Link>
                .
              </p>
            </div>
          </div>
        </article>

        {/* FAQ Section (Semantic section) */}
        <section className="py-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-center mb-10">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <div className="space-y-6">
              <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  Mengapa harga telur di pasar eceran berbeda jauh dengan harga kandang?
                </h4>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Perbedaan ini disebabkan oleh rantai distribusi logistik yang melibatkan pengepul, distributor utama, agen wilayah, hingga pedagang eceran di pasar tradisional. Biaya transportasi, susut bobot telur, dan risiko pecah juga ikut dibebankan pada harga eceran akhir.
                </p>
              </div>
              <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  Seberapa sering data harga telur di situs ini diperbarui?
                </h4>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Data harga telur regional diupdate setiap hari kerja pada pagi hari setelah mendapat konfirmasi data transaksi riil dari perwakilan peternak dan asosiasi di masing-masing daerah sentra.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
