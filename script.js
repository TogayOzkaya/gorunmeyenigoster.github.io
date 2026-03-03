/* --- AYARLAR --- */
const TEST_MODE = true;
const REPORT_THRESHOLD = 3; 
document.addEventListener('DOMContentLoaded', () => {

if (typeof L === 'undefined') { alert("Harita yüklenemedi. İnternet bağlantınızı kontrol edin."); }

var map = L.map('map', {zoomControl: false}).setView([38.4189, 27.1287], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
L.control.zoom({position: 'topleft'}).addTo(map);
var markersLayer = L.layerGroup().addTo(map);

let gameState = { isLoggedIn: false, username: "Misafir", xp: 0, level: 1, totalReports: 0, verifiedCount: 0, badges: {firstLogin:false, firstReport:false, verifier:false} };

const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, lastUpdated: "10 dk önce", zones: [{ name: "Kaymakamlık Kapısı", offset: [0,0] }] },
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active", reportScore: 0, lastUpdated: "45 dk önce", zones: [{name:"Park Tarafı", offset:[0,0]}] },
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active", reportScore: 0, lastUpdated: "2 saat önce", zones: [{name:"İtfaiye Girişi", offset:[0,0]}] },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active", reportScore: 0, lastUpdated: "Dün", zones: [{name:"Fakülte Kapısı", offset:[0,0]}] },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active", reportScore: 0, lastUpdated: "15 dk önce", zones: [{name:"Poliklinik Girişi", offset:[0.0002,0.0002]}, {name:"Acil Tarafı", offset:[-0.0002,-0.0002]}] },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active", reportScore: 0, lastUpdated: "30 dk önce", zones: [{name:"Cadde Girişi", offset:[0,0]}] },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active", reportScore: 0, lastUpdated: "5 dk önce", zones: [{name:"Teleferik Yönü", offset:[0,0]}] },
    { name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0, lastUpdated: "Şimdi", zones: [{name:"AVM Girişi", offset:[0.0003,-0.0003]}, {name:"Pazar Yeri", offset:[-0.0003,0.0003]}] },
    { name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0, lastUpdated: "1 saat önce", zones: [{name:"Denizciler Parkı", offset:[0.0002,-0.0002]}] },
    { name: "Göztepe", coords: [38.3961, 27.0944], status: "active", reportScore: 0, lastUpdated: "3 saat önce", zones: [{name:"Sahil Tarafı", offset:[0,0]}, {name:"Cadde Tarafı", offset:[0.0002,0.0002]}] },
    { name: "Hatay", coords: [38.4017, 27.1028], status: "active", reportScore: 0, lastUpdated: "20 dk önce", zones: [{name:"Renkli Durağı", offset:[0,0]}] },
    { name: "İzmirspor", coords: [38.4017, 27.1106], status: "active", reportScore: 0, lastUpdated: "Dün", zones: [{name:"Devlet Hastanesi", offset:[0,0]}] },
    { name: "Üçyol", coords: [38.4058, 27.1211], status: "active", reportScore: 0, lastUpdated: "12 dk önce", zones: [{name:"Betonyol Çıkışı", offset:[0.0002,0]}, {name:"Park Girişi", offset:[-0.0002,0]}] },
    { name: "Konak", coords: [38.4169, 27.1281], status: "active", reportScore: 0, lastUpdated: "2 dk önce", zones: [{name:"Vapur İskelesi", offset:[0.0002,-0.0002]}, {name:"Kemeraltı", offset:[-0.0002,0.0002]}, {name:"YKM Önü", offset:[0,0]}] },
    { name: "Çankaya", coords: [38.4225, 27.1361], status: "active", reportScore: 0, lastUpdated: "1 saat önce", zones: [{name:"Hilton Tarafı", offset:[0,0]}, {name:"Bit Pazarı", offset:[0.0002,0.0002]}] },
    { name: "Basmane", coords: [38.4228, 27.1447], status: "active", reportScore: 0, lastUpdated: "40 dk önce", zones: [{name:"Gar Girişi", offset:[0,0]}, {name:"Fuar Kapısı", offset:[0.0002,0]}] },
    { name: "Hilal", coords: [38.4269, 27.1550], status: "active", reportScore: 0, lastUpdated: "Bugün", zones: [{name:"İZBAN Aktarma", offset:[0,0]}] },
    { name: "Halkapınar", coords: [38.4344, 27.1686], status: "active", reportScore: 0, lastUpdated: "10 dk önce", zones: [{name:"Otobüs Aktarma", offset:[0,0]}, {name:"Tramvay Tarafı", offset:[0.0002,0.0002]}] },
    { name: "Stadyum", coords: [38.4425, 27.1806], status: "active", reportScore: 0, lastUpdated: "Dün", zones: [{name:"Ana Giriş", offset:[0,0]}] },
    { name: "Sanayi", coords: [38.4483, 27.1903], status: "active", reportScore: 0, lastUpdated: "5 saat önce", zones: [{name:"Ana Giriş", offset:[0,0]}] },
    { name: "Bölge", coords: [38.4547, 27.2011], status: "active", reportScore: 0, lastUpdated: "30 dk önce", zones: [{name:"Üniversite Tarafı", offset:[0,0]}] },
    { name: "Bornova", coords: [38.4583, 27.2125], status: "active", reportScore: 0, lastUpdated: "15 dk önce", zones: [{name:"Meydan Çıkışı", offset:[0,0]}, {name:"Hastane Tarafı", offset:[0.0002,0.0002]}] },
    { name: "Ege Üniversitesi", coords: [38.4615, 27.2210], status: "active", reportScore: 0, lastUpdated: "1 saat önce", zones: [{name:"Kampüs Girişi", offset:[0,0]}] },
    { name: "Evka-3", coords: [38.4650, 27.2286], status: "active", reportScore: 0, lastUpdated: "Şimdi", zones: [{name:"Ana Giriş", offset:[0,0]}] }
];

L.polyline(metroStations.map(s => s.coords), { color: '#e74c3c', weight: 6, opacity: 0.8 }).addTo(map);

function checkAndFixStatus(station) {
    let score = parseInt(station.reportScore) || 0;
    station.reportScore = score;
    if (score >= REPORT_THRESHOLD) { station.status = 'inactive'; } 
    else if (score > 0) { station.status = 'pending'; } 
    else { station.status = 'active'; }
}

function getAvatarUrl(name) { return `https://ui-avatars.com/api/?name=${name}&background=1e69de&color=fff&rounded=true&bold=true`; }
function calculateLevel() { return Math.floor(gameState.xp / 100) + 1; }
function getNextLevelXp() { return calculateLevel() * 100; }

function saveData() {
    try {
        localStorage.setItem('izmirMetro_gameState', JSON.stringify(gameState));
        const stationData = metroStations.map(s => ({ name: s.name, reportScore: s.reportScore, lastUpdated: s.lastUpdated }));
        localStorage.setItem('izmirMetro_stations', JSON.stringify(stationData));
    } catch (e) { console.error("Kayıt hatası", e); }
}

function loadData() {
    try {
        const savedState = localStorage.getItem('izmirMetro_gameState');
        const savedStations = localStorage.getItem('izmirMetro_stations');
        if (savedState) { 
            const parsed = JSON.parse(savedState);
            if (parsed && parsed.badges) gameState = parsed; 
        }
        if (savedStations) {
            const parsedStations = JSON.parse(savedStations);
            parsedStations.forEach(savedS => {
                const originalS = metroStations.find(s => s.name === savedS.name);
                if (originalS) {
                    originalS.reportScore = savedS.reportScore;
                    if(savedS.lastUpdated) originalS.lastUpdated = savedS.lastUpdated;
                    checkAndFixStatus(originalS); 
                }
            });
        }
    } catch (e) { localStorage.clear(); }
    if(gameState.isLoggedIn) updateUI();
    renderStations();
}

function renderStations(searchTerm = "") {
    markersLayer.clearLayers();
    const listDiv = document.getElementById('station-list');
    if(listDiv) listDiv.innerHTML = "";
    // ==========================================
    // 1. HARİTA VE İSTASYON VERİLERİ KURULUMU
    // ==========================================

    const filtered = metroStations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const countSpan = document.getElementById('result-count');
    if(countSpan) countSpan.innerText = filtered.length;

    filtered.forEach(station => {
        checkAndFixStatus(station);
        let color = '#27ae60', statusText = 'Sorun Yok', statusClass = 'status-ok', icon = '<i class="fas fa-check-circle"></i>';
        if (station.status === 'inactive') { color = '#c0392b'; statusText = 'Arıza Var'; statusClass = 'status-err'; icon = '<i class="fas fa-times-circle"></i>'; } 
        else if (station.status === 'pending') { color = '#f39c12'; statusText = `Doğrulama (${station.reportScore}/${REPORT_THRESHOLD})`; statusClass = 'status-pending'; icon = '<i class="fas fa-exclamation-circle"></i>'; }

        const marker = L.circleMarker(station.coords, {color: 'white', weight: 2, fillColor: color, fillOpacity: 1, radius: 9}).addTo(markersLayer);
        marker.bindTooltip(`<b>${station.name}</b><br>${statusText}`);
        marker.on('click', () => triggerAction(station));

        const card = document.createElement('div');
        card.className = 'station-card';
        card.onclick = () => triggerListClick(station.name);
        
        let btns = `<button class="btn-icon-action btn-report" onclick="event.stopPropagation(); triggerAction('${station.name}', 'report')" title="Bildir"><i class="fas fa-bullhorn"></i></button>`;
        if(station.status !== 'active') btns += `<button class="btn-icon-action btn-verify" onclick="event.stopPropagation(); triggerAction('${station.name}', 'verify')" title="Doğrula"><i class="fas fa-check"></i></button>`;
        
        card.innerHTML = `
            <div class="card-info">
                <div class="card-header"><i class="fas fa-subway station-icon"></i> ${station.name}</div>
                <span class="status-badge ${statusClass}">${icon} ${statusText}</span>
                <div class="station-update-time"><i class="far fa-clock"></i> ${station.lastUpdated} güncellendi</div>
            </div>
            <div class="card-actions">${btns}</div>`;
            
        listDiv.appendChild(card);
    });
}

loadData();
const searchInput = document.getElementById('station-search');
if(searchInput) searchInput.addEventListener('input', (e) => renderStations(e.target.value));

function triggerAction(stationOrName, type) {
    const name = typeof stationOrName === 'string' ? stationOrName : stationOrName.name;
    const s = metroStations.find(st => st.name === name);
    if (!type) type = s.status === 'active' ? 'report' : 'verify';
    if (!gameState.isLoggedIn) { openLoginModal(); return; }
    if (type === 'report') openReportModal(name);
    else openVerifyModal(name);
}

const reportModal = document.getElementById('reportModal');
const verifyModal = document.getElementById('verifyModal');
const loginModal = document.getElementById('loginModal');
const profileModal = document.getElementById('profileModal');
let currentStationName, selectedZone, hasPhoto, stationToVerify, miniMap;

function openReportModal(name) {
    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    selectedZone = null; hasPhoto = false;
    document.getElementById('btn-submit-report').disabled = true;
    document.getElementById('selected-zone-info').className = "selection-alert";
    document.getElementById('selected-zone-info').innerText = "Lütfen haritadan arızalı girişi seçin";
    document.getElementById('file-label').innerHTML = '<i class="fas fa-camera fa-2x"></i> Fotoğraf Ekle (+20)';
    // İzmir Metro İstasyonları Örnek Veri Seti
    const stations = [
        { id: 1, name: "Kaymakamlık", lat: 38.3861, lng: 26.9854, status: "ok" },
        { id: 2, name: "100. Yıl Cumhuriyet Şehitlik", lat: 38.3875, lng: 27.0012, status: "pending" },
        { id: 3, name: "Narlıdere İtfaiye", lat: 38.3890, lng: 27.0150, status: "ok" },
        { id: 4, name: "Güzel Sanatlar", lat: 38.3905, lng: 27.0300, status: "ok" },
        { id: 5, name: "Dokuz Eylül Üniversitesi", lat: 38.3920, lng: 27.0450, status: "error" },
        { id: 6, name: "Çağdaş", lat: 38.3910, lng: 27.0550, status: "ok" },
        { id: 7, name: "Balçova", lat: 38.3895, lng: 27.0620, status: "ok" },
        { id: 8, name: "Fahrettin Altay", lat: 38.3885, lng: 27.0699, status: "ok" },
        { id: 9, name: "Poligon", lat: 38.3942, lng: 27.0805, status: "ok" },
        { id: 10, name: "Göztepe", lat: 38.3995, lng: 27.0880, status: "ok" },
        { id: 11, name: "Hatay", lat: 38.4050, lng: 27.0985, status: "error" },
        { id: 12, name: "İzmirspor", lat: 38.4105, lng: 27.1080, status: "ok" },
        { id: 13, name: "Üçyol", lat: 38.4150, lng: 27.1185, status: "ok" },
        { id: 14, name: "Konak", lat: 38.4189, lng: 27.1287, status: "pending" },
        { id: 15, name: "Çankaya", lat: 38.4230, lng: 27.1350, status: "ok" },
        { id: 16, name: "Basmane", lat: 38.4255, lng: 27.1405, status: "ok" },
        { id: 17, name: "Hilal", lat: 38.4265, lng: 27.1490, status: "ok" },
        { id: 18, name: "Halkapınar", lat: 38.4325, lng: 27.1550, status: "ok" },
        { id: 19, name: "Stadyum", lat: 38.4385, lng: 27.1650, status: "error" },
        { id: 20, name: "Sanayi", lat: 38.4440, lng: 27.1750, status: "ok" },
        { id: 21, name: "Bölge", lat: 38.4505, lng: 27.1850, status: "ok" },
        { id: 22, name: "Bornova", lat: 38.4598, lng: 27.2212, status: "ok" },
        { id: 23, name: "Ege Üniversitesi", lat: 38.4635, lng: 27.2300, status: "ok" },
        { id: 24, name: "Evka 3", lat: 38.4670, lng: 27.2400, status: "ok" }
    ];

    // Haritayı Başlat (İzmir merkeze odaklı)
    const map = L.map('map', { zoomControl: false }).setView([38.4237, 27.1428], 12);

    const s = metroStations.find(st => st.name === name);
    const altBox = document.getElementById('alternative-route-box');
    if(s.status !== 'active') { altBox.style.display = 'flex'; document.getElementById('suggestion-text').innerText = `Alternatif: ${getAlternative(name)}`; }
    else altBox.style.display = 'none';

    setTimeout(() => {
        if(miniMap) miniMap.remove();
        miniMap = L.map('mini-map', {center: s.coords, zoom: 18, zoomControl:false});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap);
        const zones = s.zones || [{name:"Genel", offset:[0,0]}];
        zones.forEach(z => {
            const m = L.circleMarker([s.coords[0]+z.offset[0], s.coords[1]+z.offset[1]], {color:'#3498db', radius:10}).addTo(miniMap);
            m.bindTooltip(z.name, {permanent:true, direction:'top', offset:[0,-10]});
            m.on('click', () => {
                selectedZone = z.name;
                document.getElementById('selected-zone-info').className = "selection-alert selected";
                document.getElementById('selected-zone-info').innerText = `Seçildi: ${z.name}`;
                document.getElementById('btn-submit-report').disabled = false;
                miniMap.eachLayer(l => { if(l instanceof L.CircleMarker) l.setStyle({color:'#3498db'}); });
                m.setStyle({color:'#e74c3c'});
            });
        });
    }, 200);
}

document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = metroStations.find(st => st.name === currentStationName);
    s.reportScore++;
    s.lastUpdated = "Şimdi"; 
    checkAndFixStatus(s); 
    addXp(50 + (hasPhoto?20:0)); 
    gameState.totalReports++; gameState.badges.firstReport=true;
    saveData(); updateUI(); renderStations(); closeAllModals(); alert("✅ Bildirim Alındı!");
});

function openVerifyModal(name) {
    stationToVerify = name;
    document.getElementById('verify-station-name').innerText = name;
    verifyModal.style.display = 'flex';
}

window.submitVerification = (fixed) => {
    const s = metroStations.find(st => st.name === stationToVerify);
    if(fixed) { s.reportScore = 0; addXp(30); } 
    else { s.reportScore++; addXp(15); }
    s.lastUpdated = "Şimdi"; 
    checkAndFixStatus(s); 
    gameState.verifiedCount++; gameState.badges.verifier=true;
    saveData(); updateUI(); renderStations(); closeAllModals(); alert("✅ Teşekkürler!");
}

function updateUI() {
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarDesc = document.getElementById('sidebar-user-desc');
    const sidebarImg = document.getElementById('sidebar-user-img');
    
    if (sidebarName) sidebarName.innerText = gameState.username;
    if (sidebarDesc) sidebarDesc.innerText = gameState.isLoggedIn ? `Seviye ${calculateLevel()}` : "Giriş Yap";
    if (sidebarImg) sidebarImg.src = getAvatarUrl(gameState.username);

    document.getElementById('modal-username').innerText = gameState.username;
    document.getElementById('modal-avatar').src = getAvatarUrl(gameState.username);
    document.getElementById('modal-level').innerText = calculateLevel();
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    document.getElementById('stat-badges').innerText = Object.values(gameState.badges).filter(b => b).length;
    
    const progress = ((gameState.xp % 100) / 100) * 100;
    document.getElementById('xp-bar').style.width = `${progress}%`;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${getNextLevelXp()} XP`;
    // Açık Kaynaklı Harita Görünümü (OSM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap - Visi',
        maxZoom: 18
    }).addTo(map);

    // Zoom Butonlarını Sağ Alta Al
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Metro Hattını (Kırmızı Çizgi) Haritaya Çiz
    const lineCoords = stations.map(s => [s.lat, s.lng]);
    L.polyline(lineCoords, { color: '#e74c3c', weight: 4, opacity: 0.7 }).addTo(map);

    // ==========================================
    // 2. İSTASYONLARI HARİTAYA VE LİSTEYE EKLEME
    // ==========================================

    const updateBadge = (id, unlocked) => {
        const el = document.getElementById(id);
        if(unlocked && el) { el.classList.remove('locked'); el.querySelector('.badge-status').className = 'fas fa-check-circle badge-status active'; }
    const stationListElement = document.getElementById('station-list');
    document.getElementById('result-count').innerText = stations.length;

    // Özel İşaretçi (Marker) Stili Oluşturucu
    const getIcon = (status) => {
        let color = status === 'ok' ? '#27ae60' : (status === 'error' ? '#c0392b' : '#f39c12');
        return L.divIcon({
            className: 'custom-station-icon',
            html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
};
    updateBadge('badge-first-login', gameState.badges.firstLogin);
    updateBadge('badge-first-report', gameState.badges.firstReport);
    updateBadge('badge-verifier', gameState.badges.verifier);
}

function openLoginModal() { loginModal.style.display = 'flex'; }
function openProfileModal() { profileModal.style.display = 'flex'; updateUI(); }
function closeAllModals() { 
    reportModal.style.display='none'; verifyModal.style.display='none'; 
    loginModal.style.display='none'; profileModal.style.display='none'; 
}
window.closeReportModal = closeAllModals; window.closeVerifyModal = closeAllModals; window.closeLoginModal = closeAllModals; window.closeProfileModal = closeAllModals;
window.handleProfileClick = () => gameState.isLoggedIn ? openProfileModal() : openLoginModal();
    stations.forEach(station => {
        // 1. Haritaya İşaretçi Ekle
        const marker = L.marker([station.lat, station.lng], { icon: getIcon(station.status) }).addTo(map);
        
        // İşaretçiye Tıklanınca Çıkacak Küçük Baloncuk (Popup)
        marker.bindPopup(`
            <div style="text-align:center; padding: 5px;">
                <h4 style="margin:0 0 10px 0; color:#2c3e50;">${station.name}</h4>
                <button onclick="openReportModal('${station.name}')" style="background:#1e69de; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">
                    Durum Bildir
                </button>
            </div>
        `);

        // 2. Sol Panele (Sidebar) Liste Elemanı Ekle
        let statusBadge = '';
        if(station.status === 'ok') {
            statusBadge = '<span class="status-badge status-ok"><i class="fas fa-check-circle"></i> Sorun Yok</span>';
        } else if(station.status === 'error') {
            statusBadge = '<span class="status-badge status-err"><i class="fas fa-exclamation-circle"></i> Arıza Bildirildi</span>';
        } else {
            statusBadge = '<span class="status-badge status-pending"><i class="fas fa-clock"></i> Doğrulanıyor</span>';
        }

window.performLogin = () => {
    const btn = document.querySelector('.btn-google-login');
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Bağlanılıyor...';
    setTimeout(() => {
        const names = ["Ahmet Yılmaz", "Zeynep Kaya", "Mehmet Demir", "Ayşe Çelik"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const parts = randomName.split(' ');
        gameState.username = `${parts[0]} ${parts[1][0]}.`;
        gameState.isLoggedIn = true;
        gameState.badges.firstLogin = true;
        saveData(); updateUI(); closeAllModals(); 
        btn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="24"> Google ile Devam Et';
        alert(`🎉 Hoşgeldin, ${gameState.username}!`);
    }, 1500);
}
        stationListElement.innerHTML += `
            <div class="station-card" onclick="focusStation(${station.lat}, ${station.lng})">
                <div class="card-info">
                    <div class="card-header">
                        <i class="fas fa-subway" style="color:var(--primary-color)"></i> ${station.name}
                    </div>
                    ${statusBadge}
                </div>
                <div class="card-actions">
                    <button class="btn-icon-action btn-report" title="Arıza Bildir" onclick="event.stopPropagation(); openReportModal('${station.name}')">
                        <i class="fas fa-bullhorn"></i>
                    </button>
                </div>
            </div>
        `;
    });

window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15);
    setTimeout(() => {
    // Listeden bir istasyona tıklanınca haritayı oraya kaydırır
    window.focusStation = function(lat, lng) {
        map.setView([lat, lng], 16, { animate: true, duration: 1 });
        
if(window.innerWidth <= 768) {
document.getElementById('sidebar').classList.add('closed');
}
        triggerAction(name);
    }, 800);
}
document.getElementById('file-input').addEventListener('change', function() { if(this.files[0]) { hasPhoto=true; document.getElementById('file-label').innerText = "✅ Fotoğraf Eklendi"; } });
    };

window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}
    // ==========================================
    // 3. MODAL (PENCERE) KONTROLLERİ VE KULLANICI GİRİŞİ
    // ==========================================
    
    let isUserLoggedIn = false; // Sisteme giriş yapılıp yapılmadığını tutar

    // Sol üstteki Profil kutusuna tıklayınca çalışır
    window.handleProfileClick = function() {
        if (isUserLoggedIn) {
            document.getElementById('profileModal').style.display = 'flex';
        } else {
            document.getElementById('loginModal').style.display = 'flex';
        }
    };

window.onclick = (e) => { if(e.target.classList.contains('modal')) closeAllModals(); };
    // Modalları Kapatma Fonksiyonları
    window.closeLoginModal = function() { document.getElementById('loginModal').style.display = 'none'; }
    window.closeProfileModal = function() { document.getElementById('profileModal').style.display = 'none'; }
    window.closeReportModal = function() { document.getElementById('reportModal').style.display = 'none'; }
    
    // Bildirim yapma penceresini açar
    window.openReportModal = function(stationName) { 
        document.getElementById('modal-station-name').innerText = stationName;
        document.getElementById('reportModal').style.display = 'flex'; 
    };

window.locateUser = () => {
    if (!navigator.geolocation) { alert("Konum desteklenmiyor."); return; }
    const btn = document.getElementById('gps-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    navigator.geolocation.getCurrentPosition(
        (p) => {
            const lat = p.coords.latitude; const lng = p.coords.longitude;
            map.flyTo([lat, lng], 15);
            L.circleMarker([lat, lng], {radius: 8, fillColor: "#3498db", color: "#fff", weight: 2, fillOpacity: 0.8}).addTo(map).bindPopup("Konumunuz").openPopup();
            btn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        },
        () => { alert("Konum alınamadı."); btn.innerHTML = '<i class="fas fa-location-arrow"></i>'; }
    );
}
    // Kullanıcı Giriş/Kayıt Çıkış ve Sıfırlama İşlemi
    window.resetData = function() {
        isUserLoggedIn = false;
        document.getElementById('sidebar-user-name').innerText = "Misafir";
        document.getElementById('sidebar-user-desc').innerText = "Giriş Yap";
        document.getElementById('sidebar-user-img').src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        closeProfileModal();
        alert("Hesabınızdan başarıyla çıkış yapıldı.");
    };

function addXp(amount) { 
    gameState.xp += amount; 
    if(calculateLevel() > gameState.level) { gameState.level++; alert(`🎉 TEBRİKLER! Seviye ${gameState.level} oldunuz!`); } 
}
function getAlternative(name) {
    const i = metroStations.findIndex(s => s.name === name);
    if(i>0 && metroStations[i-1].status==='active') return metroStations[i-1].name;
    if(i<metroStations.length-1 && metroStations[i+1].status==='active') return metroStations[i+1].name;
    return "Otobüs kullanın";
}
window.resetData = function() {
    if(confirm("Tüm veriler sıfırlanacak. Emin misiniz?")) { localStorage.clear(); location.reload(); }
}
setInterval(() => {
    const t = document.getElementById('ticker-text');
    const msgs = ["Sistem: Hatay bakımda", "Ali K. Konak doğruladı", "Can B. Üçyol raporladı"];
    if(t) { t.style.opacity = 0; setTimeout(() => { t.innerText = msgs[Math.floor(Math.random()*msgs.length)]; t.style.opacity = 1; }, 500); }
}, 4000);
    // Giriş / Kayıt İşlemini Simüle Et (Arayüzde değişikliği gösterir)
    // Not: harita.html içindeki inline kodların bu ana fonksiyona erişebilmesi için window'a ekledik.
    window.handleUserAuth = function() {
        isUserLoggedIn = true;
        document.getElementById('sidebar-user-name').innerText = "Togay Özkay";
        document.getElementById('sidebar-user-desc').innerText = "Seviye 1";
        document.getElementById('sidebar-user-img').src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Şık bir avatar
        
        closeLoginModal();
    };

if(window.innerWidth > 768) {
    document.getElementById('sidebar').classList.remove('closed');
}
    // Arama Kutusu Filtreleme Sistemi
    const searchInput = document.getElementById('station-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.station-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const name = card.querySelector('.card-header').innerText.toLowerCase();
                if(name.includes(term)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            document.getElementById('result-count').innerText = visibleCount;
        });
    }
});
