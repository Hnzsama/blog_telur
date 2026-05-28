export async function seedPosts(prisma: any, users: any[]) {
  console.log("Seeding regional blog posts with API IDs...");

  // Find bloggers
  const bloggerBlitar = users.find(u => u.email === "peternak@hargatelur.id") || users[0];
  const bloggerJakarta = users.find(u => u.email === "jakarta@hargatelur.id") || users[0];
  const bloggerSurabaya = users.find(u => u.email === "surabaya@hargatelur.id") || users[0];
  const bloggerMedan = users.find(u => u.email === "medan@hargatelur.id") || users[0];
  const bloggerBandung = users.find(u => u.email === "bandung@hargatelur.id") || users[0];

  const postsData = [
    {
      title: "Tren Harga Telur di Kabupaten Blitar Mulai Menguat",
      slug: "tren-harga-telur-kabupaten-blitar-menguat",
      content: "Menurut laporan dari beberapa peternak mandiri di Kabupaten Blitar, harga telur ayam ras berada di posisi stabil tinggi. Hal ini dipengaruhi oleh harga jagung lokal yang mulai merangkak naik serta peningkatan permintaan dari pedagang besar luar daerah. Pasokan di tingkat kandang terpantau lancar dan mencukupi permintaan harian.",
      priceRegion: "Kabupaten Blitar, Jawa Timur",
      eggPrice: 24200,
      province: "35", // Jawa Timur ID
      regency: "3505", // Kabupaten Blitar ID
      district: "",
      authorId: bloggerBlitar.id,
      imageUrl: "/uploads/chicken-farm.webp",
      altText: "Kandang Ayam Blitar"
    },
    {
      title: "Harga Eceran Telur Ayam Ras Wonokromo Surabaya Menjelang Akhir Pekan",
      slug: "harga-telur-wonokromo-surabaya-akhir-pekan",
      content: "Di Pasar Wonokromo Kota Surabaya, harga telur eceran bertengger di kisaran Rp 25.000 per kg. Pedagang menyatakan pasokan dari sentra produksi Blitar dan Kediri masuk secara teratur setiap subuh, menjaga kestabilan stok di pasar retail. Permintaan konsumen rumah tangga relatif normal tanpa lonjakan drastis.",
      priceRegion: "Wonokromo, Kota Surabaya, Jawa Timur",
      eggPrice: 25000,
      province: "35", // Jawa Timur ID
      regency: "3578", // Kota Surabaya ID
      district: "",
      authorId: bloggerSurabaya.id,
      imageUrl: "/uploads/eggs-basket.webp",
      altText: "Tumpukan Telur Segar Surabaya"
    },
    {
      title: "Laporan Pasar: Harga Telur Ayam Ras di Kota Jakarta Selatan Stabil",
      slug: "laporan-pasar-harga-telur-jakarta-selatan-stabil",
      content: "Hasil pantauan di Pasar Minggu Kota Jakarta Selatan menunjukkan harga jual eceran telur ayam stabil di Rp 27.500 per kg. Para distributor mengonfirmasi pengiriman pasokan dari Jawa Tengah dan Jawa Timur berjalan lancar tanpa kendala logistik berarti. Hal ini menenangkan kekhawatiran pedagang akan kenaikan harga musiman.",
      priceRegion: "Kota Jakarta Selatan, Dki Jakarta",
      eggPrice: 27500,
      province: "31", // DKI Jakarta ID
      regency: "3171", // Kota Jakarta Selatan ID
      district: "",
      authorId: bloggerJakarta.id,
      imageUrl: "/uploads/eggs-basket.webp",
      altText: "Keranjang Telur Jakarta"
    },
    {
      title: "Kenaikan Ongkos Kirim Memicu Penyesuaian Harga Telur di Kota Bandung",
      slug: "penyesuaian-harga-telur-kota-bandung",
      content: "Distributor telur ayam di Kota Bandung melaporkan adanya penyesuaian harga jual eceran di kisaran Rp 26.800 per kg menyusul naiknya tarif armada logistik antarkota. Meski demikian, stok barang di gudang-gudang utama Jawa Barat dijamin aman hingga dua pekan mendatang untuk menjaga stabilitas pangan daerah.",
      priceRegion: "Kota Bandung, Jawa Barat",
      eggPrice: 26800,
      province: "32", // Jawa Barat ID
      regency: "3273", // Kota Bandung ID
      district: "",
      authorId: bloggerBandung.id,
      imageUrl: "/uploads/chicken-farm.webp",
      altText: "Distribusi Telur Bandung"
    },
    {
      title: "Laporan Mingguan Harga Telur Ayam Ras Kota Medan",
      slug: "laporan-mingguan-harga-telur-kota-medan",
      content: "Peternak di Deli Serdang dan agen penyalur di Kota Medan menyatakan pasokan telur ayam ras melimpah dengan harga stabil berkisar Rp 26.000 per kg. Beberapa peternak menyiasati tingginya biaya pakan impor dengan pencampuran bahan baku pakan mandiri berkualitas tinggi untuk menjaga margin keuntungan kandang.",
      priceRegion: "Kota Medan, Sumatera Utara",
      eggPrice: 26000,
      province: "12", // Sumatera Utara ID
      regency: "1275", // Kota Medan ID
      district: "",
      authorId: bloggerMedan.id,
      imageUrl: "/uploads/eggs-basket.webp",
      altText: "Telur Ayam Ras Medan"
    },
    {
      title: "Pantauan Harga Telur Ayam Ras Kecamatan Kebonsari Kabupaten Madiun",
      slug: "pantauan-harga-telur-kebonsari-madiun",
      content: "Laporan langsung dari agen sembako di Kecamatan Kebonsari Kabupaten Madiun mencatat harga eceran telur Rp 24.500 per kg. Distribusi lokal langsung dari peternak petelur sekitar wilayah Kebonsari membuat harga jual di tingkat konsumen menjadi lebih terjangkau dibandingkan wilayah perkotaan besar.",
      priceRegion: "Kebonsari, Kabupaten Madiun, Jawa Timur",
      eggPrice: 24500,
      province: "35", // Jawa Timur ID
      regency: "3519", // Kabupaten Madiun ID
      district: "",
      authorId: bloggerBlitar.id,
      imageUrl: "/uploads/chicken-farm.webp",
      altText: "Telur Ayam Kebonsari Madiun"
    }
  ];

  for (const postItem of postsData) {
    // Delete existing sample posts if they were seeded with string names to prevent duplicate or conflicting entries
    const existing = await prisma.post.findUnique({
      where: { slug: postItem.slug }
    });

    if (existing) {
      await prisma.post.delete({
        where: { slug: postItem.slug }
      });
      console.log(`Removed existing post with old string regional fields: ${postItem.slug}`);
    }

    const createdPost = await prisma.post.create({
      data: {
        title: postItem.title,
        slug: postItem.slug,
        content: postItem.content,
        priceRegion: postItem.priceRegion,
        eggPrice: postItem.eggPrice,
        province: postItem.province,
        regency: postItem.regency,
        district: postItem.district,
        authorId: postItem.authorId,
        published: true
      }
    });

    await prisma.postImage.create({
      data: {
        url: postItem.imageUrl,
        filename: postItem.imageUrl.split("/").pop() || "",
        mimeType: "image/webp",
        size: 200000,
        width: 1024,
        height: 1024,
        altText: postItem.altText,
        postId: createdPost.id
      }
    });

    console.log(`Seeded post (with IDs): ${postItem.title}`);
  }

  console.log("All sample blog posts and images seeded successfully with region IDs.");
}
