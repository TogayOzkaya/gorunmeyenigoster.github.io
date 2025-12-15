// 1. Haritayı Başlat (Konum: İzmir Alsancak civarı)
var map = L.map('map').setView([38.4237, 27.1428], 13);

// 2. Harita Katmanını Ekle (OpenStreetMap kullanıyoruz - Ücretsiz)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. Örnek Bir İşaretçi Ekle (Alsancak İskelesi)
var marker = L.marker([38.4381, 27.1418]).addTo(map);

// İşaretçiye tıklayınca çıkacak baloncuğu ayarla
marker.bindPopup("<b>Alsancak İskelesi</b><br>Erişilebilir Rampa: Var<br>Engelli WC: Var").openPopup();

// 4. Modal (Pop-up) Kontrolü
const modal = document.getElementById('addModal');

// Modalı Açan Fonksiyon
function openModal() {
    modal.style.display = 'flex';
}

// Modalı Kapatan Fonksiyon
function closeModal() {
    modal.style.display = 'none';
}

// Modalın dışına tıklanırsa kapat
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Form gönderildiğinde (Şimdilik sadece uyarı verelim)
document.getElementById('placeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Teşekkürler! Mekan önerisi sisteme kaydedildi (Demo).");
    closeModal();
});
// Metro İstasyonları İçin Özel İkon Tasarımı
var metroIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Örnek Metro ikonu (Kırmızı M)
    iconSize: [30, 30], // İkon boyutu
    iconAnchor: [15, 30], // İkonun haritaya batacağı nokta
    popupAnchor: [0, -30] // Baloncuğun açılacağı nokta
});
// --- İZMİR METRO HATTI VERİLERİ ---
const metroStations = [
    { name: "Evka-3", coords: [38.4650, 27.2286] },
    { name: "Ege Üniversitesi", coords: [38.4615, 27.2210] },
    { name: "Bornova", coords: [38.4590, 27.2130] },
    { name: "Bölge", coords: [38.4547, 27.2011] },
    { name: "Sanayi", coords: [38.4490, 27.1890] },
    { name: "Stadyum", coords: [38.4420, 27.1800] },
    { name: "Halkapınar", coords: [38.4344, 27.1686] }, // Aktarma Merkezi
    { name: "Hilal", coords: [38.4280, 27.1550] },
    { name: "Basmane", coords: [38.4240, 27.1450] },
    { name: "Çankaya", coords: [38.4224, 27.1360] },
    { name: "Konak", coords: [38.4169, 27.1280] }, // Konak Meydanı
    { name: "Üçyol", coords: [38.4050, 27.1150] },
    { name: "İzmirspor", coords: [38.4000, 27.1050] },
    { name: "Hatay", coords: [38.3980, 27.0950] },
    { name: "Göztepe", coords: [38.3960, 27.0850] },
    { name: "Poligon", coords: [38.3950, 27.0780] },
    { name: "Fahrettin Altay", coords: [38.3971, 27.0700] },
    { name: "Balçova", coords: [38.3955, 27.0580] },
    { name: "Çağdaş", coords: [38.3950, 27.0450] },
    { name: "DEÜ Hastanesi", coords: [38.3945, 27.0320] },
    { name: "Güzel Sanatlar", coords: [38.3940, 27.0200] },
    { name: "Narlıdere", coords: [38.3935, 27.0050] },
    { name: "Şehitlik", coords: [38.3940, 26.9980] },
    { name: "Kaymakamlık", coords: [38.3950, 26.9914] }
];

// İstasyon Koordinatlarını Sadece Çizgi İçin Ayır (Polyline)
var latlngs = metroStations.map(station => station.coords);

// 1. Metro Hattını Çiz (Kırmızı Çizgi)
var polyline = L.polyline(latlngs, {
    color: 'red',       // Çizgi rengi
    weight: 5,          // Kalınlık
    opacity: 0.7,       // Şeffaflık
    dashArray: '10, 10' // Kesik çizgi efekti (Opsiyonel, düz çizgi için sil)
}).addTo(map);

// 2. İstasyonları İşaretle
metroStations.forEach(station => {
    L.marker(station.coords, {icon: metroIcon}) // Özel ikon kullanıyorsan buraya ekle
     .bindPopup(`<b>${station.name}</b><br>Metro İstasyonu`)
     .addTo(map);
});

// Haritayı hatta odakla (Tüm istasyonları içine alacak şekilde zoom yapar)
map.fitBounds(polyline.getBounds());
