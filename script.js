// --- 1. HARİTA AYARLARI ---
var map = L.map('map').setView([38.4100, 27.0900], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

var markersLayer = L.layerGroup().addTo(map);

// --- 2. OYUNLAŞTIRMA VERİLERİ (STATE) ---
let gameState = {
    xp: 0,              // Mevcut Puan
    level: 1,           // Mevcut Seviye
    totalReports: 0,    // Yapılan Bildirim Sayısı
    verifiedCount: 0,   // Yapılan Doğrulama Sayısı
    badges: {
        firstLogin: true, // Varsayılan olarak açık
        firstReport: false,
        verifier: false
    }
};

// Seviye hesaplama: Her 100 puanda 1 level
function calculateLevel() {
    return Math.floor(gameState.xp / 100) + 1;
}

// Sonraki seviye için kalan puan
function getNextLevelXp() {
    return gameState.level * 100;
}

// --- 3. UI GÜNCELLEME (PROFIL) ---
function updateProfileUI() {
    // Yeni leveli hesapla
    const newLevel = calculateLevel();
    if (newLevel > gameState.level) {
        alert(`🎉 TEBRİKLER! Seviye ${newLevel} oldunuz!`);
        gameState.level = newLevel;
    }

    const nextXp = getNextLevelXp();
    const currentLevelBaseXp = (gameState.level - 1) * 100;
    const progressPercent = ((gameState.xp - currentLevelBaseXp) / 100) * 100;

    // Küçük Profil (Sağ Üst)
    document.getElementById('mini-level').innerText = gameState.level;

    // Modal İçi Değerler
    document.getElementById('modal-level').innerText = gameState.level;
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    
    // Rozet Sayısı (Aktif olanlar)
    const activeBadges = Object.values(gameState.badges).filter(b => b).length;
    document.getElementById('stat-badges').innerText = activeBadges;

    // Progress Bar
    document.getElementById('xp-bar').style.width = `${progressPercent}%`;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${nextXp}`;
    document.getElementById('xp-message').innerText = `Seviye ${gameState.level + 1} olmak için ${nextXp - gameState.xp} puan daha kazan!`;

    // Rozetleri Açma/Kapama
    updateBadgeStatus('badge-first-report', gameState.badges.firstReport);
    updateBadgeStatus('badge-verifier', gameState.badges.verifier);
}

function updateBadgeStatus(elementId, isUnlocked) {
    const badgeEl = document.getElementById(elementId);
    if (isUnlocked) {
        badgeEl.classList.remove('locked');
        const icon = badgeEl.querySelector('.badge-check');
        icon.classList.remove('fa-lock');
        icon.classList.add('fa-check-circle', 'active');
    }
}

// --- 4. AKSİYONLAR (PUAN KAZANMA) ---

// A. Arıza Doğrulama Fonksiyonu (YENİ)
// Başkası "Bozuk" demiş, sen gidip "Evet bozuk" veya "Hayır düzelmiş" diyorsun.
window.verifyStation = function(stationName) {
    gameState.xp += 20; // 20 Puan kazan
    gameState.verifiedCount++;
    
    // Rozet Kontrolü
    if (gameState.verifiedCount >= 1) gameState.badges.verifier = true;

    alert(`✅ Doğrulama Başarılı!\n\n+20 Puan Kazandınız.\nToplam Puan: ${gameState.xp}`);
    updateProfileUI();
};

// B. Rapor Bildirme (Mevcut Formdan Çağrılır)
function handleReportSuccess() {
    gameState.xp += 50; // 50 Puan kazan
    gameState.totalReports++;
    
    // Rozet Kontrolü
    if (gameState.totalReports >= 1) gameState.badges.firstReport = true;

    alert(`📢 Bildirim Alındı!\n\n+50 Puan Kazandınız.\nToplam Puan: ${gameState.xp}`);
    updateProfileUI();
}


// --- 5. İSTASYON VERİLERİ VE RENDER ---
const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "inactive" }, // Örn: Arızalı
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "inactive" }, // Örn: Arızalı
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active" },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active" },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active" },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active" },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active" },
    { name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active" }
];

// Hattı Çiz
L.polyline(metroStations.map(s => s.coords), { color: '#e74c3c', weight: 5 }).addTo(map);

function renderStations() {
    markersLayer.clearLayers();
    const listDiv = document.getElementById('station-list');
    listDiv.innerHTML = "";

    metroStations.forEach(station => {
        const color = station.status === 'active' ? '#27ae60' : '#c0392b';
        const marker = L.circleMarker(station.coords, { color: color, radius: 8, fillOpacity: 1 }).addTo(markersLayer);
        marker.on('click', () => openReportModal(station.name));

        // Kart HTML
        const card = document.createElement('div');
        card.className = 'station-card';
        
        let statusHtml = station.status === 'active' 
            ? '<span class="status-badge status-ok">Sorun Yok</span>'
            : '<span class="status-badge status-err">Arıza Bildirimi Var</span>';

        // Eğer arıza varsa "Doğrula" butonu da göster
        let actionButtons = `
            <button class="btn-report" onclick="triggerListClick('${station.name}')">
                <i class="fas fa-map-pin"></i> Durum Bildir
            </button>
        `;
        
        if (station.status === 'inactive') {
            actionButtons = `
                <div class="btn-group">
                    <button class="btn-report" onclick="triggerListClick('${station.name}')">Bildir</button>
                    <button class="btn-verify" onclick="verifyStation('${station.name}')">✅ Doğrula</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-title">${station.name}</div>
            ${statusHtml}
            ${actionButtons}
        `;
        listDiv.appendChild(card);
    });
}
renderStations();
updateProfileUI(); // İlk yüklemede UI'ı hazırla

// --- 6. MODAL YÖNETİMİ ---
const profileModal = document.getElementById('profileModal');
const reportModal = document.getElementById('reportModal');
let currentStationName = null;
let selectedZone = null;

// Profil Modal
window.openProfileModal = () => { profileModal.style.display = 'flex'; updateProfileUI(); }
window.closeProfileModal = () => { profileModal.style.display = 'none'; }

// Rapor Modal
window.openReportModal = (name) => {
    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    // Zone reset
    document.getElementById('click-zones').innerHTML = '';
    createZoneButton("Genel Giriş", 50, 50);
}
window.closeReportModal = () => { reportModal.style.display = 'none'; }

// Liste Tıklama
window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15);
    setTimeout(() => openReportModal(name), 800);
}

// Zone Butonu Oluşturucu
function createZoneButton(name, t, l) {
    const btn = document.createElement('div');
    btn.className = 'zone-btn';
    btn.innerText = name;
    btn.style.top = t + '%'; btn.style.left = l + '%';
    btn.onclick = () => {
        document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedZone = name;
        const alertBox = document.getElementById('selected-zone-info');
        alertBox.className = 'selection-alert selected';
        alertBox.innerText = `Seçildi: ${name}`;
    };
    document.getElementById('click-zones').appendChild(btn);
}

// Form Submit
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if(!selectedZone) { alert("Lütfen görselden bir yer seçin!"); return; }
    
    // İstasyonu arızalı yap
    const st = metroStations.find(s => s.name === currentStationName);
    if(st) st.status = 'inactive';
    
    renderStations(); // Listeyi güncelle (Doğrula butonu çıksın diye)
    closeReportModal();
    handleReportSuccess(); // Puan kazan
});

// Sidebar Toggle
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('closed');
    setTimeout(() => map.invalidateSize(), 400);
});

window.onclick = (e) => {
    if(e.target == profileModal) closeProfileModal();
    if(e.target == reportModal) closeReportModal();
}
