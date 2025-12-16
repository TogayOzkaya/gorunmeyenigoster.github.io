// 1. HARİTA BAŞLATMA
var map = L.map('map').setView([38.4100, 27.1000], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// 2. İSTASYON VERİLERİ (GÜNCEL & DOĞRU KOORDİNATLAR)
// "zones" kısmı görsel üzerinde çıkacak butonların konumlarını (top/left yüzdeleri) belirler.
const metroStations = [
    { 
        name: "Kaymakamlık", coords: [38.3950, 26.9914], status: "active",
        zones: [ {name: "Meydan Çıkışı", t: 40, l: 30}, {name: "Kaymakamlık Yönü", t: 60, l: 70} ]
    },
    { 
        name: "Şehitlik", coords: [38.3940, 26.9980], status: "active",
        zones: [ {name: "Müze Tarafı", t: 50, l: 50} ]
    },
    { 
        name: "Narlıdere", coords: [38.3935, 27.0050], status: "active",
        zones: [ {name: "Çarşı Çıkışı", t: 30, l: 40}, {name: "Otobüs Durakları", t: 70, l: 60} ]
    },
    { 
        name: "Fahrettin Altay", coords: [38.3971, 27.0700], status: "active",
        zones: [ {name: "AVM Çıkışı (İstinye)", t: 20, l: 20}, {name: "Pazar Yeri", t: 80, l: 80}, {name: "Aktarma Merkezi", t: 50, l: 50} ]
    },
    { 
        name: "Poligon", coords: [38.3950, 27.0780], status: "active",
        zones: [ {name: "Park Çıkışı", t: 40, l: 60} ]
    },
    { 
        name: "Göztepe", coords: [38.3960, 27.0850], status: "active",
        zones: [ {name: "Sahil Yönü", t: 30, l: 30}, {name: "Cadde Yönü", t: 70, l: 70} ]
    },
    { 
        name: "Hatay", coords: [38.3980, 27.0950], status: "active",
        zones: [ {name: "Renkli Durağı", t: 45, l: 45} ]
    },
    { 
        name: "İzmirspor", coords: [38.4000, 27.1050], status: "active",
        zones: [ {name: "Hastane Yönü", t: 30, l: 80} ]
    },
    { 
        name: "Üçyol", coords: [38.4050, 27.1150], status: "active",
        zones: [ {name: "Betonyol Çıkışı", t: 20, l: 30}, {name: "Meydan Çıkışı", t: 80, l: 50} ]
    },
    { 
        name: "Konak", coords: [38.4169, 27.1280], status: "active",
        zones: [ {name: "Vapur İskelesi", t: 20, l: 20}, {name: "Kemeraltı Girişi", t: 60, l: 80}, {name: "Valilik Önü", t: 40, l: 50} ]
    },
    { 
        name: "Çankaya", coords: [38.4224, 27.1360], status: "active",
        zones: [ {name: "Bit Pazarı", t: 30, l: 30}, {name: "Otel Tarafı", t: 70, l: 70} ]
    },
    { 
        name: "Basmane", coords: [38.4240, 27.1450], status: "active",
        zones: [ {name: "Gar Meydanı", t: 50, l: 40}, {name: "Fuar Kapısı", t: 30, l: 80} ]
    },
    { 
        name: "Hilal", coords: [38.4280, 27.1550], status: "active",
        zones: [ {name: "İZBAN Aktarma", t: 50, l: 50} ]
    },
    { 
        name: "Halkapınar", coords: [38.4344, 27.1686], status: "active",
        zones: [ {name: "İZBAN Aktarma", t: 30, l: 30}, {name: "Tramvay", t: 70, l: 70}, {name: "Otobüsler", t: 20, l: 80} ]
    },
    { 
        name: "Bornova", coords: [38.4590, 27.2130], status: "active",
        zones: [ {name: "Hastane", t: 20, l: 20}, {name: "Küçük Park", t: 80, l: 80} ]
    },
    { 
        name: "Evka-3", coords: [38.4650, 27.2286], status: "active",
        zones: [ {name: "Aktarma Merkezi", t: 50, l: 50} ]
    }
];

// 3. HAT ÇİZİMİ
var polyline = L.polyline(metroStations.map(s => s.coords), { color: 'red', weight: 5 }).addTo(map);
map.fitBounds(polyline.getBounds());

// 4. LİSTE VE HARİTA İŞARETÇİLERİ
const listDiv = document.getElementById('station-list');
document.getElementById('result-count').innerText = `${metroStations.length} istasyon listelendi`;

metroStations.forEach(station => {
    // Haritaya Pin Ekle
    L.circleMarker(station.coords, { color: '#e74c3c', radius: 8, fillOpacity: 1 })
     .bindPopup(`<b>${station.name}</b>`)
     .addTo(map);

    // Listeye Kart Ekle
    const card = document.createElement('div');
    card.className = 'station-card';
    card.innerHTML = `
        <div class="card-title">${station.name}</div>
        <div class="status-badge status-ok">Erişime Açık</div>
        <button class="btn-report" onclick="openModal('${station.name}')">
            <i class="fas fa-exclamation-triangle"></i> Durum Bildir
        </button>
    `;
    listDiv.appendChild(card);
});

// 5. GELİŞMİŞ MODAL İŞLEMLERİ
const modal = document.getElementById('reportModal');
const zoneLayer = document.getElementById('click-zones');
const alertBox = document.getElementById('selected-zone-info');
let selectedZoneName = null;

// Modalı Açan Fonksiyon
window.openModal = function(stationName) {
    const station = metroStations.find(s => s.name === stationName);
    if (!station) return;

    // Başlığı ayarla
    document.getElementById('modal-station-name').innerText = station.name + " İstasyonu";
    
    // Eski butonları temizle
    zoneLayer.innerHTML = "";
    selectedZoneName = null;
    alertBox.className = "selection-alert";
    alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Henüz bir nokta seçilmedi.';

    // Görsel üzerine "Tıklanabilir Alanlar" (Hotspots) ekle
    // Eğer istasyonun özel zone'ları varsa onları kullan, yoksa varsayılan koy
    const zones = station.zones || [{name: "Genel Çıkış", t: 50, l: 50}];

    zones.forEach(zone => {
        const btn = document.createElement('div');
        btn.className = 'zone-btn';
        btn.innerText = zone.name;
        // Konumlandırma (Yüzde bazlı)
        btn.style.top = zone.t + "%";
        btn.style.left = zone.l + "%";
        
        // Tıklama Olayı
        btn.onclick = function() {
            // Önceki kırmızılığı kaldır
            document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
            // Buna kırmızılık ekle
            btn.classList.add('active');
            
            // Seçimi kaydet
            selectedZoneName = zone.name;
            alertBox.className = "selection-alert selected";
            alertBox.innerHTML = `<i class="fas fa-check-circle"></i> Seçilen Nokta: <b>${zone.name}</b>`;
        };

        zoneLayer.appendChild(btn);
    });

    modal.style.display = 'flex';
}

window.closeReportModal = function() {
    modal.style.display = 'none';
}

// Form Gönderimi
document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedZoneName) {
        alert("Lütfen önce görsel üzerinden sorunlu bölgeyi seçiniz!");
        return;
    }
    alert(`Bildirim Alındı!\nKonum: ${selectedZoneName}\nDurum yetkililere iletildi.`);
    closeReportModal();
});

// Dışarı tıklayınca kapat
window.onclick = function(e) {
    if (e.target == modal) closeReportModal();
}
