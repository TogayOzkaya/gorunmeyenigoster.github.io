/* ==================================================
   GLOBAL FONKSİYONLAR VE KULLANICI YÖNETİMİ
   ================================================== */
window.isUserLoggedIn = localStorage.getItem('visi_logged_in') === 'true';

/* DİNAMİK İSİM VE KALICI PUAN GÜNCELLEME SİSTEMİ */
window.updateUserInfo = function() {
    const userNameEl = document.getElementById('sidebar-user-name');
    const userDescEl = document.getElementById('sidebar-user-desc');
    const userImgEl = document.getElementById('sidebar-user-img');
    const modalUserName = document.getElementById('modal-username'); 
    
    // Puan ve İstatistik Elementleri
    const statPoints = document.getElementById('stat-points');
    const statReports = document.getElementById('stat-reports');
    const statBadges = document.getElementById('stat-badges'); 
    const xpText = document.getElementById('xp-text');
    const xpBar = document.getElementById('xp-bar');
    const currentLevelTxt = document.getElementById('current-level-txt');
    const modalLevelBadge = document.getElementById('modal-level');
    
    if (window.isUserLoggedIn) {
        let storedName = localStorage.getItem('visi_user_name') || "Kullanıcı";
        // Veritabanından gelen veriyi localStorage'dan çek
        let userData = JSON.parse(localStorage.getItem('visi_user_data') || '{}');
        
        let points = userData.points || 0;
        let reports = userData.reportsCount || 0;
        let verifies = userData.verificationsCount || 0;
        
        // Her 100 puanda 1 Seviye atlama formülü
        let level = Math.floor(points / 100) + 1;
        let xpInLevel = points % 100;
        
        if(userNameEl) userNameEl.innerText = storedName;
        if(userDescEl) userDescEl.innerText = "Seviye " + level;
        if(userImgEl) userImgEl.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        if(modalUserName) modalUserName.innerHTML = `Merhaba, ${storedName}! 👋`;

        // Profil istatistiklerini canlı olarak güncelle
        if(statPoints) statPoints.innerText = points;
        if(statReports) statReports.innerText = reports;
        if(statBadges) statBadges.innerText = verifies;
        if(currentLevelTxt) currentLevelTxt.innerText = level;
        if(modalLevelBadge) modalLevelBadge.innerText = level;
        if(xpText) xpText.innerText = `Sonraki seviyeye ${100 - xpInLevel} XP kaldı 🚀`;
        if(xpBar) xpBar.style.width = xpInLevel + "%";
        
    } else {
        if(userNameEl) userNameEl.innerText = "Misafir";
        if(userDescEl) userDescEl.innerText = "Giriş Yap";
        if(userImgEl) userImgEl.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        if(modalUserName) modalUserName.innerHTML = "Merhaba, Yol Arkadaşımız! 👋";
    }
};

window.toggleSidebar = function() {
    const sb = document.getElementById('sidebar');
    if(sb) sb.classList.toggle('closed');
};

window.handleProfileClick = function() {
    if (window.isUserLoggedIn) {
        document.getElementById('profileModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
    if (window.innerWidth <= 768) {
        const sb = document.getElementById('sidebar');
        if(sb && !sb.classList.contains('closed')) sb.classList.add('closed');
    }
};

window.closeModals = function() {
    ['loginModal', 'profileModal', 'reportModal', 'verifyModal'].forEach(id => {
        const modal = document.getElementById(id);
        if(modal) modal.style.display = 'none';
    });
};
window.closeLoginModal = window.closeModals;
window.closeProfileModal = window.closeModals;
window.closeReportModal = window.closeModals;
window.closeVerifyModal = window.closeModals;

window.resetData = function() {
    localStorage.setItem('visi_logged_in', 'false');
    localStorage.removeItem('visi_user_name');
    localStorage.removeItem('visi_user_data'); // Çıkışta puan verilerini de temizle
    window.isUserLoggedIn = false;
    window.updateUserInfo();
    window.closeModals();
    alert("Hesabınızdan başarıyla çıkış yapıldı.");
};

window.performLogin = function(e, loginType) {
    if(e) e.preventDefault();
    const tabSignup = document.getElementById('tab-signup');
    const isSignup = tabSignup && tabSignup.classList.contains('active');
    let userName = "Kullanıcı";

    if (loginType === 'google') {
        let googleName = prompt("Google hesabı ile bağlanıyorsunuz. Lütfen isminizi girin:", "Ali Yılmaz");
        if (!googleName) return; 
        userName = googleName;
    } else if (isSignup) {
        const terms = document.getElementById('terms-check');
        if(terms && !terms.checked) { alert("Devam etmek için güvenlik sözleşmesini kabul etmelisiniz."); return; }
        const nameInput = document.querySelector('#form-signup-content input[type="text"]');
        if(nameInput && nameInput.value.trim() !== "") userName = nameInput.value.trim();
        else { alert("Lütfen adınızı ve soyadınızı giriniz."); return; }
    } else {
        const savedName = localStorage.getItem('visi_user_name');
        if (savedName) { userName = savedName; } 
        else {
            const emailInput = document.querySelector('#form-login-content input[type="email"]');
            if(emailInput && emailInput.value.trim() !== "") {
                let mailStr = emailInput.value.split('@')[0];
                userName = mailStr.charAt(0).toUpperCase() + mailStr.slice(1);
            } else { alert("Lütfen e-posta adresinizi giriniz."); return; }
        }
    }

    localStorage.setItem('visi_logged_in', 'true');
    localStorage.setItem('visi_user_name', userName);
    window.isUserLoggedIn = true;
    window.updateUserInfo(); 
    window.closeModals();
    alert(isSignup ? `Kayıt Başarılı! Visi topluluğuna hoş geldin ${userName}. 🚀` : `Giriş Başarılı! Tekrar hoş geldin ${userName}. 👋`);
};

window.switchAuthTab = function(tab) {
    const loginContent = document.getElementById('form-login-content');
    const signupContent = document.getElementById('form-signup-content');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const googleBtnText = document.getElementById('google-btn-text');

    if(tab === 'login') {
        if(loginContent) loginContent.style.display = 'block'; 
        if(signupContent) signupContent.style.display = 'none';
        if(tabLogin) tabLogin.classList.add('active'); 
        if(tabSignup) tabSignup.classList.remove('active');
        if(googleBtnText) googleBtnText.innerText = "Google ile Giriş Yap";
    } else {
        if(loginContent) loginContent.style.display = 'none'; 
        if(signupContent) signupContent.style.display = 'block';
        if(tabSignup) tabSignup.classList.add('active'); 
        if(tabLogin) tabLogin.classList.remove('active');
        if(googleBtnText) googleBtnText.innerText = "Google ile Kayıt Ol";
    }
};

window.addEventListener('load', function() {
    window.updateUserInfo();

    if(window.innerWidth <= 768 && document.getElementById('sidebar')) {
        document.getElementById('sidebar').classList.add('closed');
    }

    try {
        const loginModal = document.getElementById('loginModal');
        const blobContainer = document.getElementById('blob-container');
        const passwordInputs = document.querySelectorAll('.password-input');
        const eyes = document.querySelectorAll('.eye');

        if (loginModal && blobContainer) {
            document.addEventListener('mousemove', (e) => {
                if (loginModal.style.display !== 'flex' || document.activeElement.classList.contains('password-input')) return;
                eyes.forEach(eye => {
                    const rect = eye.getBoundingClientRect();
                    const angle = Math.atan2(e.clientY - (rect.top + rect.height/2), e.clientX - (rect.left + rect.width/2));
                    const pupil = eye.querySelector('.pupil');
                    if(pupil) pupil.style.transform = `translate(${Math.cos(angle) * 4}px, ${Math.sin(angle) * 4}px)`;
                });
            });

            passwordInputs.forEach(input => {
                input.addEventListener('focus', () => blobContainer.classList.add('blindfolded'));
                input.addEventListener('blur', () => {
                    blobContainer.classList.remove('blindfolded');
                    eyes.forEach(eye => {
                        const pupil = eye.querySelector('.pupil');
                        if(pupil) pupil.style.transform = `translate(0px, 0px)`;
                    });
                });
            });
        }
    } catch(err) {}

    /* VERİTABANINA AKTARILACAK İLK TEMEL VERİLER */
    window.metroStations = [
        { name: "Evka-3", lat: 38.4650, lng: 27.2286, status: "ok", verifyCount: 0, zones: [{name: "Ana Giriş Asansörü", offset: [0, 0]}] },
        { name: "Ege Üniversitesi", lat: 38.4615, lng: 27.2210, status: "ok", verifyCount: 0, zones: [{name: "Kampüs Girişi", offset: [0, 0]}] },
        { name: "Bornova", lat: 38.4583, lng: 27.2125, status: "ok", verifyCount: 0, zones: [{name: "Meydan Çıkışı", offset: [0, 0]}, {name: "Hastane Tarafı", offset: [0.0002, 0.0002]}] },
        { name: "Bölge", lat: 38.4547, lng: 27.2011, status: "ok", verifyCount: 0, zones: [{name: "Kuzey-Batı Girişi (Fes Spa)", offset: [0.0008, -0.0010]}, {name: "Güney-Batı Girişi (Yaya Yolu)", offset: [-0.0005, -0.0008]}, {name: "Kuzey-Doğu Peron", offset: [0.0003, 0.0008]}, {name: "Güney-Doğu Üni. Cad.", offset: [-0.0002, 0.0003]}] },
        { name: "Sanayi", lat: 38.4483, lng: 27.1903, status: "ok", verifyCount: 0, zones: [{name: "Ana Giriş", offset: [0, 0]}] },
        { name: "Stadyum", lat: 38.4425, lng: 27.1806, status: "ok", verifyCount: 0, zones: [{name: "Ana Giriş", offset: [0, 0]}] },
        { name: "Halkapınar", lat: 38.4344, lng: 27.1686, status: "ok", verifyCount: 0, zones: [{name: "Otobüs Aktarma", offset: [0, 0]}, {name: "Tramvay Tarafı", offset: [0.0002, 0.0002]}] },
        { name: "Hilal", lat: 38.4269, lng: 27.1550, status: "ok", verifyCount: 0, zones: [{name: "İZBAN Aktarma", offset: [0, 0]}] },
        { name: "Basmane", lat: 38.4228, lng: 27.1447, status: "ok", verifyCount: 0, zones: [{name: "Gar Girişi", offset: [0, 0]}, {name: "Fuar Kapısı", offset: [-0.0002, 0]}] },
        { name: "Çankaya", lat: 38.4225, lng: 27.1361, status: "ok", verifyCount: 0, zones: [{name: "Hilton Tarafı", offset: [0, 0]}, {name: "Bit Pazarı", offset: [-0.0002, 0.0002]}] },
        { name: "Konak", lat: 38.4169, lng: 27.1281, status: "ok", verifyCount: 0, zones: [{name: "Vapur İskelesi", offset: [0.0002, -0.0002]}, {name: "Kemeraltı", offset: [-0.0002, 0.0002]}, {name: "YKM Önü", offset: [0, 0]}] },
        { name: "Üçyol", lat: 38.4058, lng: 27.1211, status: "ok", verifyCount: 0, zones: [{name: "Betonyol Çıkışı", offset: [0.0002, 0]}, {name: "Park Girişi", offset: [-0.0002, 0]}] },
        { name: "İzmirspor", lat: 38.4017, lng: 27.1106, status: "ok", verifyCount: 0, zones: [{name: "Devlet Hastanesi", offset: [0,0]}] },
        { name: "Hatay", lat: 38.4017, lng: 27.1028, status: "ok", verifyCount: 0, zones: [{name: "Renkli Durağı", offset: [0,0]}] },
        { name: "Göztepe", lat: 38.3961, lng: 27.0944, status: "ok", verifyCount: 0, zones: [{name: "Sahil Tarafı", offset: [0,0]}, {name: "Cadde Tarafı", offset: [0.0002, 0.0002]}] },
        { name: "Poligon", lat: 38.3933, lng: 27.0850, status: "ok", verifyCount: 0, zones: [{name: "Denizciler Parkı", offset: [0.0002, -0.0002]}] },
        { name: "Fahrettin Altay", lat: 38.3969, lng: 27.0700, status: "ok", verifyCount: 0, zones: [{name: "AVM Girişi", offset: [0.0003, -0.0003]}, {name: "Pazar Yeri", offset: [-0.0003, 0.0003]}] },
        { name: "Balçova", lat: 38.3958, lng: 27.0569, status: "ok", verifyCount: 0, zones: [{name: "Teleferik Yönü", offset: [0,0]}] },
        { name: "Çağdaş", lat: 38.3944, lng: 27.0453, status: "ok", verifyCount: 0, zones: [{name: "Cadde Girişi", offset: [0,0]}] },
        { name: "DEÜ Hastanesi", lat: 38.3944, lng: 27.0386, status: "ok", verifyCount: 0, zones: [{name: "Poliklinik Girişi", offset: [0.0002, 0.0002]}, {name: "Acil Tarafı", offset: [-0.0002, -0.0002]}] },
        { name: "Güzel Sanatlar", lat: 38.3925, lng: 27.0236, status: "ok", verifyCount: 0, zones: [{name: "Fakülte Kapısı", offset: [0,0]}] },
        { name: "Narlıdere (İtfaiye)", lat: 38.3936, lng: 27.0150, status: "ok", verifyCount: 0, zones: [{name: "İtfaiye Girişi", offset: [0,0]}] },
        { name: "100. Yıl C. Şehitlik", lat: 38.3958, lng: 27.0003, status: "ok", verifyCount: 0, zones: [{name: "Park Tarafı", offset: [0,0]}] },
        { name: "Kaymakamlık", lat: 38.3950, lng: 26.9911, status: "ok", verifyCount: 0, zones: [{name: "Kaymakamlık Asansörü", offset: [0, -0.0008]}] }
    ];

    window.mainMapMarkers = []; 
    window.currentReportingStation = null; 
    window.currentVerifyingStation = null;

    window.getIcon = function(status) {
        let color = status === 'ok' ? '#27ae60' : (status === 'error' ? '#c0392b' : '#f39c12');
        return L.divIcon({
            className: 'custom-station-icon',
            html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); transition: 0.3s;"></div>`,
            iconSize: [18, 18], iconAnchor: [9, 9]
        });
    };

    window.renderStations = function() {
        const stationListElement = document.getElementById('station-list');
        if(stationListElement) stationListElement.innerHTML = '';
        
        window.mainMapMarkers.forEach(m => { if(window.mainMap) window.mainMap.removeLayer(m); });
        window.mainMapMarkers = [];

        window.metroStations.forEach(station => {
            if(window.mainMap) {
                const marker = L.marker([station.lat, station.lng], { icon: window.getIcon(station.status) }).addTo(window.mainMap);
                window.mainMapMarkers.push(marker);

                let btnAction = station.status === 'ok' ? `openReportModal('${station.name}')` : `openVerifyModal('${station.name}')`;
                let btnText = station.status === 'ok' ? "Durum Bildir" : "Durumu Doğrula";
                let btnColor = station.status === 'ok' ? "#1e69de" : "#f39c12";
                if (station.status === 'error') btnColor = "#c0392b";

                marker.bindPopup(`
                    <div style="text-align:center; padding: 5px;">
                        <h4 style="margin:0 0 10px 0; color:#2c3e50;">${station.name}</h4>
                        <button onclick="${btnAction}" style="background:${btnColor}; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">
                            ${btnText}
                        </button>
                    </div>
                `);
            }

            if(stationListElement) {
                let statusBadge = '';
                let btnIcon = '';
                let btnBg = '';

                if(station.status === 'ok') {
                    statusBadge = '<span class="status-badge status-ok"><i class="fas fa-check-circle"></i> Sorun Yok</span>';
                    btnIcon = 'fa-bullhorn';
                    btnBg = 'var(--primary-color)';
                } else if(station.status === 'error') {
                    statusBadge = '<span class="status-badge status-err"><i class="fas fa-exclamation-circle"></i> Arızalı (Doğrulandı)</span>';
                    btnIcon = 'fa-check-double';
                    btnBg = 'var(--danger-color)';
                } else {
                    statusBadge = `<span class="status-badge status-pending"><i class="fas fa-clock"></i> Doğrulanıyor (${station.verifyCount}/5)</span>`;
                    btnIcon = 'fa-check-double';
                    btnBg = 'var(--warning-color)';
                }

                let act = station.status === 'ok' ? `openReportModal('${station.name}')` : `openVerifyModal('${station.name}')`;

                stationListElement.innerHTML += `
                    <div class="station-card" onclick="focusStation(${station.lat}, ${station.lng})">
                        <div class="card-info">
                            <div class="card-header"><i class="fas fa-subway" style="color:var(--primary-color)"></i> ${station.name}</div>
                            ${statusBadge}
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon-action" style="background:${btnBg}" onclick="event.stopPropagation(); ${act}"><i class="fas ${btnIcon}"></i></button>
                        </div>
                    </div>`;
            }
        });

        if(document.getElementById('result-count')) {
            document.getElementById('result-count').innerText = window.metroStations.length;
        }
    };

    /* ANA HARİTAYI BAŞLAT */
    try {
        const mapElement = document.getElementById('map');
        if (mapElement && !window.mainMap) {
            window.mainMap = L.map('map', { zoomControl: false }).setView([38.4237, 27.1428], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(window.mainMap);
            L.control.zoom({ position: 'bottomright' }).addTo(window.mainMap);

            setTimeout(() => { if(window.mainMap) window.mainMap.invalidateSize(); }, 500);

            const lineCoords = window.metroStations.map(s => [s.lat, s.lng]);
            L.polyline(lineCoords, { color: '#e74c3c', weight: 4, opacity: 0.7 }).addTo(window.mainMap);

            window.renderStations();

            const searchInput = document.getElementById('station-search');
            if (searchInput) {
                searchInput.addEventListener('keyup', function(e) {
                    const term = e.target.value.toLowerCase();
                    const cards = document.querySelectorAll('.station-card');
                    let count = 0;
                    cards.forEach(c => {
                        if(c.querySelector('.card-header').innerText.toLowerCase().includes(term)) { c.style.display = 'flex'; count++; }
                        else { c.style.display = 'none'; }
                    });
                    document.getElementById('result-count').innerText = count;
                });
            }
        }
    } catch(err) {}

    window.focusStation = function(lat, lng) {
        if(window.mainMap) window.mainMap.setView([lat, lng], 16, { animate: true, duration: 1 });
        if(window.innerWidth <= 768) {
            const sb = document.getElementById('sidebar');
            if(sb) sb.classList.add('closed');
        }
    };

    window.selectedZoneName = null; 
    let zoneMarkersGroup = null; 

    window.openReportModal = function(stationName) {
        if(!window.isUserLoggedIn) {
            alert("Durum bildirebilmek için lütfen önce sol üstten giriş yapın.");
            window.handleProfileClick();
            return;
        }
        
        const station = window.metroStations.find(s => s.name === stationName);
        if(!station) return;

        window.currentReportingStation = stationName;
        window.selectedZoneName = null; 
        document.getElementById('modal-station-name').innerText = stationName;
        document.getElementById('reportModal').style.display = 'flex'; 

        setTimeout(() => {
            try {
                if (!window.miniMap && document.getElementById('mini-map')) {
                    window.miniMap = L.map('mini-map', { zoomControl: false });
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(window.miniMap);
                    L.control.zoom({ position: 'bottomright' }).addTo(window.miniMap);
                }
                
                if(window.miniMap) {
                    if(zoneMarkersGroup) window.miniMap.removeLayer(zoneMarkersGroup);
                    zoneMarkersGroup = L.layerGroup().addTo(window.miniMap);
                    
                    window.miniMap.invalidateSize(); 
                    window.miniMap.setView([station.lat, station.lng], 18);

                    if(station.zones && station.zones.length > 0) {
                        station.zones.forEach(zone => {
                            const zLat = station.lat + zone.offset[0];
                            const zLng = station.lng + zone.offset[1];
                            
                            const elIcon = L.divIcon({
                                className: 'elevator-pin',
                                html: '<div class="pin-bg" style="background:var(--primary-color); border:2px solid white; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: 0.3s;"><i class="fas fa-wheelchair" style="color:white; font-size:18px;"></i></div>',
                                iconSize: [36, 36], iconAnchor: [18, 18]
                            });

                            const zMarker = L.marker([zLat, zLng], { icon: elIcon }).addTo(zoneMarkersGroup);
                            
                            zMarker.on('click', () => {
                                window.selectedZoneName = zone.name;
                                document.querySelectorAll('.pin-bg').forEach(el => el.style.background = 'var(--primary-color)');
                                zMarker._icon.querySelector('.pin-bg').style.background = 'var(--success-color)';

                                const infoBox = document.getElementById('selected-zone-info');
                                if(infoBox) {
                                    infoBox.innerHTML = `📍 Seçilen: <strong>${zone.name}</strong>`;
                                    infoBox.classList.add('selected');
                                    infoBox.style.borderColor = "var(--success-color)"; 
                                    infoBox.style.color = "var(--success-color)"; 
                                    infoBox.style.backgroundColor = "#f0fdf4";
                                }
                            });
                        });
                    }
                }
            } catch(err) {}
        }, 300); 

        const infoBox = document.getElementById('selected-zone-info');
        if(infoBox) {
            infoBox.innerText = "Lütfen haritadaki asansör pinlerinden birini seçin 👇";
            infoBox.classList.remove('selected');
            infoBox.style.borderColor = ""; infoBox.style.color = ""; infoBox.style.backgroundColor = "";
        }
    };

    window.openVerifyModal = function(stationName) {
        if(!window.isUserLoggedIn) {
            alert("Doğrulama yapabilmek için lütfen önce giriş yapın.");
            window.handleProfileClick();
            return;
        }
        window.currentVerifyingStation = stationName;
        document.getElementById('verify-station-name').innerText = stationName;
        document.getElementById('verifyModal').style.display = 'flex';
    };

    /* ==========================================
       BİLDİRİM VE DOĞRULAMA FORMLARININ İŞLENMESİ (İSİM VE PUAN KAYITLI)
       ========================================== */
    try {
        const reportForm = document.getElementById('reportForm');
        const fileInput = document.getElementById('file-input');
        
        if(fileInput) {
            fileInput.addEventListener('change', function() {
                const wrapper = document.getElementById('upload-wrapper');
                if(this.files && this.files.length > 0) {
                    document.getElementById('file-label').innerText = "Harika! Fotoğraf Eklendi 📸"; 
                    document.getElementById('file-label').style.color = "var(--success-color)";
                    document.getElementById('upload-icon').style.color = "var(--success-color)";
                    document.getElementById('file-warning').style.display = "none";
                    if(wrapper) {
                        wrapper.style.borderColor = "var(--success-color)";
                        wrapper.style.backgroundColor = "#f0fdf4";
                        wrapper.classList.remove('shake-animation');
                    }
                }
            });
        }

        if(reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                if (!window.selectedZoneName) {
                    alert("⚠️ Lütfen sol taraftaki haritadan arızalı asansörün (mavi pin) üzerine tıklayarak seçiminizi yapın.");
                    const infoBox = document.getElementById('selected-zone-info');
                    if(infoBox) {
                        infoBox.style.borderColor = "var(--danger-color)"; infoBox.style.color = "var(--danger-color)"; infoBox.style.backgroundColor = "#fef2f2";
                        infoBox.classList.remove('shake-animation'); void infoBox.offsetWidth; infoBox.classList.add('shake-animation');
                    }
                    return; 
                }

                if (!fileInput.files || fileInput.files.length === 0) {
                    alert("⚠️ Lütfen arızayı kanıtlayan bir fotoğraf ekleyin (Kamerayı Aç butonuna tıklayın).");
                    const wrapper = document.getElementById('upload-wrapper');
                    const warning = document.getElementById('file-warning');
                    if(warning) { warning.style.color = "var(--danger-color)"; warning.style.display = "block"; }
                    if(wrapper) { wrapper.classList.remove('shake-animation'); void wrapper.offsetWidth; wrapper.classList.add('shake-animation'); }
                    return; 
                } 
                
                alert(`✅ Harika! '${window.selectedZoneName}' için bildirimin topluluğa iletildi ve puan kazandın! 🚀`);
                
                let currentUserName = localStorage.getItem('visi_user_name') || "Yol Arkadaşımız";

                // === VERİTABANI GÜNCELLEMESİ (BİLDİRİM) ===
                if(window.dbUpdateStation) {
                    window.dbUpdateStation(window.currentReportingStation, {
                        status: "pending",
                        verifyCount: 1,
                        lastReporter: currentUserName 
                    });
                }

                // === YENİ: PUAN EKLEME (BİLDİRİM YAPAN KİŞİYE 15 PUAN) ===
                if(window.dbUpdateUserPoints) {
                    window.dbUpdateUserPoints(15, 'report');
                }
                
                window.closeReportModal();
                reportForm.reset();
            });
        }

        const verifyFileInput = document.getElementById('verify-file-input');
        if(verifyFileInput) {
            verifyFileInput.addEventListener('change', function() {
                const wrapper = document.getElementById('verify-upload-wrapper');
                if(this.files && this.files.length > 0) {
                    document.getElementById('verify-file-label').innerText = "Süper! Kanıt Eklendi 📸"; 
                    document.getElementById('verify-file-label').style.color = "var(--success-color)";
                    document.getElementById('verify-upload-icon').style.color = "var(--success-color)";
                    document.getElementById('verify-file-warning').style.display = "none";
                    if(wrapper) {
                        wrapper.style.borderColor = "var(--success-color)";
                        wrapper.style.backgroundColor = "#f0fdf4";
                        wrapper.classList.remove('shake-animation');
                    }
                }
            });
        }

        window.submitVerification = function(isFixed, e) {
            if(e) e.preventDefault();
            
            if (!verifyFileInput || !verifyFileInput.files || verifyFileInput.files.length === 0) {
                alert("⚠️ Lütfen durumu kanıtlayan bir fotoğraf yükleyin.");
                const wrapper = document.getElementById('verify-upload-wrapper');
                const warning = document.getElementById('verify-file-warning');
                if(warning) { warning.style.color = "var(--danger-color)"; warning.style.display = "block"; }
                if(wrapper) { wrapper.classList.remove('shake-animation'); void wrapper.offsetWidth; wrapper.classList.add('shake-animation'); }
                return;
            }

            const stationIndex = window.metroStations.findIndex(s => s.name === window.currentVerifyingStation);
            const station = window.metroStations[stationIndex];
            
            let currentUserName = localStorage.getItem('visi_user_name') || "Yol Arkadaşımız";

            // === VERİTABANI GÜNCELLEMESİ (DOĞRULAMA) ===
            if (isFixed) {
                alert("✅ Harika! Düzeldiğini doğruladın ve +30 Puan kazandın! 🎉");
                if(window.dbUpdateStation) {
                    window.dbUpdateStation(window.currentVerifyingStation, {
                        status: "ok",
                        verifyCount: 0,
                        lastReporter: currentUserName 
                    });
                }
                // === YENİ: PUAN EKLEME (DOĞRULAYAN KİŞİYE 30 PUAN) ===
                if(window.dbUpdateUserPoints) {
                    window.dbUpdateUserPoints(30, 'verify');
                }
            } else {
                alert("✅ Teşekkürler! Arızanın devam ettiğini doğruladın ve +15 Puan kazandın! 🚧");
                if(window.dbUpdateStation) {
                    let newCount = station.verifyCount + 1;
                    let newStatus = newCount >= 5 ? "error" : "pending";
                    window.dbUpdateStation(window.currentVerifyingStation, {
                        status: newStatus,
                        verifyCount: newCount,
                        lastReporter: currentUserName 
                    });
                }
                // === YENİ: PUAN EKLEME (DOĞRULAYAN KİŞİYE 15 PUAN) ===
                if(window.dbUpdateUserPoints) {
                    window.dbUpdateUserPoints(15, 'verify');
                }
            }
            
            window.closeVerifyModal();
            verifyFileInput.value = "";
            document.getElementById('verify-file-label').innerText = "Kanıt Fotoğrafı Çek 📸";
            document.getElementById('verify-file-label').style.color = "var(--secondary-color)";
            document.getElementById('verify-file-warning').style.display = "block";
            document.getElementById('verify-upload-wrapper').style.borderColor = "#cbd5e1";
            document.getElementById('verify-upload-wrapper').style.backgroundColor = "#f8fafc";
        };
    } catch(err) { console.error("Form Hatası:", err); }

});
