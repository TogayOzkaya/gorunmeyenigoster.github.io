/* ==================================================
   GLOBAL FONKSİYONLAR VE KULLANICI YÖNETİMİ
   ================================================== */
window.isUserLoggedIn = localStorage.getItem('visi_logged_in') === 'true';

// Sayfa yüklendiğinde ve giriş yapıldığında kullanıcı arayüzünü günceller
window.updateUserInfo = function() {
    const userNameEl = document.getElementById('sidebar-user-name');
    const userDescEl = document.getElementById('sidebar-user-desc');
    const userImgEl = document.getElementById('sidebar-user-img');
    
    if (window.isUserLoggedIn) {
        if(userNameEl) userNameEl.innerText = "Togay Özkay";
        if(userDescEl) userDescEl.innerText = "Seviye 1";
        if(userImgEl) userImgEl.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    } else {
        if(userNameEl) userNameEl.innerText = "Misafir";
        if(userDescEl) userDescEl.innerText = "Giriş Yap";
        if(userImgEl) userImgEl.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
};

window.toggleSidebar = function() {
    const sb = document.getElementById('sidebar');
    if(sb) sb.classList.toggle('closed');
};

// Profil sekmesine tıklandığında çalışacak kesin kod
window.handleProfileClick = function() {
    if (window.isUserLoggedIn) {
        document.getElementById('profileModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
};

// Modalları güvenli şekilde kapatma
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
    window.isUserLoggedIn = false;
    window.updateUserInfo();
    window.closeModals();
    alert("Hesabınızdan başarıyla çıkış yapıldı.");
};

window.performLogin = function(e) {
    if(e) e.preventDefault();
    const tabSignup = document.getElementById('tab-signup');
    const isSignup = tabSignup && tabSignup.classList.contains('active');
    
    if(isSignup) {
        const terms = document.getElementById('terms-check');
        if(terms && !terms.checked) {
            alert("Devam etmek için güvenlik sözleşmesini kabul etmelisiniz.");
            return;
        }
    }

    localStorage.setItem('visi_logged_in', 'true');
    window.isUserLoggedIn = true;
    window.updateUserInfo();
    window.closeModals();
    alert(isSignup ? "Kayıt Başarılı! Visi topluluğuna hoş geldin. 🚀" : "Giriş Başarılı! Tekrar hoş geldin. 👋");
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

/* ==================================================
   SAYFA YÜKLENDİĞİNDE ÇALIŞACAK ANA SİSTEM
   ================================================== */
window.addEventListener('load', function() {
    
    // Kullanıcı adını ve resmini yükle
    window.updateUserInfo();

    if(window.innerWidth <= 768 && document.getElementById('sidebar')) {
        document.getElementById('sidebar').classList.add('closed');
    }

    /* ==========================================
       İZMİR METROSU NOKTA ATIŞI KOORDİNATLARI (DÜZELTİLDİ)
       ========================================== */
    window.metroStations = [
        { name: "Evka 3", lat: 38.4660, lng: 27.2268, status: "ok" },
        { name: "Ege Üniversitesi", lat: 38.4593, lng: 27.2272, status: "ok" },
        { name: "Bornova", lat: 38.4578, lng: 27.2136, status: "ok" },
        { name: "Bölge", lat: 38.4539, lng: 27.2023, status: "ok" },
        { name: "Sanayi", lat: 38.4468, lng: 27.1895, status: "ok" },
        { name: "Stadyum", lat: 38.4419, lng: 27.1772, status: "error" },
        { name: "Halkapınar", lat: 38.4343, lng: 27.1706, status: "ok" },
        { name: "Hilal", lat: 38.4287, lng: 27.1517, status: "ok" },
        { name: "Basmane", lat: 38.4227, lng: 27.1420, status: "ok" },
        { name: "Çankaya", lat: 38.4235, lng: 27.1352, status: "ok" },
        { name: "Konak", lat: 38.4186, lng: 27.1293, status: "pending" },
        { name: "Üçyol", lat: 38.4109, lng: 27.1172, status: "ok" },
        { name: "İzmirspor", lat: 38.4026, lng: 27.1066, status: "ok" },
        { name: "Hatay", lat: 38.3986, lng: 27.0988, status: "error" },
        { name: "Göztepe", lat: 38.3962, lng: 27.0886, status: "ok" },
        { name: "Poligon", lat: 38.3927, lng: 27.0805, status: "ok" },
        { name: "Fahrettin Altay", lat: 38.3891, lng: 27.0694, status: "ok" },
        { name: "Balçova", lat: 38.3888, lng: 27.0583, status: "ok" },
        { name: "Çağdaş", lat: 38.3881, lng: 27.0478, status: "ok" },
        { name: "Dokuz Eylül Üniversitesi", lat: 38.3867, lng: 27.0360, status: "error" },
        { name: "Güzel Sanatlar", lat: 38.3860, lng: 27.0238, status: "ok" },
        { name: "Narlıdere İtfaiye", lat: 38.3870, lng: 27.0125, status: "ok" },
        { name: "100. Yıl Cumhuriyet Şehitlik", lat: 38.3912, lng: 27.0020, status: "pending" },
        { name: "Kaymakamlık", lat: 38.3950, lng: 26.9914, status: "ok" } // KAYMAKAMLIĞIN TAM KOORDİNATI
    ];

    /* ANA HARİTA KURULUMU */
    try {
        const mapElement = document.getElementById('map');
        if (mapElement && !window.mainMap) {
            
            window.mainMap = L.map('map', { zoomControl: false }).setView([38.4237, 27.1428], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(window.mainMap);
            L.control.zoom({ position: 'bottomright' }).addTo(window.mainMap);

            // Harita boyutunu garantiye al
            setTimeout(() => { if(window.mainMap) window.mainMap.invalidateSize(); }, 500);

            const lineCoords = window.metroStations.map(s => [s.lat, s.lng]);
            L.polyline(lineCoords, { color: '#e74c3c', weight: 4, opacity: 0.7 }).addTo(window.mainMap);

            const getIcon = (status) => {
                let color = status === 'ok' ? '#27ae60' : (status === 'error' ? '#c0392b' : '#f39c12');
                return L.divIcon({
                    className: 'custom-station-icon',
                    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                    iconSize: [18, 18], iconAnchor: [9, 9]
                });
            };

            const stationListElement = document.getElementById('station-list');
            if(document.getElementById('result-count')) document.getElementById('result-count').innerText = window.metroStations.length;

            window.metroStations.forEach(station => {
                const marker = L.marker([station.lat, station.lng], { icon: getIcon(station.status) }).addTo(window.mainMap);
                marker.bindPopup(`<div style="text-align:center; padding: 5px;"><h4 style="margin:0 0 10px 0;">${station.name}</h4><button onclick="openReportModal('${station.name}', ${station.lat}, ${station.lng})" style="background:#1e69de; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">Durum Bildir</button></div>`);

                if(stationListElement) {
                    let statusBadge = station.status === 'ok' ? '<span class="status-badge status-ok"><i class="fas fa-check-circle"></i> Sorun Yok</span>' : (station.status === 'error' ? '<span class="status-badge status-err"><i class="fas fa-exclamation-circle"></i> Arıza Bildirildi</span>' : '<span class="status-badge status-pending"><i class="fas fa-clock"></i> Doğrulanıyor</span>');
                    stationListElement.innerHTML += `
                        <div class="station-card" onclick="focusStation(${station.lat}, ${station.lng})">
                            <div class="card-info">
                                <div class="card-header"><i class="fas fa-subway" style="color:var(--primary-color)"></i> ${station.name}</div>
                                ${statusBadge}
                            </div>
                            <div class="card-actions"><button class="btn-icon-action" onclick="event.stopPropagation(); openReportModal('${station.name}', ${station.lat}, ${station.lng})"><i class="fas fa-bullhorn"></i></button></div>
                        </div>`;
                }
            });

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
    } catch(err) { console.error("Harita Hatası:", err); }

    window.focusStation = function(lat, lng) {
        if(window.mainMap) window.mainMap.setView([lat, lng], 16, { animate: true, duration: 1 });
        if(window.innerWidth <= 768) {
            const sb = document.getElementById('sidebar');
            if(sb) sb.classList.add('closed');
        }
    };

    /* ==========================================
       BİLDİRİM (REPORT) MODALI VE MİNİ HARİTA
       ========================================== */
    window.openReportModal = function(stationName, lat, lng) {
        if(!window.isUserLoggedIn) {
            alert("Durum bildirebilmek için lütfen önce sol üstten giriş yapın.");
            window.handleProfileClick();
            return;
        }
        
        document.getElementById('modal-station-name').innerText = stationName;
        document.getElementById('reportModal').style.display = 'flex'; 

        setTimeout(() => {
            try {
                if (!window.miniMap && document.getElementById('mini-map')) {
                    window.miniMap = L.map('mini-map', { zoomControl: false }).setView([lat || 38.4237, lng || 27.1428], 16);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(window.miniMap);
                    L.control.zoom({ position: 'bottomright' }).addTo(window.miniMap);
                    
                    window.miniMap.on('click', function(e) {
                        if (window.miniMapMarker) window.miniMap.removeLayer(window.miniMapMarker);
                        window.miniMapMarker = L.marker(e.latlng).addTo(window.miniMap);
                        const infoBox = document.getElementById('selected-zone-info');
                        if(infoBox) {
                            infoBox.innerText = "📍 Konum haritadan başarıyla seçildi!";
                            infoBox.style.color = "var(--success-color)";
                            infoBox.style.borderColor = "var(--success-color)";
                            infoBox.style.backgroundColor = "#f0fdf4";
                        }
                    });
                }
                if(window.miniMap) {
                    window.miniMap.invalidateSize(); 
                    if (lat && lng) window.miniMap.setView([lat, lng], 18);
                }
            } catch(err) { console.log("Mini map error", err); }
        }, 300); 

        if (window.miniMapMarker && window.miniMap) { window.miniMap.removeLayer(window.miniMapMarker); window.miniMapMarker = null; }
        const infoBox = document.getElementById('selected-zone-info');
        if(infoBox) {
            infoBox.innerText = "Lütfen sol taraftaki haritadan sorunlu noktayı seçin 📍";
            infoBox.classList.remove('selected');
            infoBox.style.borderColor = ""; infoBox.style.color = ""; infoBox.style.backgroundColor = "";
        }
    };

    /* ==========================================
       FORMLARIN KONTROLÜ (Açık Uyarı Mesajları Eklendi)
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
                
                const locationSelect = document.getElementById('elevator-location');
                if(locationSelect && locationSelect.value === "") {
                    // DİKKAT: Eksiklik varsa artık net bir uyarı verecek
                    alert("⚠️ Lütfen önce asansör tipini veya rampayı seçiniz.");
                    return;
                }

                if (!window.miniMapMarker) {
                    // DİKKAT: Harita seçilmediyse net uyarı
                    alert("⚠️ Lütfen soldaki küçük haritaya tıklayarak arızanın tam konumunu işaretleyin.");
                    const infoBox = document.getElementById('selected-zone-info');
                    if(infoBox) {
                        infoBox.style.borderColor = "var(--danger-color)"; 
                        infoBox.style.color = "var(--danger-color)"; 
                        infoBox.style.backgroundColor = "#fef2f2";
                        infoBox.classList.remove('shake-animation'); void infoBox.offsetWidth; infoBox.classList.add('shake-animation');
                    }
                    return; 
                }

                if (!fileInput.files || fileInput.files.length === 0) {
                    // DİKKAT: Fotoğraf yoksa net uyarı
                    alert("⚠️ Lütfen arızayı kanıtlayan bir fotoğraf ekleyin (Kamerayı Aç butonuna tıklayın).");
                    const wrapper = document.getElementById('upload-wrapper');
                    const warning = document.getElementById('file-warning');
                    if(warning) { warning.style.color = "var(--danger-color)"; warning.style.display = "block"; }
                    if(wrapper) { wrapper.classList.remove('shake-animation'); void wrapper.offsetWidth; wrapper.classList.add('shake-animation'); }
                    return; 
                } 
                
                alert("✅ Harika! Bildirimin başarıyla topluluğa iletildi ve puan kazandın! 🚀");
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
            } else {
                alert(isFixed ? "✅ Harika! Düzeldiğini doğruladın ve +30 Puan kazandın! 🎉" : "✅ Teşekkürler! Arızanın devam ettiğini doğruladın ve +15 Puan kazandın! 🚧");
                window.closeVerifyModal();
            }
        };
    } catch(err) { console.error("Form Hatası:", err); }

});
