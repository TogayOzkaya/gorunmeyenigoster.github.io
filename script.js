// --- AYARLAR ---
const TEST_MODE = true; // Konum izni olmadan test etmek için TRUE
const GPS_LIMIT_METERS = 500; // Gerçek modda işlem için maksimum mesafe
const REPORT_THRESHOLD = 3; // Bir istasyonun "Arızalı" sayılması için gereken rapor puanı

// --- 1. HARİTA KURULUMU ---
// İzmir merkezli haritayı başlat
var map = L.map('map', { zoomControl: false }).setView([38.4189, 27.1287], 13);
// OpenStreetMap katmanını ekle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Katkıda Bulunanlar',
    maxZoom: 19
}).addTo(map);
// Zoom kontrolünü sağ alta al (daha ergonomik)
L.control.zoom({ position: 'bottomright' }).addTo(map);
// Markerların tutulacağı katman
/* --- AYARLAR --- */
const TEST_MODE = true;
const GPS_LIMIT_METERS = 1000;
const REPORT_THRESHOLD = 3; 

/* --- 1. HARİTA BAŞLATMA --- */
var map = L.map('map', {zoomControl: false}).setView([38.4189, 27.1287], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
L.control.zoom({position: 'bottomright'}).addTo(map);
var markersLayer = L.layerGroup().addTo(map);

// --- 2. OYUN & KULLANICI DURUMU (STATE) ---
let gameState = {
    isLoggedIn: false,
    username: "Misafir",
    xp: 0,
    level: 1,
    totalReports: 0,
    verifiedCount: 0,
    badges: { firstLogin: false, firstReport: false, verifier: false }
};

// --- YARDIMCI FONKSİYONLAR ---
// Seviye hesaplama (Her 100 XP = 1 Level)
function calculateLevel() { return Math.floor(gameState.xp / 100) + 1; }
// Sonraki seviye için gereken toplam XP
function getNextLevelXp() { return gameState.level * 100; }
// Rastgele avatar oluşturucu
function getAvatarUrl(name) { return `https://ui-avatars.com/api/?name=${name}&background=1e69de&color=fff&rounded=true&bold=true`; }
/* --- 2. OYUN STATE (VARSAYILAN) --- */
let gameState = { isLoggedIn: false, username: "Misafir", xp: 0, level: 1, totalReports: 0, verifiedCount: 0, badges: {firstLogin:false, firstReport:false, verifier:false} };

// --- 3. İSTASYON VERİLERİ (KESİN COĞRAFİ SIRALI - Batıdan Doğuya) ---
// DİKKAT: Bu sıralama haritadaki çizginin düzgün olması için KRİTİKTİR.
/* --- 3. İSTASYON VERİLERİ (COĞRAFİ SIRALI) --- */
const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, zones: [{ name: "Ana Giriş", offset: [0,0] }] },
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, zones: [{name:"Ana Giriş", offset:[0,0]}] },
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { 
        name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0,
        zones: [ { name: "AVM Çıkışı (Asansör)", offset: [0.0003, -0.0003] }, { name: "Pazar Yeri Çıkışı", offset: [-0.0003, 0.0003] }, { name: "Aktarma Merkezi", offset: [0, 0] } ]
    },
    { 
        name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0,
        zones: [ { name: "Park Çıkışı", offset: [0.0002, -0.0002] }, { name: "Okul Tarafı", offset: [-0.0002, 0.0002] } ]
    },
    { name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0, zones: [{name:"AVM", offset:[0.0003,-0.0003]}, {name:"Pazar", offset:[-0.0003,0.0003]}] },
    { name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0, zones: [{name:"Park", offset:[0.0002,-0.0002]}] },
    { name: "Göztepe", coords: [38.3961, 27.0944], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Hatay", coords: [38.4017, 27.1028], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "İzmirspor", coords: [38.4017, 27.1106], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
@@ -70,353 +40,239 @@ const metroStations = [
    { name: "Evka-3", coords: [38.4650, 27.2286], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] }
];

// Metro hattını çiz (Sıralı veri sayesinde düzgün çizilecek)
L.polyline(metroStations.map(s => s.coords), { color: '#e74c3c', weight: 6, opacity: 0.8 }).addTo(map);

// --- 4. ANA RENDER FONKSİYONU (Listeyi ve Haritayı Boya) ---
/* --- 4. VERİ KAYDETME & YÜKLEME SİSTEMİ (YENİ) --- */
function saveData() {
    localStorage.setItem('izmirMetro_gameState', JSON.stringify(gameState));
    // Sadece değişen verileri (status ve score) kaydet
    const stationData = metroStations.map(s => ({ name: s.name, status: s.status, reportScore: s.reportScore }));
    localStorage.setItem('izmirMetro_stations', JSON.stringify(stationData));
}

function loadData() {
    const savedState = localStorage.getItem('izmirMetro_gameState');
    const savedStations = localStorage.getItem('izmirMetro_stations');

    if (savedState) {
        gameState = JSON.parse(savedState);
    }
    if (savedStations) {
        const parsedStations = JSON.parse(savedStations);
        // Kayıtlı verileri ana listeye eşle
        parsedStations.forEach(savedS => {
            const originalS = metroStations.find(s => s.name === savedS.name);
            if (originalS) {
                originalS.status = savedS.status;
                originalS.reportScore = savedS.reportScore;
            }
        });
    }
    // Veriler yüklendikten sonra UI'ı güncelle
    if(gameState.isLoggedIn) updateProfileUI();
    renderStations();
}

// Tüm Verileri Sıfırla (Çıkış Yap Butonu İçin) - Opsiyonel eklenebilir
window.resetData = function() {
    if(confirm("Tüm veriler sıfırlanacak. Emin misiniz?")) {
        localStorage.clear();
        location.reload();
    }
}

/* --- 5. RENDER FONKSİYONU --- */
function renderStations(searchTerm = "") {
    markersLayer.clearLayers(); // Eski markerları temizle
    markersLayer.clearLayers();
    const listDiv = document.getElementById('station-list');
    listDiv.innerHTML = ""; // Eski listeyi temizle
    listDiv.innerHTML = "";
    
    const filtered = metroStations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    document.getElementById('result-count').innerText = filtered.length;

    // Arama terimine göre filtrele
    const filteredStations = metroStations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    document.getElementById('result-count').innerText = filteredStations.length;
    filtered.forEach(station => {
        // Renk Mantığını Garantiye Al
        if (station.reportScore >= REPORT_THRESHOLD) { station.status = 'inactive'; } 
        else if (station.reportScore > 0) { station.status = 'pending'; } 
        else { station.status = 'active'; }

    filteredStations.forEach(station => {
        // Duruma göre renk ve ikon belirle
        let color = '#27ae60'; let icon = '<i class="fas fa-check-circle"></i>'; let statusText = 'Sorun Yok'; let statusClass = 'status-ok';
        if (station.status === 'pending') { 
            color = '#f39c12'; icon = '<i class="fas fa-exclamation-circle"></i>'; statusText = `Doğrulama (${station.reportScore}/${REPORT_THRESHOLD})`; statusClass = 'status-pending';
        } else if (station.status === 'inactive') { 
            color = '#c0392b'; icon = '<i class="fas fa-times-circle"></i>'; statusText = 'Arıza Var'; statusClass = 'status-err';
        }
        let color = '#27ae60', statusText = 'Sorun Yok', statusClass = 'status-ok';
        if (station.status === 'inactive') { color = '#c0392b'; statusText = 'Arıza Var'; statusClass = 'status-err'; }
        else if (station.status === 'pending') { color = '#f39c12'; statusText = `Doğrulama (${station.reportScore}/${REPORT_THRESHOLD})`; statusClass = 'status-pending'; }

        // Harita Markeri Oluştur
        const marker = L.circleMarker(station.coords, { color: 'white', weight: 2, fillColor: color, fillOpacity: 1, radius: 9 }).addTo(markersLayer);
        const marker = L.circleMarker(station.coords, {color: 'white', weight: 2, fillColor: color, fillOpacity: 1, radius: 9}).addTo(markersLayer);
        marker.bindTooltip(`<b>${station.name}</b><br>${statusText}`);
        marker.on('click', () => triggerAction(station));

        // Liste Kartı Oluştur (Kompakt Tasarım)
        const card = document.createElement('div');
        card.className = 'station-card';
        card.onclick = () => triggerListClick(station.name);

        let actionButtons = `
            <button class="btn-icon-action btn-report" onclick="event.stopPropagation(); triggerAction(this.closest('.station-card').dataset.stationName, 'report')" title="Durum Bildir">
                <i class="fas fa-bullhorn"></i>
            </button>`;
        if (station.status !== 'active') {
            actionButtons += `
                <button class="btn-icon-action btn-verify" onclick="event.stopPropagation(); triggerAction(this.closest('.station-card').dataset.stationName, 'verify')" title="Doğrula">
                    <i class="fas fa-check"></i>
                </button>`;
        }
        
        card.dataset.stationName = station.name; // Veri ilişkilendirme
        card.innerHTML = `
            <div class="card-info">
                <div class="card-header">
                    <i class="fas fa-subway station-icon"></i>
                    <div class="card-title">${station.name}</div>
                </div>
                <span class="status-badge ${statusClass}">${icon} ${statusText}</span>
            </div>
            <div class="card-actions">${actionButtons}</div>
        `;
        let btns = `<button class="btn-icon-action btn-report" onclick="event.stopPropagation(); triggerAction('${station.name}', 'report')"><i class="fas fa-bullhorn"></i></button>`;
        if(station.status !== 'active') btns += `<button class="btn-icon-action btn-verify" onclick="event.stopPropagation(); triggerAction('${station.name}', 'verify')"><i class="fas fa-check"></i></button>`;

        card.innerHTML = `<div class="card-info"><div>${station.name}</div><span class="status-badge ${statusClass}">${statusText}</span></div><div class="card-actions">${btns}</div>`;
        listDiv.appendChild(card);
    });
}
// İlk render
renderStations();

// Arama kutusu dinleyicisi
document.getElementById('station-search').addEventListener('input', (e) => {
    renderStations(e.target.value);
});

// --- 5. AKSİYON YÖNETİCİSİ (Login Kontrolü) ---
// Tüm buton tıklamaları bu fonksiyondan geçer.
function triggerAction(stationOrName, actionType = null) {
    const stationName = typeof stationOrName === 'string' ? stationOrName : stationOrName.name;
    const station = metroStations.find(s => s.name === stationName);

    // Haritadan tıklandıysa duruma göre karar ver
    if (!actionType) {
        actionType = station.status === 'active' ? 'report' : 'verify';
    }

    // GİRİŞ KONTROLÜ (Gatekeeper)
    if (!gameState.isLoggedIn) {
        openLoginModal();
        return;
    }

    // İlgili modalı aç
    if (actionType === 'report') openReportModal(stationName);
    else openVerifyModal(stationName);
}

// --- 6. GİRİŞ (LOGIN) SİSTEMİ ---
const loginModal = document.getElementById('loginModal');
const demoNames = ["Ahmet Yılmaz", "Zeynep Kaya", "Mehmet Demir", "Ayşe Çelik", "Can Yıldız"];

function openLoginModal() { loginModal.style.display = 'flex'; }
function closeLoginModal() { loginModal.style.display = 'none'; }

// DÜZELTİLMİŞ GİRİŞ FONKSİYONU
window.performLogin = () => {
    const btn = document.querySelector('.btn-google-login');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Bağlanılıyor...</span>';
    btn.disabled = true;

    setTimeout(() => {
        // Rastgele bir isim seç ve formatla (Örn: Ahmet Y.)
        const randomFullName = demoNames[Math.floor(Math.random() * demoNames.length)];
        const parts = randomFullName.split(' ');
        // HATA DÜZELTİLDİ: parts dizisi artık tanımlı.
        const privacyName = `${parts[0]} ${parts[1][0]}.`;

        // State güncelle
        gameState.isLoggedIn = true;
        gameState.username = privacyName;
        gameState.badges.firstLogin = true;

        // UI güncelle
        updateProfileUI();
        
        // Modalı kapat ve butonu resetle
        closeLoginModal();
        btn.innerHTML = originalHtml;
        btn.disabled = false;

        // Hoşgeldin mesajı
        alert(`🎉 Hoşgeldin, ${parts[0]}!\nOturum başarıyla açıldı. Artık katkı sağlayabilirsin.`);
    }, 1500);
};


// --- 7. UI GÜNCELLEME (Profil, Puanlar, Rozetler) ---
function updateProfileUI() {
    // Sağ üst profil kartı
    document.getElementById('top-user-name').innerText = gameState.username;
    document.getElementById('top-user-desc').innerHTML = `<i class="fas fa-star" style="color:#f1c40f;"></i> Seviye ${gameState.level}`;
    const avatarUrl = getAvatarUrl(gameState.username);
    document.getElementById('top-user-img').src = avatarUrl;
    
    // Profil Modalı
    document.getElementById('modal-username').innerText = gameState.username;
    document.getElementById('modal-avatar').src = avatarUrl;
    
    // Level Kontrolü
    const newLevel = calculateLevel();
    if (newLevel > gameState.level) {
        alert(`🎉 TEBRİKLER! Seviye ${newLevel} oldunuz!`);
        gameState.level = newLevel;
    }
    
    // İstatistikler ve Progress Bar
    const nextXp = getNextLevelXp();
    const currentLevelBaseXp = (gameState.level - 1) * 100;
    const progressPercent = ((gameState.xp - currentLevelBaseXp) / 100) * 100;

    document.getElementById('modal-level').innerText = gameState.level;
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    document.getElementById('stat-badges').innerText = Object.values(gameState.badges).filter(b => b).length;
    
    document.getElementById('current-level-txt').innerText = gameState.level;
    document.getElementById('next-level-txt').innerText = gameState.level + 1;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${nextXp} XP`;
    document.getElementById('xp-bar').style.width = `${progressPercent}%`;

    // Rozet Durumları
    updateBadgeStatus('badge-first-login', gameState.badges.firstLogin);
    updateBadgeStatus('badge-first-report', gameState.badges.firstReport);
    updateBadgeStatus('badge-verifier', gameState.badges.verifier);
}
// SAYFA YÜKLENİNCE VERİLERİ ÇEK
loadData();
document.getElementById('station-search').addEventListener('input', (e) => renderStations(e.target.value));

function updateBadgeStatus(id, unlocked) {
    if (unlocked) {
        const el = document.getElementById(id);
        el.classList.remove('locked');
        const icon = el.querySelector('.badge-status');
        icon.classList.replace('fa-lock', 'fa-check-circle');
        icon.classList.add('active');
    }
/* --- 6. AKSİYONLAR --- */
function triggerAction(stationOrName, type) {
    const name = typeof stationOrName === 'string' ? stationOrName : stationOrName.name;
    const s = metroStations.find(st => st.name === name);
    if (!type) type = s.status === 'active' ? 'report' : 'verify';
    if (!gameState.isLoggedIn) { openLoginModal(); return; }
    if (type === 'report') openReportModal(name);
    else openVerifyModal(name);
}


// --- 8. RAPORLAMA MODALI MANTIĞI ---
let miniMap = null; let selectedZone = null; let currentStationName = null; let hasPhoto = false;
/* --- 7. MODAL & MANTIK --- */
const reportModal = document.getElementById('reportModal');
const alertBox = document.getElementById('selected-zone-info');
const submitBtn = document.getElementById('btn-submit-report');
const verifyModal = document.getElementById('verifyModal');
const loginModal = document.getElementById('loginModal');
const profileModal = document.getElementById('profileModal');
let currentStationName, selectedZone, hasPhoto, stationToVerify, miniMap;

window.openReportModal = (name) => {
function openReportModal(name) {
    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    
    // Formu Resetle
    selectedZone = null; hasPhoto = false;
    alertBox.className = "selection-alert"; alertBox.innerText = "Lütfen haritadan bir nokta seçin.";
    submitBtn.disabled = true;
    document.getElementById('file-label').innerHTML = '<i class="fas fa-camera fa-2x"></i> Fotoğraf Ekle (İsteğe Bağlı)';
    document.querySelector('.file-upload-wrapper').classList.remove('active');
    document.getElementById('reportForm').reset();
    document.getElementById('btn-submit-report').disabled = true;
    document.getElementById('selected-zone-info').innerText = "Seçim Yapılmadı";
    document.getElementById('file-label').innerHTML = '<i class="fas fa-camera"></i> Fotoğraf Ekle (+20 Puan)';

    const station = metroStations.find(s => s.name === name);

    // Alternatif Rota Önerisi
    const s = metroStations.find(st => st.name === name);
    const altBox = document.getElementById('alternative-route-box');
    if(station.status !== 'active') {
        const alt = getAlternativeRoute(name);
        altBox.style.display = 'flex';
        document.getElementById('suggestion-text').innerText = `En yakın alternatif: ${alt}`;
    } else {
        altBox.style.display = 'none';
    }
    if(s.status !== 'active') { altBox.style.display = 'flex'; document.getElementById('suggestion-text').innerText = `Alternatif: ${getAlternative(name)}`; }
    else altBox.style.display = 'none';

    // Mini Haritayı Başlat
    setTimeout(() => {
        if (miniMap) miniMap.remove();
        miniMap = L.map('mini-map', { center: station.coords, zoom: 18, zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(miniMap);
        
        const zones = station.zones || [{name: "Genel Giriş", offset: [0,0]}];
        zones.forEach(zone => {
            const zLat = station.coords[0] + zone.offset[0]; const zLng = station.coords[1] + zone.offset[1];
            const zm = L.circleMarker([zLat, zLng], { color: 'white', weight:2, fillColor: '#3498db', fillOpacity: 1, radius: 10 }).addTo(miniMap);
            zm.bindTooltip(zone.name, {permanent: true, direction: 'top', offset: [0, -12], className: 'map-tooltip'});
            zm.on('click', () => {
                selectedZone = zone.name;
                alertBox.className = "selection-alert selected"; alertBox.innerText = `Seçildi: ${zone.name}`;
                miniMap.eachLayer(l => { if(l instanceof L.CircleMarker) l.setStyle({fillColor:'#3498db'}) });
                zm.setStyle({fillColor:'#e74c3c'});
                submitBtn.disabled = false; // Seçim yapılınca butonu aç
        if(miniMap) miniMap.remove();
        miniMap = L.map('mini-map', {center: s.coords, zoom: 18, zoomControl:false});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap);
        const zones = s.zones || [{name:"Genel", offset:[0,0]}];
        zones.forEach(z => {
            const m = L.circleMarker([s.coords[0]+z.offset[0], s.coords[1]+z.offset[1]], {color:'#3498db', radius:10}).addTo(miniMap);
            m.bindTooltip(z.name, {permanent:true, direction:'top', offset:[0,-10]});
            m.on('click', () => {
                selectedZone = z.name;
                document.getElementById('selected-zone-info').innerText = `Seçildi: ${z.name}`;
                document.getElementById('btn-submit-report').disabled = false;
                miniMap.eachLayer(l => { if(l instanceof L.CircleMarker) l.setStyle({color:'#3498db'}); });
                m.setStyle({color:'#e74c3c'});
            });
        });
    }, 200);
}
window.closeReportModal = () => { reportModal.style.display = 'none'; }

// Dosya Yükleme Efekti
document.getElementById('file-input').addEventListener('change', function() {
    if(this.files && this.files[0]) {
        hasPhoto = true;
        const wrapper = document.querySelector('.file-upload-wrapper');
        wrapper.classList.add('active');
        document.getElementById('file-label').innerHTML = `<i class="fas fa-check-circle fa-2x"></i> ${this.files[0].name} eklendi (+20 Puan)`;
    }
});

// Rapor Gönderimi
document.getElementById('reportForm').addEventListener('submit', function(e) {
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const station = metroStations.find(s => s.name === currentStationName);
    
    // Puanlama ve Durum Güncelleme
    station.reportScore += 1;
    if(station.reportScore >= REPORT_THRESHOLD) station.status = 'inactive'; else station.status = 'pending';
    
    let points = 50;
    if(hasPhoto) points += 20;

    gameState.xp += points; gameState.totalReports++;
    if(gameState.totalReports >= 1) gameState.badges.firstReport = true;
    
    alert(`✅ Bildiriminiz Başarıyla Alındı!\n\nKatkınız için teşekkürler. Toplam +${points} Puan kazandınız.`);
    updateProfileUI(); renderStations(); closeReportModal();
    const s = metroStations.find(st => st.name === currentStationName);
    s.reportScore++;
    addXp(50 + (hasPhoto?20:0)); gameState.totalReports++; gameState.badges.firstReport=true;
    saveData(); // KAYDET
    updateUI(); renderStations(); closeAllModals(); alert("Bildirim Alındı!");
});


// --- 9. DOĞRULAMA MODALI MANTIĞI ---
const verifyModal = document.getElementById('verifyModal');
let stationToVerify = null;
window.openVerifyModal = (name) => {
function openVerifyModal(name) {
    stationToVerify = name;
    document.getElementById('verify-station-name').innerText = name;
    verifyModal.style.display = 'flex';
}
window.closeVerifyModal = () => { verifyModal.style.display = 'none'; }

window.submitVerification = (isFixed) => {
window.submitVerification = (fixed) => {
    const s = metroStations.find(st => st.name === stationToVerify);
    let points = 0;
    if(isFixed) { 
        s.status = 'active'; s.reportScore = 0; points = 30;
        alert(`👏 Harika Haber!\n\nİstasyonun düzeldiğini doğruladınız.\n+${points} Puan kazandınız.`);
    } else { 
        s.reportScore++; points = 15;
        alert(`👍 Bilgi İçin Teşekkürler.\n\nArızanın devam ettiğini doğruladınız.\n+${points} Puan kazandınız.`);
    }
    gameState.xp += points;
    gameState.verifiedCount++; if(gameState.verifiedCount >= 1) gameState.badges.verifier = true;
    updateProfileUI(); renderStations(); closeVerifyModal();
    if(fixed) { s.status = 'active'; s.reportScore = 0; addXp(30); }
    else { s.reportScore++; addXp(15); }
    gameState.verifiedCount++; gameState.badges.verifier=true;
    saveData(); // KAYDET
    updateUI(); renderStations(); closeAllModals(); alert("Teşekkürler!");
}

function openLoginModal() { loginModal.style.display = 'flex'; }
function openProfileModal() { profileModal.style.display = 'flex'; updateUI(); }
function closeAllModals() { reportModal.style.display='none'; verifyModal.style.display='none'; loginModal.style.display='none'; profileModal.style.display='none'; }
window.closeReportModal = closeAllModals; window.closeVerifyModal = closeAllModals; window.closeLoginModal = closeAllModals; window.closeProfileModal = closeAllModals;

/* --- 8. YARDIMCILAR --- */
function getAlternative(name) {
    const i = metroStations.findIndex(s => s.name === name);
    if(i>0 && metroStations[i-1].status==='active') return metroStations[i-1].name;
    if(i<metroStations.length-1 && metroStations[i+1].status==='active') return metroStations[i+1].name;
    return "Otobüs kullanın";
}
function addXp(amount) { 
    gameState.xp += amount; 
    if(calculateLevel() > gameState.level) { gameState.level++; alert("Seviye Atladın!"); } 
    saveData(); // Puan değişince kaydet
}
function calculateLevel() { return Math.floor(gameState.xp/100)+1; }
function getNextLevelXp() { return gameState.level * 100; }
function getAvatarUrl(name) { return `https://ui-avatars.com/api/?name=${name}&background=1e69de&color=fff&rounded=true&bold=true`; }

// --- 10. DİĞER İŞLEVLER (Ticker, Profil, Navigasyon) ---

// Canlı Akış (Ticker) Simülasyonu
const activities = [
    "Sistem: Konak istasyonu asansör bakımı tamamlandı.",
    "Can Y. Üçyol'da arıza bildirdi.",
    "Zeynep K. Bornova metrosunu doğruladı (+30 Puan).",
    "Sistem: Hatay istasyonu rampa arızası bildirildi."
];
function runTicker() {
    const ticker = document.getElementById('ticker-text');
    let i = 0;
    setInterval(() => {
        let text = activities[i];
        // Giriş yapmışsa bazen kendi adını görsün
        if (gameState.isLoggedIn && Math.random() > 0.7) {
            text = `${gameState.username} az önce sisteme giriş yaptı.`;
function updateUI() {
    document.getElementById('top-user-name').innerText = gameState.username;
    document.getElementById('top-user-desc').innerText = `Seviye ${gameState.level}`;
    const avatarUrl = getAvatarUrl(gameState.username);
    document.getElementById('top-user-img').src = avatarUrl;
    document.getElementById('modal-username').innerText = gameState.username;
    document.getElementById('modal-avatar').src = avatarUrl;
    
    document.getElementById('modal-level').innerText = gameState.level;
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    document.getElementById('stat-badges').innerText = Object.values(gameState.badges).filter(b => b).length;
    
    const nextXp = getNextLevelXp();
    const progress = ((gameState.xp % 100) / 100) * 100;
    document.getElementById('xp-bar').style.width = `${progress}%`;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${nextXp} XP`;
    
    // Rozetleri Güncelle
    const updateBadge = (id, unlocked) => {
        const el = document.getElementById(id);
        if(unlocked) {
            el.classList.remove('locked');
            el.querySelector('.badge-status').className = 'fas fa-check-circle badge-status active';
        }
        ticker.style.opacity = 0;
        setTimeout(() => { ticker.innerText = text; ticker.style.opacity = 1; }, 500);
        i = (i + 1) % activities.length;
    }, 5000);
    };
    updateBadge('badge-first-login', gameState.badges.firstLogin);
    updateBadge('badge-first-report', gameState.badges.firstReport);
    updateBadge('badge-verifier', gameState.badges.verifier);
}
runTicker();
// UI fonksiyonunu globale aç
window.updateProfileUI = updateUI;

// Alternatif Rota Bulucu
function getAlternativeRoute(stationName) {
    const idx = metroStations.findIndex(s => s.name === stationName);
    if(idx === -1) return "Bulunamadı";
    // Basit mantık: Bir önceki veya bir sonraki sağlam istasyonu öner
    if (idx > 0 && metroStations[idx-1].status === 'active') return metroStations[idx-1].name;
    if (idx < metroStations.length - 1 && metroStations[idx+1].status === 'active') return metroStations[idx+1].name;
    return "En yakın otobüs durağını kullanınız.";
window.handleProfileClick = () => gameState.isLoggedIn ? openProfileModal() : openLoginModal();
window.performLogin = () => {
    document.querySelector('.btn-google-login').innerHTML = 'Giriş yapılıyor...';
    setTimeout(() => {
        gameState.isLoggedIn = true;
        const names = ["Ali Can", "Ayşe Yılmaz", "Mehmet Öz"];
        gameState.username = names[Math.floor(Math.random()*names.length)];
        gameState.badges.firstLogin = true;
        saveData(); // Login olunca kaydet
        updateUI(); closeAllModals(); alert("Giriş Başarılı!");
    }, 1000);
}

// Liste elemanına tıklayınca haritada git
window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15, { duration: 1.5 });
    // Mobilde sidebar'ı kapat
    if(window.innerWidth <= 768) document.getElementById('sidebar').classList.add('closed');
};

// Profil Modalı Aç/Kapa
const profileModal = document.getElementById('profileModal');
window.handleProfileClick = () => { if(gameState.isLoggedIn) openProfileModal(); else openLoginModal(); };
function openProfileModal() { profileModal.style.display = 'flex'; updateProfileUI(); }
window.closeProfileModal = () => { profileModal.style.display = 'none'; }

// Sidebar Toggle (Mobil)
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('closed');
    setTimeout(() => map.invalidateSize(), 300); // Haritayı yeniden boyutlandır
});

// Modal Dışı Tıklama Kapatma
window.onclick = (e) => {
    if(e.target == profileModal) closeProfileModal();
    if(e.target == reportModal) closeReportModal();
    if(e.target == verifyModal) closeVerifyModal();
    if(e.target == loginModal) closeLoginModal();
};
    map.flyTo(s.coords, 15);
    setTimeout(() => triggerAction(name), 800);
}
document.getElementById('file-input').addEventListener('change', () => { hasPhoto=true; document.getElementById('file-label').innerText = "Fotoğraf Eklendi"; });
document.getElementById('sidebar-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('closed'));
window.onclick = (e) => { if(e.target.classList.contains('modal')) closeAllModals(); };

// Ticker
setInterval(() => {
    const t = document.getElementById('ticker-text');
    const msgs = ["Sistem: Hatay bakımda", "Ali K. Konak doğruladı", "Can B. Üçyol raporladı"];
    t.style.opacity = 0;
    setTimeout(() => { t.innerText = msgs[Math.floor(Math.random()*msgs.length)]; t.style.opacity = 1; }, 500);
}, 4000);
