/* --- AYARLAR --- */
const TEST_MODE = true;
const REPORT_THRESHOLD = 3; 

/* --- GÜVENLİK KONTROLÜ --- */
// Eğer Leaflet kütüphanesi yüklenmediyse uyarı ver
if (typeof L === 'undefined') {
    alert("Harita kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.");
}

/* --- 1. HARİTA KURULUMU --- */
var map = L.map('map', {zoomControl: false}).setView([38.4189, 27.1287], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '© OSM' 
}).addTo(map);

L.control.zoom({position: 'bottomright'}).addTo(map);
var markersLayer = L.layerGroup().addTo(map);

/* --- 2. OYUN STATE --- */
let gameState = { 
    isLoggedIn: false, 
    username: "Misafir", 
    xp: 0, 
    level: 1, 
    totalReports: 0, 
    verifiedCount: 0, 
    badges: {firstLogin:false, firstReport:false, verifier:false} 
};

/* --- 3. İSTASYON VERİLERİ --- */
const metroStations = [
    { name: "Kaymakamlık", coords: [38.3950, 26.9911], status: "active", reportScore: 0, zones: [{ name: "Ana Giriş", offset: [0,0] }] },
    { name: "100. Yıl C. Şehitlik", coords: [38.3958, 27.0003], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Narlıdere (İtfaiye)", coords: [38.3936, 27.0150], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Güzel Sanatlar", coords: [38.3925, 27.0236], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "DEÜ Hastanesi", coords: [38.3944, 27.0386], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Çağdaş", coords: [38.3944, 27.0453], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Balçova", coords: [38.3958, 27.0569], status: "active", reportScore: 0, zones: [{name:"Giriş", offset:[0,0]}] },
    { name: "Fahrettin Altay", coords: [38.3969, 27.0700], status: "active", reportScore: 0, zones: [{name:"AVM", offset:[0.0003,-0.0003]}, {name:"Pazar", offset:[-0.0003,0.0003]}] },
    { name: "Poligon", coords: [38.3933, 27.0850], status: "active", reportScore: 0, zones: [{name:"Park", offset:[0.0002,-0.0002]}] },
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

// Hattı Çiz
L.polyline(metroStations.map(s => s.coords), { color: '#e74c3c', weight: 6, opacity: 0.8 }).addTo(map);

/* --- 4. YARDIMCI FONKSİYONLAR --- */

// PUAN ve RENK KONTROLÜ (BU FONKSİYON HATAYI DÜZELTİR)
function checkAndFixStatus(station) {
    // Puanı sayıya çevir
    let score = parseInt(station.reportScore) || 0;
    station.reportScore = score; // Düzeltilmiş puanı kaydet

    if (score >= REPORT_THRESHOLD) {
        station.status = 'inactive'; // 3 veya daha fazlaysa KIRMIZI
    } else if (score > 0) {
        station.status = 'pending'; // 0 ile 3 arasındaysa SARI
    } else {
        station.status = 'active'; // 0 ise YEŞİL
    }
}

function getAvatarUrl(name) { return `https://ui-avatars.com/api/?name=${name}&background=1e69de&color=fff&rounded=true&bold=true`; }
function calculateLevel() { return Math.floor(gameState.xp / 100) + 1; }
function getNextLevelXp() { return calculateLevel() * 100; }

/* --- 5. VERİ YÖNETİMİ (KENDİNİ ONARAN SİSTEM) --- */
function saveData() {
    try {
        localStorage.setItem('izmirMetro_gameState', JSON.stringify(gameState));
        const stationData = metroStations.map(s => ({ name: s.name, reportScore: s.reportScore }));
        localStorage.setItem('izmirMetro_stations', JSON.stringify(stationData));
    } catch (e) { console.error("Kayıt hatası:", e); }
}

function loadData() {
    try {
        const savedState = localStorage.getItem('izmirMetro_gameState');
        const savedStations = localStorage.getItem('izmirMetro_stations');

        if (savedState) { 
            const parsed = JSON.parse(savedState);
            if (parsed && parsed.badges) gameState = parsed; // Veri doğrulama
        }

        if (savedStations) {
            const parsedStations = JSON.parse(savedStations);
            parsedStations.forEach(savedS => {
                const originalS = metroStations.find(s => s.name === savedS.name);
                if (originalS) {
                    originalS.reportScore = savedS.reportScore;
                    // YÜKLERKEN DURUMU ONAR
                    checkAndFixStatus(originalS);
                }
            });
        }
    } catch (e) {
        console.warn("Bozuk veri tespit edildi, sıfırlanıyor...");
        localStorage.clear();
    }
    
    if(gameState.isLoggedIn) updateUI();
    renderStations();
}

/* --- 6. RENDER (EKRANA ÇİZME) --- */
function renderStations(searchTerm = "") {
    markersLayer.clearLayers();
    const listDiv = document.getElementById('station-list');
    if(listDiv) listDiv.innerHTML = "";
    
    const filtered = metroStations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const countSpan = document.getElementById('result-count');
    if(countSpan) countSpan.innerText = filtered.length;

    filtered.forEach(station => {
        // HER ÇİZİMDE DURUMU KONTROL ET
        checkAndFixStatus(station);

        let color = '#27ae60', statusText = 'Sorun Yok', statusClass = 'status-ok', icon = '<i class="fas fa-check-circle"></i>';
        
        if (station.status === 'inactive') { 
            color = '#c0392b'; statusText = 'Arıza Var'; statusClass = 'status-err'; icon = '<i class="fas fa-times-circle"></i>';
        } else if (station.status === 'pending') { 
            color = '#f39c12'; statusText = `Doğrulama (${station.reportScore}/${REPORT_THRESHOLD})`; statusClass = 'status-pending'; icon = '<i class="fas fa-exclamation-circle"></i>';
        }

        const marker = L.circleMarker(station.coords, {color: 'white', weight: 2, fillColor: color, fillOpacity: 1, radius: 9}).addTo(markersLayer);
        marker.bindTooltip(`<b>${station.name}</b><br>${statusText}`);
        marker.on('click', () => triggerAction(station));

        const card = document.createElement('div');
        card.className = 'station-card';
        card.onclick = () => triggerListClick(station.name);
        
        let btns = `<button class="btn-icon-action btn-report" onclick="event.stopPropagation(); triggerAction('${station.name}', 'report')" title="Durum Bildir"><i class="fas fa-bullhorn"></i></button>`;
        if(station.status !== 'active') btns += `<button class="btn-icon-action btn-verify" onclick="event.stopPropagation(); triggerAction('${station.name}', 'verify')" title="Doğrula"><i class="fas fa-check"></i></button>`;

        card.innerHTML = `<div class="card-info"><div class="card-header"><i class="fas fa-subway station-icon"></i> ${station.name}</div><span class="status-badge ${statusClass}">${icon} ${statusText}</span></div><div class="card-actions">${btns}</div>`;
        listDiv.appendChild(card);
    });
}

/* --- 7. ETKİLEŞİM --- */
function triggerAction(stationOrName, type) {
    const name = typeof stationOrName === 'string' ? stationOrName : stationOrName.name;
    const s = metroStations.find(st => st.name === name);
    if (!type) type = s.status === 'active' ? 'report' : 'verify';
    
    if (!gameState.isLoggedIn) { openLoginModal(); return; }
    if (type === 'report') openReportModal(name);
    else openVerifyModal(name);
}

/* --- 8. MODAL İŞLEMLERİ --- */
const reportModal = document.getElementById('reportModal');
const verifyModal = document.getElementById('verifyModal');
const loginModal = document.getElementById('loginModal');
const profileModal = document.getElementById('profileModal');
let currentStationName, selectedZone, hasPhoto, stationToVerify, miniMap;

// Rapor Modal
function openReportModal(name) {
    currentStationName = name;
    document.getElementById('modal-station-name').innerText = name;
    reportModal.style.display = 'flex';
    selectedZone = null; hasPhoto = false;
    document.getElementById('btn-submit-report').disabled = true;
    document.getElementById('selected-zone-info').className = "selection-alert";
    document.getElementById('selected-zone-info').innerText = "Lütfen haritadan seçim yapın";
    document.getElementById('file-label').innerHTML = '<i class="fas fa-camera fa-2x"></i> Fotoğraf Ekle (İsteğe Bağlı)';
    
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

// Rapor Gönder Butonu
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = metroStations.find(st => st.name === currentStationName);
    
    s.reportScore++;
    checkAndFixStatus(s); // Durumu kontrol et
    
    addXp(50 + (hasPhoto?20:0)); 
    gameState.totalReports++; 
    gameState.badges.firstReport=true;
    
    saveData(); 
    updateUI(); renderStations(); closeAllModals(); 
    alert("✅ Bildirim Alındı!");
});

// Doğrulama Modal
function openVerifyModal(name) {
    stationToVerify = name;
    document.getElementById('verify-station-name').innerText = name;
    verifyModal.style.display = 'flex';
}

// Doğrulama Gönder Butonu
window.submitVerification = (fixed) => {
    const s = metroStations.find(st => st.name === stationToVerify);
    if(fixed) { 
        s.reportScore = 0; 
        addXp(30); 
    } else { 
        s.reportScore++; 
        addXp(15); 
    }
    checkAndFixStatus(s); // Durumu kontrol et
    
    gameState.verifiedCount++; 
    gameState.badges.verifier=true;
    
    saveData(); // Kaydet
    updateUI(); renderStations(); closeAllModals(); 
    alert("✅ Teşekkürler!");
}

/* --- 9. UI VE GİRİŞ --- */
function updateUI() {
    document.getElementById('top-user-name').innerText = gameState.username;
    document.getElementById('top-user-desc').innerHTML = `<i class="fas fa-star" style="color:#f1c40f;"></i> Seviye ${calculateLevel()}`;
    const avatarUrl = getAvatarUrl(gameState.username);
    document.getElementById('top-user-img').src = avatarUrl;
    document.getElementById('modal-username').innerText = gameState.username;
    document.getElementById('modal-avatar').src = avatarUrl;
    
    document.getElementById('modal-level').innerText = calculateLevel();
    document.getElementById('stat-points').innerText = gameState.xp;
    document.getElementById('stat-reports').innerText = gameState.totalReports;
    document.getElementById('stat-badges').innerText = Object.values(gameState.badges).filter(b => b).length;
    
    const nextXp = getNextLevelXp();
    const progress = ((gameState.xp % 100) / 100) * 100;
    document.getElementById('xp-bar').style.width = `${progress}%`;
    document.getElementById('xp-text').innerText = `${gameState.xp}/${nextXp} XP`;
    
    const updateBadge = (id, unlocked) => {
        const el = document.getElementById(id);
        if(unlocked && el) {
            el.classList.remove('locked');
            const icon = el.querySelector('.badge-status');
            if(icon) icon.className = 'fas fa-check-circle badge-status active';
        }
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
window.closeReportModal = closeAllModals; 
window.closeVerifyModal = closeAllModals; 
window.closeLoginModal = closeAllModals; 
window.closeProfileModal = closeAllModals;

window.handleProfileClick = () => gameState.isLoggedIn ? openProfileModal() : openLoginModal();

window.performLogin = () => {
    const btn = document.querySelector('.btn-google-login');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Bağlanılıyor...';
    btn.disabled = true;

    setTimeout(() => {
        const names = ["Ahmet Yılmaz", "Zeynep Kaya", "Mehmet Demir", "Ayşe Çelik"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const parts = randomName.split(' ');
        gameState.username = `${parts[0]} ${parts[1][0]}.`;
        gameState.isLoggedIn = true;
        gameState.badges.firstLogin = true;
        
        saveData();
        updateUI(); 
        closeAllModals(); 
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        alert(`🎉 Hoşgeldin, ${gameState.username}!`);
    }, 1500);
}

window.triggerListClick = (name) => {
    const s = metroStations.find(st => st.name === name);
    map.flyTo(s.coords, 15);
    setTimeout(() => triggerAction(name), 800);
}

document.getElementById('file-input').addEventListener('change', function() { 
    if(this.files[0]) { 
        hasPhoto=true; 
        document.getElementById('file-label').innerText = "✅ Fotoğraf Eklendi"; 
    } 
});

document.getElementById('sidebar-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('closed'));
window.onclick = (e) => { if(e.target.classList.contains('modal')) closeAllModals(); };

// Arama
const searchInput = document.getElementById('station-search');
if(searchInput) searchInput.addEventListener('input', (e) => renderStations(e.target.value));

/* --- 10. EKSTRALAR --- */
function addXp(amount) { 
    gameState.xp += amount; 
    if(calculateLevel() > gameState.level) { 
        gameState.level++; 
        alert(`🎉 TEBRİKLER! Seviye ${gameState.level} oldunuz!`); 
    } 
}

function getAlternative(name) {
    const i = metroStations.findIndex(s => s.name === name);
    if(i>0 && metroStations[i-1].status==='active') return metroStations[i-1].name;
    if(i<metroStations.length-1 && metroStations[i+1].status==='active') return metroStations[i+1].name;
    return "Otobüs kullanın";
}

setInterval(() => {
    const t = document.getElementById('ticker-text');
    const msgs = ["Sistem: Hatay bakımda", "Ali K. Konak doğruladı", "Can B. Üçyol raporladı"];
    if(t) {
        t.style.opacity = 0;
        setTimeout(() => { 
            t.innerText = msgs[Math.floor(Math.random()*msgs.length)]; 
            t.style.opacity = 1; 
        }, 500);
    }
}, 4000);

// BAŞLAT
loadData();
// --- GPS VE KONUM ÖZELLİĞİ ---
window.locateUser = () => {
    if (!navigator.geolocation) {
        alert("Tarayıcınız konum servisini desteklemiyor.");
        return;
    }

    const btn = document.getElementById('gps-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Loading ikonu

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // 1. Haritayı kullanıcıya odakla
            map.flyTo([userLat, userLng], 15);

            // 2. Kullanıcıyı göster (Mavi nokta)
            L.circleMarker([userLat, userLng], {
                radius: 8,
                fillColor: "#3498db",
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map).bindPopup("Konumunuz").openPopup();

            // 3. En yakın istasyonu bul
            let closestStation = null;
            let minDistance = Infinity;

            metroStations.forEach(station => {
                const dist = getDistanceFromLatLonInKm(userLat, userLng, station.coords[0], station.coords[1]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestStation = station;
                }
            });

            if (closestStation) {
                // Eğer çok yakınsa (örn: 1km altı) o istasyonun kartını açabiliriz veya bilgi verebiliriz
                alert(`Size en yakın istasyon: ${closestStation.name} (${minDistance.toFixed(2)} km)`);
                // İstersen otomatik olarak o istasyonun detayını aç:
                // triggerAction(closestStation.name); 
            }

            btn.innerHTML = '<i class="fas fa-location-arrow"></i>'; // İkonu düzelt
        },
        () => {
            alert("Konum alınamadı. Lütfen GPS izni verin.");
            btn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        }
    );
}

// Mesafe Hesaplama (Haversine Formülü)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Dünyanın yarıçapı (km)
  var dLat = deg2rad(lat2-lat1); 
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
