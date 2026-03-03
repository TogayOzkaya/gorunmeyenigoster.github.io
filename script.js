/* GLOBAL DEĞİŞKENLER VE FONKSİYONLAR */
window.isUserLoggedIn = localStorage.getItem('visi_logged_in') === 'true';

window.toggleSidebar = function() {
    document.getElementById('sidebar').classList.toggle('closed');
};

window.handleProfileClick = function() {
    if (window.isUserLoggedIn) {
        document.getElementById('profileModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
};

window.closeLoginModal = function() { document.getElementById('loginModal').style.display = 'none'; };
window.closeProfileModal = function() { document.getElementById('profileModal').style.display = 'none'; };
window.closeReportModal = function() { document.getElementById('reportModal').style.display = 'none'; };
window.closeVerifyModal = function() { document.getElementById('verifyModal').style.display = 'none'; };

window.resetData = function() {
    localStorage.setItem('visi_logged_in', 'false');
    window.isUserLoggedIn = false;
    document.getElementById('sidebar-user-name').innerText = "Misafir";
    document.getElementById('sidebar-user-desc').innerText = "Giriş Yap";
    document.getElementById('sidebar-user-img').src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    window.closeProfileModal();
    alert("Hesabınızdan başarıyla çıkış yapıldı.");
};

window.performLogin = function(e) {
    if(e) e.preventDefault();
    const isSignup = document.getElementById('tab-signup').classList.contains('active');
    
    if(isSignup) {
        const terms = document.getElementById('terms-check');
        if(!terms.checked) {
            alert("Devam etmek için güvenlik sözleşmesini kabul etmelisiniz.");
            return;
        }
    }

    localStorage.setItem('visi_logged_in', 'true');
    window.isUserLoggedIn = true;
    
    document.getElementById('sidebar-user-name').innerText = "Togay Özkay";
    document.getElementById('sidebar-user-desc').innerText = "Seviye 1";
    document.getElementById('sidebar-user-img').src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    
    window.closeLoginModal();
    alert(isSignup ? "Kayıt Başarılı! Visi topluluğuna hoş geldin. 🚀" : "Giriş Başarılı! Tekrar hoş geldin. 👋");
};

window.switchAuthTab = function(tab) {
    const loginContent = document.getElementById('form-login-content');
    const signupContent = document.getElementById('form-signup-content');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const googleBtnText = document.getElementById('google-btn-text');

    if(tab === 'login') {
        loginContent.style.display = 'block'; signupContent.style.display = 'none';
        tabLogin.classList.add('active'); tabSignup.classList.remove('active');
        googleBtnText.innerText = "Google ile Giriş Yap";
    } else {
        loginContent.style.display = 'none'; signupContent.style.display = 'block';
        tabSignup.classList.add('active'); tabLogin.classList.remove('active');
        googleBtnText.innerText = "Google ile Kayıt Ol";
    }
};

/* DOM YÜKLENDİĞİNDE ÇALIŞACAK KODLAR */
document.addEventListener('DOMContentLoaded', () => {

    if (window.isUserLoggedIn && document.getElementById('sidebar-user-name')) {
        document.getElementById('sidebar-user-name').innerText = "Togay Özkay";
        document.getElementById('sidebar-user-desc').innerText = "Seviye 1";
        document.getElementById('sidebar-user-img').src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    if(window.innerWidth <= 768 && document.getElementById('sidebar')) {
        document.getElementById('sidebar').classList.add('closed');
    }

    /* GÖZ ANİMASYONLARI */
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

    /* HARİTA VE İSTASYON VERİLERİ (Doğru Koordinatlar) */
    const mapElement = document.getElementById('map');
    let miniMap = null;
    let miniMapMarker = null;

    if (mapElement) {
        const stations = [
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
            { name: "Çağdaş", lat: 38.3892, lng: 27.0494, status: "ok" },
            { name: "Dokuz Eylül Üniversitesi", lat: 38.3881, lng: 27.0371, status: "error" },
            { name: "Güzel Sanatlar", lat: 38.3870, lng: 27.0255, status: "ok" },
            { name: "Narlıdere İtfaiye", lat: 38.3879, lng: 27.0132, status: "ok" },
            { name: "100. Yıl Cumhuriyet Şehitlik", lat: 38.3884, lng: 27.0022, status: "pending" },
            { name: "Kaymakamlık", lat: 38.3886, lng: 26.9934, status: "ok" }
        ];

        const map = L.map('map', { zoomControl: false }).setView([38.4237, 27.1428], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const lineCoords = stations.map(s => [s.lat, s.lng]);
        L.polyline(lineCoords, { color: '#e74c3c', weight: 4, opacity: 0.7 }).addTo(map);

        const getIcon = (status) => {
            let color = status === 'ok' ? '#27ae60' : (status === 'error' ? '#c0392b' : '#f39c12');
            return L.divIcon({
                className: 'custom-station-icon',
                html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                iconSize: [18, 18], iconAnchor: [9, 9]
            });
        };

        const stationListElement = document.getElementById('station-list');
        if(document.getElementById('result-count')) document.getElementById('result-count').innerText = stations.length;

        stations.forEach(station => {
            const marker = L.marker([station.lat, station.lng], { icon: getIcon(station.status) }).addTo(map);
            marker.bindPopup(`<div style="text-align:center; padding: 5px;"><h4 style="margin:0 0 10px 0;">${station.name}</h4><button onclick="openReportModal('${station.name}')" style="background:#1e69de; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">Durum Bildir</button></div>`);

            if(stationListElement) {
                let statusBadge = station.status === 'ok' ? '<span class="status-badge status-ok"><i class="fas fa-check-circle"></i> Sorun Yok</span>' : (station.status === 'error' ? '<span class="status-badge status-err"><i class="fas fa-exclamation-circle"></i> Arıza Bildirildi</span>' : '<span class="status-badge status-pending"><i class="fas fa-clock"></i> Doğrulanıyor</span>');
                stationListElement.innerHTML += `
                    <div class="station-card" onclick="focusStation(${station.lat}, ${station.lng})">
                        <div class="card-info">
                            <div class="card-header"><i class="fas fa-subway" style="color:var(--primary-color)"></i> ${station.name}</div>
                            ${statusBadge}
                        </div>
                        <div class="card-actions"><button class="btn-icon-action" onclick="event.stopPropagation(); openReportModal('${station.name}')"><i class="fas fa-bullhorn"></i></button></div>
                    </div>`;
            }
        });

        window.focusStation = function(lat, lng) {
            map.setView([lat, lng], 16, { animate: true, duration: 1 });
            if(window.innerWidth <= 768) document.getElementById('sidebar').classList.add('closed');
        };

        // BİLDİRİM MODALINI AÇMA VE MİNİ HARİTAYI YÜKLEME
        window.openReportModal = function(stationName) {
            if(!window.isUserLoggedIn) {
                alert("Durum bildirebilmek için lütfen önce giriş yapın.");
                window.handleProfileClick();
                return;
            }
            document.getElementById('modal-station-name').innerText = stationName;
            document.getElementById('reportModal').style.display = 'flex'; 

            const station = stations.find(s => s.name === stationName);

            // Mini Haritayı Güvenli Şekilde Başlat
            setTimeout(() => {
                if (!miniMap && document.getElementById('mini-map')) {
                    miniMap = L.map('mini-map', { zoomControl: false }).setView([38.4237, 27.1428], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(miniMap);
                    L.control.zoom({ position: 'bottomright' }).addTo(miniMap);
                    
                    miniMap.on('click', function(e) {
                        if (miniMapMarker) miniMap.removeLayer(miniMapMarker);
                        miniMapMarker = L.marker(e.latlng).addTo(miniMap);
                        const infoBox = document.getElementById('selected-zone-info');
                        infoBox.innerText = "📍 Konum haritadan başarıyla seçildi!";
                        infoBox.classList.add('selected');
                        infoBox.style.borderColor = ""; infoBox.style.color = ""; infoBox.style.backgroundColor = "";
                    });
                }
                if(miniMap) {
                    miniMap.invalidateSize(); 
                    if (station) miniMap.setView([station.lat, station.lng], 18);
                }
            }, 250);

            // Formu Sıfırla
            if (miniMapMarker && miniMap) { miniMap.removeLayer(miniMapMarker); miniMapMarker = null; }
            const infoBox = document.getElementById('selected-zone-info');
            if(infoBox) {
                infoBox.innerText = "Lütfen sol taraftaki haritadan sorunlu noktayı seçin 📍";
                infoBox.classList.remove('selected');
                infoBox.style.borderColor = ""; infoBox.style.color = ""; infoBox.style.backgroundColor = "";
            }
        };

        // BİLDİRİM GÖNDERME İŞLEMİ
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
                    wrapper.style.borderColor = "var(--success-color)";
                    wrapper.style.backgroundColor = "#f0fdf4";
                    wrapper.classList.remove('shake-animation');
                }
            });
        }

        if(reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                if (!miniMapMarker) {
                    const infoBox = document.getElementById('selected-zone-info');
                    infoBox.innerText = "Lütfen önce haritadan arızalı noktayı seçin! 📍";
                    infoBox.style.borderColor = "var(--danger-color)"; infoBox.style.color = "var(--danger-color)"; infoBox.style.backgroundColor = "#fef2f2";
                    infoBox.classList.remove('shake-animation'); void infoBox.offsetWidth; infoBox.classList.add('shake-animation');
                    return; 
                }

                if (!fileInput.files || fileInput.files.length === 0) {
                    const wrapper = document.getElementById('upload-wrapper');
                    const warning = document.getElementById('file-warning');
                    warning.style.color = "var(--danger-color)"; warning.innerText = "Lütfen durumu kanıtlayan bir fotoğraf ekle! 📸"; warning.style.display = "block";
                    wrapper.classList.remove('shake-animation'); void wrapper.offsetWidth; wrapper.classList.add('shake-animation');
                    return; 
                } 
                
                alert("Harika! Bildirimin başarıyla topluluğa iletildi. 🚀");
                window.closeReportModal();
                reportForm.reset();
            });
        }

        // ARAMA MOTORU
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

    /* DOĞRULAMA (VERIFY) EKRANI FOTOĞRAF KONTROLÜ */
    const verifyFileInput = document.getElementById('verify-file-input');
    if(verifyFileInput) {
        verifyFileInput.addEventListener('change', function() {
            const wrapper = document.getElementById('verify-upload-wrapper');
            if(this.files && this.files.length > 0) {
                document.getElementById('verify-file-label').innerText = "Süper! Kanıt Eklendi 📸"; 
                document.getElementById('verify-file-label').style.color = "var(--success-color)";
                document.getElementById('verify-upload-icon').style.color = "var(--success-color)";
                document.getElementById('verify-file-warning').style.display = "none";
                wrapper.style.borderColor = "var(--success-color)";
                wrapper.style.backgroundColor = "#f0fdf4";
                wrapper.classList.remove('shake-animation');
            }
        });
    }

    window.submitVerification = function(isFixed, e) {
        if(e) e.preventDefault();
        
        if (!verifyFileInput || !verifyFileInput.files || verifyFileInput.files.length === 0) {
            const wrapper = document.getElementById('verify-upload-wrapper');
            const warning = document.getElementById('verify-file-warning');
            warning.style.color = "var(--danger-color)"; warning.innerText = "Lütfen durumu gösteren bir fotoğraf ekle! 📸"; warning.style.display = "block";
            wrapper.classList.remove('shake-animation'); void wrapper.offsetWidth; wrapper.classList.add('shake-animation');
        } else {
            alert(isFixed ? "Harika! Düzeldiğini doğruladın ve +30 Puan kazandın! 🎉" : "Teşekkürler! Arızanın devam ettiğini doğruladın ve +15 Puan kazandın! 🚧");
            window.closeVerifyModal();
        }
    };
});
