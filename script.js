// 1. HARİTAYI BAŞLAT (OpenStreetMap - Ücretsiz)
var map = L.map('map').setView([38.4100, 27.0900], 13);

// Harita Katmanını Ekle (Görünüm)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. İSTASYON VERİLERİ (Hassas Koordinatlar - Leaflet Formatı)
const metroStations = [
    { 
        name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active",
        zones: [ {name: "Meydan Çıkışı", t: 30, l: 30}, {name: "Kaymakamlık Binası", t: 70, l: 60} ]
    },
    { 
        name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active",
        zones: [ {name: "Müze Yönü", t: 40, l: 50}, {name: "Şehitlik Kapısı", t: 60, l: 50} ]
    },
    { 
        name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active",
        zones: [ {name: "İtfaiye Çıkışı", t: 30, l: 40}, {name: "Çarşı Yönü", t: 70, l: 60} ]
    },
    { 
        name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active",
        zones: [ {name: "Fakülte Girişi", t: 50, l: 50} ]
    },
    { 
        name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active",
        zones: [ {name: "Hastane Ana Kapı", t: 20, l: 30}, {name: "Acil Servis Yönü", t: 60, l: 70} ]
    },
    { 
        name: "Çağdaş", coords: [38.3944, 27.0453], status: "active",
        zones: [ {name: "Kültür Merkezi", t: 50, l: 50} ]
    },
    { 
        name: "Balçova", coords: [38.3958, 27.0569], status: "active",
        zones: [ {name: "AVM'ler Bölgesi", t: 40, l: 40}, {name: "Otel Tarafı", t: 60, l: 60} ]
    },
    { 
        name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active",
        zones: [ {name: "AVM Çıkışı (İstinye)", t: 20, l: 20}, {name: "Aktarma Merkezi", t: 50, l: 50}, {name: "Pazar Yeri", t: 80, l: 80} ]
    },
    { 
        name: "Poligon", coords: [38.3933, 27.0850], status: "active",
        zones: [ {name: "Park Çıkışı", t: 40, l: 60}, {name: "Özel Okul Yönü", t: 60, l: 40} ]
    },
    { 
        name: "Göztepe", coords: [38.3961, 27.0944], status: "active",
        zones: [ {name: "Sahil (Yalı) Yönü", t: 30, l: 30}, {name: "Cadde (İlahiyat) Yönü", t: 70, l: 70} ]
    },
    { 
        name: "Hatay", coords: [38.4017, 27.1028], status: "active",
        zones: [ {name: "Renkli Durağı", t: 45, l: 45}, {name: "Pazar Yeri", t: 55, l: 55} ]
    },
    { 
        name: "İzmirspor", coords: [38.4017, 27.1106], status: "active",
        zones: [ {name: "Hastane Yönü", t: 30, l: 80}, {name: "Spor Tesisleri", t: 70, l: 20} ]
    },
    { 
        name: "Üçyol", coords: [38.4058, 27.1211], status: "active",
        zones: [ {name: "Betonyol Çıkışı", t: 20, l: 30}, {name: "Meydan Çıkışı", t: 80, l: 50} ]
    },
    { 
        name: "Konak", coords: [38.4169, 27.1281], status: "active",
        zones: [ {name: "Vapur İskelesi", t: 20, l: 20}, {name: "Kemeraltı Girişi", t: 60, l: 80}, {name: "Valilik Önü", t: 40, l: 50} ]
    },
    { 
        name: "Çankaya", coords: [38.4225, 27.1361], status: "inactive",
        zones: [ {name: "Fevzipaşa Bulvarı", t: 30, l: 30}, {name: "Mezarlıkbaşı", t: 70, l: 70} ]
    },
    { 
        name: "Basmane", coords: [38.4228, 27.1447], status: "active",
        zones: [ {name: "Gar Meydanı", t: 50, l: 40}, {name: "Fuar Kapısı", t: 30, l: 80} ]
    },
    { 
        name: "Hilal", coords: [38.4269, 27.1550], status: "active",
        zones: [ {name: "İZBAN Aktarma", t: 50, l: 50} ]
    },
    { 
        name: "Halkapınar", coords: [38.4344, 27.1686], status: "active",
        zones: [ {name: "İZBAN Aktarma", t: 30, l: 30}, {name: "Tramvay Durağı", t: 70, l: 70} ]
    },
    { 
        name: "Stadyum", coords: [38.4425, 27.1806], status: "active",
        zones: [ {name: "Stadyum Önü", t: 50, l: 50} ]
    },
    { 
        name: "Sanayi", coords: [38.4483, 27.1903], status: "active",
        zones: [ {name: "Sanayi Sitesi Girişi", t: 50, l: 50} ]
    },
    { 
        name: "Bölge", coords: [38.4547, 27.2011], status: "active",
        zones: [ {name: "Üniversite Yönü", t: 40, l: 40}, {name: "Ağaçlı Yol", t: 60, l: 60} ]
    },
    { 
        name: "Bornova", coords: [38.4583, 27.2125], status: "active",
        zones: [ {name: "Hastane/Kiler", t: 20, l: 20}, {name: "Küçük Park Yönü", t: 80, l: 80} ]
    },
    { 
        name: "Ege Üniversitesi", coords: [38.4615, 27.2210], status: "active",
        zones: [ {name: "Kampüs Ana Kapı", t: 50, l: 50} ]
    },
    { 
        name: "Evka-3", coords: [38.4650, 27.2286], status: "active",
        zones: [ {name: "Aktarma Merkezi", t: 50, l: 50}, {name: "Semt Garajı", t: 30, l: 70} ]
    }
];

// 3. METRO HATTINI ÇİZ (Kırmızı Çizgi)
var polyline = L.polyline(metroStations.map(s => s.coords), { 
    color: '#e74c3c', 
    weight: 6,
    opacity: 0.9,
    lineCap: 'round'
}).addTo(map);

map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

// 4. İŞARETÇİLER VE LİSTE
const listDiv = document.getElementById('station-list');
document.getElementById('result-count').innerText = `${metroStations.length} istasyon listelendi`;

metroStations.forEach(station => {
    // A. Haritaya Nokta Ekle
    const color = station.status === 'active' ? '#27ae60' : '#c0392b';
    const marker = L.circleMarker(station.coords, { 
        color: color, 
        radius: 8, 
        fillOpacity: 1,
        fillColor: color 
    }).addTo(map);

    marker.bindPopup(`<b>${station.name}</b>`);
    
    // Noktaya tıklayınca modal açılsın
    marker.on('click', () => {
        openModal(station.name);
    });

    // B. Listeye Kart Ekle
    const card = document.createElement('div');
    card.className = 'station-card';
    const statusBadge = station.status === 'active' 
        ? '<span class="status-badge status-ok">Sorun Yok</span>' 
        : '<span class="status-badge status-err">Arıza Bildirimi Var</span>';

    card.innerHTML = `
        <div class="card-title">${station.name}</div>
        ${statusBadge}
        <button class="btn-report" onclick="triggerListClick('${station.name}')">
            <i class="fas fa-map-pin"></i> Durum Bildir
        </button>
    `;
    listDiv.appendChild(card);
});

// Listeden tıklayınca çalışacak fonksiyon
window.triggerListClick = function(stationName) {
    const station = metroStations.find(s => s.name === stationName);
    if(station) {
        map.flyTo(station.coords, 15, { duration: 1.5 });
        setTimeout(() => openModal(stationName), 1000); // 1sn sonra aç
    }
}

// --- MODAL İŞLEMLERİ ---
const modal = document.getElementById('reportModal');
const zoneLayer = document.getElementById('click-zones');
const alertBox = document.getElementById('selected-zone-info');
let selectedZoneName = null;

window.openModal = function(stationName) {
    const station = metroStations.find(s => s.name === stationName);
    if (!station) return;

    document.getElementById('modal-station-name').innerText = station.name + " İstasyonu";
    zoneLayer.innerHTML = "";
    selectedZoneName = null;
    alertBox.className = "selection-alert";
    alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Lütfen görsel üzerinden bir çıkış seçiniz.';

    const zones = station.zones || [{name: "Genel Giriş", t: 50, l: 50}];

    zones.forEach(zone => {
        const btn = document.createElement('div');
        btn.className = 'zone-btn';
        btn.innerHTML = `<i class="fas fa-walking"></i> ${zone.name}`;
        btn.style.top = zone.t + "%";
        btn.style.left = zone.l + "%";
        
        btn.onclick = function() {
            document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedZoneName = zone.name;
            alertBox.className = "selection-alert selected";
            alertBox.innerHTML = `<i class="fas fa-check-circle"></i> Seçilen Konum: <b>${zone.name}</b>`;
        };
        zoneLayer.appendChild(btn);
    });

    modal.style.display = 'flex';
}

window.closeReportModal = function() {
    modal.style.display = 'none';
}

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedZoneName) {
        alert("Lütfen önce soldaki görselden (krokiden) sorunlu bölgeyi seçiniz!");
        return;
    }
    alert(`Bildirim Alındı!\nKonum: ${selectedZoneName}`);
    closeReportModal();
});

window.onclick = function(e) {
    if (e.target == modal) closeReportModal();
}
