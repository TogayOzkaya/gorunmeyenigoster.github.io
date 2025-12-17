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
    isLoggedIn: false, 
    username: "Misafir", // Varsayılan
    xp: 0, level: 1, totalReports: 0, verifiedCount: 0,
    badges: { firstLogin: false, firstReport: false, verifier: false }
};

// --- LOGIN FONKSİYONLARI (GÜNCELLENDİ: AKILLI İSİM) ---
const loginModal = document.getElementById('loginModal');

// Rastgele Gerçekçi İsim Üretici (Google'dan gelmiş gibi)
const demoNames = ["Ahmet Yılmaz", "Zeynep Kaya", "Mehmet Demir", "Ayşe Çelik", "Can Yıldız", "Elif Öztürk"];

function formatName(fullName) {
    const parts = fullName.split(' ');
    // Ad + Soyadın Baş Harfi + Nokta (Örn: Ahmet Y.)
    return `${parts[0]} ${parts[1][0]}.`;
}

function checkLogin() {
    if (gameState.isLoggedIn) return true;
    loginModal.style.display = 'flex'; return false;
}
window.closeLoginModal = () => { loginModal.style.display = 'none'; }

window.performLogin = () => {
    const btn = document.querySelector('.btn-google-login'); 
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Bağlanılıyor...';
    
    setTimeout(() => {
        // 1. Rastgele bir isim seç
        const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
        const privacyName = formatName(randomName);

        // 2. State'i Güncelle
        gameState.isLoggedIn = true; 
        gameState.username = privacyName;
        gameState.badges.firstLogin = true;
        
        // 3. UI Güncelle
        document.getElementById('top-user-name').innerText = gameState.username;
        document.getElementById('top-user-desc').innerHTML = '<i class="fas fa-star" style="color:#f1c40f;"></i> Seviye <span id="mini-level">1</span>';
        
        // Profil resmi de değişsin (Google avatarı gibi)
        // Burada basit bir avatar servisi kullanıyoruz, ismin baş harfine göre renkli avatar verir.
        const avatarUrl = `https://ui-avatars.com/api/?name=${privacyName}&background=0D8ABC&color=fff&rounded=true`;
        document.getElementById('top-user-img').src = avatarUrl;
        
        // Profil modalındaki resmi ve ismi de güncelle
        document.getElementById('modal-username').innerText = gameState.username;
        document.querySelector('.pm-avatar').src = avatarUrl;

        closeLoginModal(); 
        updateProfileUI();
        
        // Butonu eski haline getir (sonraki çıkış/giriş için)
        btn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" style="width:20px;"> Google ile Devam Et';
        
        alert(`🎉 Hoşgeldin, ${parts[0]}!\nOturum başarıyla açıldı.`);
        
    }, 1500);
}

// --- TICKER (GÜNCELLENDİ: GİRİŞ YAPAN KULLANICIYI KULLAN) ---
const activities = [
    "Sistem: Hatay istasyonunda asansör bakımı başladı.",
    "Sistem: Konak iskelesi rampası onarıldı.",
    "Ali K. Bornova metrosunda doğrulama yaptı.",
    "Selin B. Üçyol çıkışında fotoğraf yükledi."
];

function simulateTicker() {
    const ticker = document.getElementById('ticker-text');
    let i = 0;
    setInterval(() => {
        // Eğer kullanıcı giriş yaptıysa, bazen kendi ismini de ticker'da görsün (Motivasyon)
        let text = activities[i];
        if (gameState.isLoggedIn && Math.random() > 0.7) {
            text = `${gameState.username} az önce aktif oldu.`;
        }

        ticker.style.opacity = 0;
        setTimeout(() => {
            ticker.innerText = text;
            ticker.style.opacity = 1;
            i = (i + 1) % activities.length;
        }, 500);
    }, 4000);
}
simulateTicker();


// --- LEVEL HESAPLAMA ---
function getUserVotePower() { return gameState.level >= 3 ? 3 : 1; }
function calculateLevel() { return Math.floor(gameState.xp / 100) + 1; }
function getNextLevelXp() { return gameState.level * 100; }

function updateProfileUI() {
    if (!gameState.isLoggedIn) return; 

    const newLevel = calculateLevel();
    if (newLevel > gameState.level) {
        alert(`🎉 TEBRİKLER! Seviye ${newLevel} oldunuz!`);
        gameState.level = newLevel;
    }
    const nextXp = getNextLevelXp();
    const progressPercent = ((gameState.xp - ((gameState.level - 1) * 100)) / 100) * 100;

    const miniLevelEl = document.getElementById('mini-level');
    if(miniLevelEl) miniLevelEl.innerText = gameState.level;

    document.getElementById('modal-level').innerText = gameState.level;
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    document.getElementById('stat-badges').innerText = Object.values(gameState.badges).filter(b => b).length;
    document.getElementById('xp-bar').style.width = `${progressPercent}%`;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${nextXp}`;
    
    updateBadgeStatus('badge-first-login', gameState.badges.firstLogin);
    updateBadgeStatus('badge-first-report', gameState.badges.firstReport);
    updateBadgeStatus('badge-verifier', gameState.badges.verifier);
}

function updateBadgeStatus(id, unlocked) {
    if(unlocked) {
        const el = document.getElementById(id);
        el.classList.remove('locked');
        const icon = el.querySelector('.badge-check');
        if(icon.classList.contains('fa-lock')) {
            icon.classList.replace('fa-lock', 'fa-check-circle');
            icon.classList.add('active');
        }
    }
}

// --- 3. İSTASYON VERİLERİ (SIRALI) ---
const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, zones: [{ name: "Ana Giriş", offset: [0,0] }] },
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { 
        name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0,
        zones: [
            { name: "AVM Çıkışı (Asansör)", offset: [0.0003, -0.0003] },
            { name: "Pazar Yeri Çıkışı", offset: [-0.0003, 0.0003] },
            { name: "Aktarma Merkezi", offset: [0, 0] }
        ]
    },
    { 
        name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0,
        zones: [
            { name: "Park Çıkışı", offset: [0.0002, -0.0002] },
            { name: "Okul Tarafı", offset: [-0.0002, 0.0002] }
        ]
    },
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
            if (station.status === 'active') openReportModal(station.name);
            else openVerifyModal(station.name);
        });

        const card = document.createElement('div');
        card.className = 'station-card';
        card.setAttribute('role', 'button'); 
        card.setAttribute('tabindex', '0'); 
        
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

document.getElementById('file-input').addEventListener('change', function() {
    if(this.files && this.files[0]) {
        hasPhoto = true;
        document.getElementById('file-label').innerText = "✅ Fotoğraf Eklendi";
        document.getElementById('file-label').style.color = "#27ae60";
    }
});

window.openReportModal = (name) => {
    if(!checkLogin()) return; 

    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    selectedZone = null; hasPhoto = false;
    alertBox.className = "selection-alert"; alertBox.innerText = "Lütfen haritadan seçim yapın";
    document.getElementById('file-label').innerText = "Fotoğraf Ekle (İsteğe Bağlı)"; 
    document.getElementById('file-label').style.color = "#3498db";

    const station = metroStations.find(s => s.name === name);
    
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
    
    if (!TEST_MODE) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const dist = getDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, station.coords[0], station.coords[1]);
                if (dist > GPS_LIMIT_METERS) {
                    alert("Çok uzaktasınız. Bildirim yapılamadı.");
                    return;
                }
                finalizeReport(station);
            });
        }
    } else {
        finalizeReport(station);
    }
});

function finalizeReport(station) {
    station.reportScore += 1;
    if(station.reportScore >= REPORT_THRESHOLD) station.status = 'inactive'; else station.status = 'pending';
    
    let points = 50;
    if(hasPhoto) points += 20;

    gameState.xp += points; gameState.totalReports++;
    if(gameState.totalReports >= 1) gameState.badges.firstReport = true;
    
    alert(`Bildirim Alındı!\n+${points} Puan Kazandınız.`);
    updateProfileUI(); renderStations(); closeReportModal();
}

// GPS Mesafe
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; var dLat = deg2rad(lat2-lat1); var dLon = deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return R * c * 1000;
}
function deg2rad(deg) { return deg * (Math.PI/180); }


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

window.handleProfileClick = () => {
    if (gameState.isLoggedIn) openProfileModal();
    else loginModal.style.display = 'flex';
}

window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15);
    setTimeout(() => { if(s.status === 'active') openReportModal(name); else openVerifyModal(name); }, 800);
}
document.getElementById('sidebar-toggle').addEventListener('click', () => { document.getElementById('sidebar').classList.toggle('closed'); setTimeout(() => map.invalidateSize(), 400); });
window.onclick = (e) => { if(e.target==profileModal) closeProfileModal(); if(e.target==reportModal) closeReportModal(); if(e.target==verifyModal) closeVerifyModal(); if(e.target==loginModal) closeLoginModal(); }
