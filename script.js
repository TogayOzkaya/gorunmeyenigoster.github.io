// --- AYARLAR ---
const TEST_MODE = true; 
const GPS_LIMIT_METERS = 1000; 
const REPORT_THRESHOLD = 3; 

// --- 1. HARİTA ---
var map = L.map('map').setView([38.4100, 27.0900], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
var markersLayer = L.layerGroup().addTo(map);

// --- 2. OYUN STATE ---
let gameState = {
    isLoggedIn: false, xp: 0, level: 1, totalReports: 0, verifiedCount: 0,
    badges: { firstLogin: false, firstReport: false, verifier: false }
};

// --- YENİ: TICKER (CANLI AKIŞ) SİMÜLASYONU ---
const activities = [
    "Ahmet K. Konak asansörünü doğruladı.",
    "Zeynep T. Üçyol çıkışında arıza bildirdi.",
    "Mehmet A. Fahrettin Altay'da fotoğraf yükledi.",
    "Selin B. Bornova metrosu erişilebilir işaretledi."
];
function simulateTicker() {
    const ticker = document.getElementById('ticker-text');
    let i = 0;
    setInterval(() => {
        ticker.style.opacity = 0;
        setTimeout(() => {
            ticker.innerText = activities[i];
            ticker.style.opacity = 1;
            i = (i + 1) % activities.length;
        }, 500);
    }, 4000); // 4 saniyede bir değişir
}
simulateTicker();

// --- 3. İSTASYON VERİLERİ (SIRALI) ---
const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, zones: [{ name: "Ana Giriş", offset: [0,0] }] },
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0, zones: [{ name: "AVM", offset: [0.0003, -0.0003] }, { name: "Pazar Yeri", offset: [-0.0003, 0.0003] }] },
    { name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0, zones: [{ name: "Park", offset: [0.0002, -0.0002] }] },
    { name: "Göztepe", coords: [38.3961, 27.0944], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Hatay", coords: [38.4017, 27.1028], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "İzmirspor", coords: [38.4017, 27.1106], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Üçyol", coords: [38.4058, 27.1211], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Konak", coords: [38.4169, 27.1281], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Çankaya", coords: [38.4225, 27.1361], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Basmane", coords: [38.4228, 27.1447], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Hilal", coords: [38.4269, 27.1550], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Halkapınar", coords: [38.4344, 27.1686], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Stadyum", coords: [38.4425, 27.1806], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Sanayi", coords: [38.4483, 27.1903], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Bölge", coords: [38.4547, 27.2011], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Bornova", coords: [38.4583, 27.2125], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Ege Üniversitesi", coords: [38.4615, 27.2210], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Evka-3", coords: [38.4650, 27.2286], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] }
];

L.polyline(metroStations.map(s => s.coords), { color: '#e74c3c', weight: 5 }).addTo(map);

function renderStations() {
    markersLayer.clearLayers();
    const listDiv = document.getElementById('station-list');
    listDiv.innerHTML = "";
    document.getElementById('result-count').innerText = `${metroStations.length} istasyon listelendi`;

    metroStations.forEach(station => {
        let color = '#27ae60'; let badgeHtml = '<span class="status-badge status-ok">Sorun Yok</span>';
        if (station.status === 'pending') { color = '#f39c12'; badgeHtml = `<span class="status-badge status-pending">Doğrulama (${station.reportScore}/${REPORT_THRESHOLD})</span>`; } 
        else if (station.status === 'inactive') { color = '#c0392b'; badgeHtml = '<span class="status-badge status-err">Arıza Var</span>'; }

        const marker = L.circleMarker(station.coords, { color: color, radius: 8, fillOpacity: 1, fillColor: color }).addTo(markersLayer);
        marker.on('click', () => {
            // Tıklayınca giriş kontrolü yok, sadece açıyor. İşlem yaparken soracak.
            if (station.status === 'active') openReportModal(station.name);
            else openVerifyModal(station.name);
        });

        const card = document.createElement('div');
        card.className = 'station-card';
        card.setAttribute('role', 'button'); // A11y
        card.setAttribute('tabindex', '0'); // A11y
        
        let actionButtons = `<button class="btn-report" onclick="triggerListClick('${station.name}')">Durum Bildir</button>`;
        if (station.status !== 'active') {
            actionButtons = `<div class="btn-group"><button class="btn-report" onclick="triggerListClick('${station.name}')">Bildir</button><button class="btn-verify" onclick="openVerifyModal('${station.name}')">✅ Doğrula</button></div>`;
        }
        card.innerHTML = `<div class="card-title">${station.name}</div>${badgeHtml}${actionButtons}`;
        listDiv.appendChild(card);
    });
}
renderStations();

// --- 4. YENİ: ALTERNATİF ROTA BULUCU ---
function getAlternativeRoute(stationName) {
    const idx = metroStations.findIndex(s => s.name === stationName);
    if(idx === -1) return null;
    
    // Önceki veya sonraki istasyona bak (Basit Mantık)
    let suggested = null;
    if (idx > 0 && metroStations[idx-1].status === 'active') suggested = metroStations[idx-1];
    else if (idx < metroStations.length - 1 && metroStations[idx+1].status === 'active') suggested = metroStations[idx+1];
    
    return suggested ? suggested.name : "Otobüs kullanınız";
}

// --- 5. MODAL & MINI MAP ---
let miniMap = null; let selectedZone = null; let currentStationName = null; let hasPhoto = false;
const reportModal = document.getElementById('reportModal');
const alertBox = document.getElementById('selected-zone-info');
const suggestBox = document.getElementById('alternative-route-box');

// Dosya Yükleme Kontrolü
document.getElementById('file-input').addEventListener('change', function() {
    if(this.files && this.files[0]) {
        hasPhoto = true;
        document.getElementById('file-label').innerText = "✅ Fotoğraf Eklendi";
        document.getElementById('file-label').style.color = "#27ae60";
    }
});

window.openReportModal = (name) => {
    if(!checkLogin()) return; // Login Kontrolü

    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    selectedZone = null; hasPhoto = false;
    alertBox.className = "selection-alert"; alertBox.innerText = "Lütfen haritadan seçim yapın";
    document.getElementById('file-label').innerText = "Fotoğraf Ekle (İsteğe Bağlı)"; // Reset

    const station = metroStations.find(s => s.name === name);
    
    // Rota Önerisi (Eğer istasyon zaten bozuksa veya şüpheliyse göster)
    if(station.status !== 'active') {
        const alt = getAlternativeRoute(name);
        suggestBox.style.display = 'flex';
        document.getElementById('suggestion-text').innerText = `Bu istasyonda sorun olabilir. En yakın alternatif: ${alt}`;
    } else {
        suggestBox.style.display = 'none';
    }

    setTimeout(() => {
        if (miniMap) miniMap.remove();
        miniMap = L.map('mini-map', { center: station.coords, zoom: 18, zoomControl: false, dragging: false, scrollWheelZoom: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(miniMap);
        const zones = station.zones || [{name: "Genel Alan", offset: [0,0]}];
        zones.forEach(zone => {
            const zLat = station.coords[0] + zone.offset[0]; const zLng = station.coords[1] + zone.offset[1];
            const zm = L.circleMarker([zLat, zLng], { color: '#3498db', fillColor: '#3498db', fillOpacity: 0.8, radius: 12 }).addTo(miniMap);
            zm.bindTooltip(zone.name, {permanent: true, direction: 'top', offset: [0, -10]});
            zm.on('click', () => {
                selectedZone = zone.name;
                alertBox.className = "selection-alert selected"; alertBox.innerText = `Seçildi: ${zone.name}`;
                miniMap.eachLayer(l => { if(l instanceof L.CircleMarker) l.setStyle({color:'#3498db', fillColor:'#3498db'}) });
                zm.setStyle({color:'#e74c3c', fillColor:'#e74c3c'});
            });
        });
    }, 200);
}
window.closeReportModal = () => { reportModal.style.display = 'none'; }

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedZone) { alert("Lütfen haritadan nokta seçin!"); return; }
    
    // GPS Kontrol (Test Modu)
    
    const station = metroStations.find(s => s.name === currentStationName);
    station.reportScore += 1;
    if(station.reportScore >= REPORT_THRESHOLD) station.status = 'inactive'; else station.status = 'pending';
    
    let points = 50;
    if(hasPhoto) points += 20; // Foto puanı

    gameState.xp += points; gameState.totalReports++;
    if(gameState.totalReports >= 1) gameState.badges.firstReport = true;
    
    alert(`Bildirim Alındı!\n+${points} Puan Kazandınız.`);
    updateProfileUI(); renderStations(); closeReportModal();
});

// --- LOGIN & PROFIL (Aynen Korundu) ---
const loginModal = document.getElementById('loginModal');
function checkLogin() {
    if (gameState.isLoggedIn) return true;
    loginModal.style.display = 'flex'; return false;
}
window.closeLoginModal = () => { loginModal.style.display = 'none'; }
window.performLogin = () => {
    const btn = document.querySelector('.btn-google-login'); btn.innerHTML = 'Giriş yapılıyor...';
    setTimeout(() => {
        gameState.isLoggedIn = true; gameState.badges.firstLogin = true;
        document.getElementById('top-user-name').innerText = "Gönüllü Katılımcı";
        document.getElementById('top-user-desc').innerHTML = '<i class="fas fa-star" style="color:#f1c40f;"></i> Seviye <span id="mini-level">1</span>';
        closeLoginModal(); updateProfileUI();
    }, 1000);
}

const verifyModal = document.getElementById('verifyModal');
let stationToVerify = null;
window.openVerifyModal = (name) => {
    if(!checkLogin()) return;
    stationToVerify = name;
    document.getElementById('verify-station-name').innerText = name;
    verifyModal.style.display = 'flex';
}
window.closeVerifyModal = () => { verifyModal.style.display = 'none'; }
window.submitVerification = (isFixed) => {
    const s = metroStations.find(st => st.name === stationToVerify);
    if(isFixed) { s.status = 'active'; s.reportScore = 0; gameState.xp += 30; }
    else { s.reportScore++; gameState.xp += 15; }
    gameState.verifiedCount++; if(gameState.verifiedCount >= 1) gameState.badges.verifier = true;
    updateProfileUI(); renderStations(); closeVerifyModal();
}

const profileModal = document.getElementById('profileModal');
window.openProfileModal = () => { if(gameState.isLoggedIn) { profileModal.style.display = 'flex'; updateProfileUI(); } else loginModal.style.display = 'flex'; }
window.closeProfileModal = () => { profileModal.style.display = 'none'; }

window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15);
    setTimeout(() => { if(s.status === 'active') openReportModal(name); else openVerifyModal(name); }, 800);
}
document.getElementById('sidebar-toggle').addEventListener('click', () => { document.getElementById('sidebar').classList.toggle('closed'); setTimeout(() => map.invalidateSize(), 400); });
window.onclick = (e) => { if(e.target==profileModal) closeProfileModal(); if(e.target==reportModal) closeReportModal(); if(e.target==verifyModal) closeVerifyModal(); if(e.target==loginModal) closeLoginModal(); }
