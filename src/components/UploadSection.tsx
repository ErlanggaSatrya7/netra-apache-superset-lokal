// Cari bagian ini di frontend kamu:
const response = await fetch("/api/upload", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    data: jsonData, // Data array hasil baca excel
    fileName: selectedFile.name, // TAMBAHKAN INI agar tidak "Unknown File"
  }),
});
