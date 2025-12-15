// 1. Haritayı Başlat (İzmir Merkezi)
var map = L.map('map').setView([38.4237, 27.1428], 12);

// 2. Harita Kaplamasını Ekle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// --- VERİLER: İZMİR METRO HATTI ---
const metroStations = [
    { name: "Evka-3", coords: [38.4650, 27.2286], status: "active", desc: "Bornova - Üniversite Hattı" },
    { name: "Ege Üniversitesi", coords: [38.4615, 27.2210], status: "active", desc: "Kampüs Girişi" },
    { name: "Bornova", coords: [38.4590, 27.2130], status: "active", desc: "Meydan Çıkışı" },
    { name: "Bölge", coords: [38.4547, 27.2011], status: "active", desc: "Sanayi Bölgesi" },
    { name: "Sanayi", coords: [38.4490, 27.1890], status: "active", desc: "2. Sanayi Sitesi" },
    { name: "Stadyum", coords: [38.4420, 27.1800], status: "active", desc: "Halkapınar Spor Salonu" },
    { name: "Halkapınar", coords: [38.4344, 27.1686], status: "active", desc: "İZBAN Aktarma Merkezi" },
    { name: "Hilal", coords: [38.4280, 27.1550], status: "active", desc: "İZBAN Aktarma" },
    { name: "Basmane", coords: [38.4240, 27.1450], status: "inactive", desc: "Asansör Bakımda (Gar)" }, // Örnek kırmızı
    { name: "Çankaya", coords: [38.4224, 27.1360], status: "active", desc: "Kemeraltı Girişi" },
    { name: "Konak", coords: [38.4169, 27.1280], status: "active", desc: "Valilik ve Saat Kulesi" },
    { name: "Üçyol", coords: [38.4050, 27.1150], status: "active", desc: "Hatay Başlangıcı" },
    { name: "İzmirspor", coords: [38.4000, 27.1050], status: "active", desc: "Spor Tesisleri" },
    { name: "Hatay", coords: [38.3980, 27.0950], status: "active", desc: "Renkli Durağı" },
    { name: "Göztepe", coords: [38.3960, 27.0850], status: "active", desc: "Sahil Yolu Bağlantısı" },
    { name: "Poligon", coords: [38.3950, 27.0780], status: "active", desc: "Denizmen Parkı" },
    { name: "Fahrettin Altay", coords: [38.3971, 27.0700], status: "active", desc: "Son Durak (Eski)" },
    { name: "Balçova", coords: [38.3955, 27.0580], status: "active", desc: "AVM Bölgesi" },
    { name: "Çağdaş", coords: [38.3950, 27.0450], status: "active", desc: "Kültür Merkezi" },
    { name: "DEÜ Hastanesi", coords: [38.3945, 27.0320], status: "active", desc: "Üniversite Hastanesi" },
    { name: "Güzel Sanatlar", coords: [38.3940, 27.0200], status: "active", desc: "GSF Kampüsü" },
    { name: "Narlıdere", coords: [38.3935, 27.0050], status: "active", desc: "Merkez" },
    { name: "Şehitlik", coords: [38.3940, 26.9980], status: "active", desc: "Şehitlik Ziyaret Alanı" },
    { name: "Kaymakamlık", coords: [38.3950, 26.9914], status: "active", desc: "Yeni Son Durak" }
];

// --- 3. METRO HATTINI ÇİZ (Kırmızı Çizgi) ---
// Sadece koordinatları alıp bir dizi yapıyoruz
var latlngs = metroStations.map(station => station.coords);

// Polyline ile çiziyoruz
var polyline = L.polyline(latlngs, {
    color: '#e74c3c', // Metro kırmızısı
    weight: 6,
    opacity: 0.8,
    lineCap: 'round'
}).addTo(map);

// Haritayı bu çizgiye odakla
map.fitBounds(polyline.getBounds());


// --- 4. SOL PANELDE LİSTELEME VE MARKER EKLEME ---
const listContainer = document.getElementById('station-list');
const countLabel = document.getElementById('result-count');

// Toplam sayıyı güncelle
countLabel.innerText = `${metroStations.length} istasyon bulundu`;

metroStations.forEach(station => {
    // A. Haritaya Marker Ekle
    L.circleMarker(station.coords, {
        color: station.status === 'active' ? '#27ae60' : '#c0392b',
        radius: 8,
        fillOpacity: 1
    }).bindPopup(`<b>${station.name}</b><br>${station.desc}`).addTo(map);

    // B. Sol Panele Kart Ekle (HTML Oluşturma)
    const card = document.createElement('div');
    card.className = 'station-card';
    
    // Duruma göre yeşil/kırmızı nokta ve metin
    const statusColor = station.status === 'active' ? 'dot-green' : 'dot-red';
    const statusText = station.status === 'active' ? 'Çalışıyor' : 'Çalışmıyor / Bakımda';

    card.innerHTML = `
        <div class="card-header">
            <i class="fas fa-subway card-icon"></i>
            <span class="status-dot ${statusColor}"></span>
            <span style="font-size:0.9rem; color:#555;">${statusText}</span>
        </div>
        <div class="card-title">${station.name} Metro İstasyonu</div>
        <div class="card-info">
            Metro Hattı<br>
            <span style="font-size:0.8rem; color:#888;">Güncelleme: Şimdi</span>
        </div>
    `;

    // Karta tıklayınca haritada o istasyona git
    card.addEventListener('click', () => {
        map.flyTo(station.coords, 16, {
            animate: true,
            duration: 1.5
        });
    });

    listContainer.appendChild(card);
});
