/* ==================================================
   GLOBAL FONKSİYONLAR VE KULLANICI YÖNETİMİ
   ================================================== */
window.isUserLoggedIn = localStorage.getItem('visi_logged_in') === 'true';

// DİNAMİK İSİM GÜNCELLEME SİSTEMİ
window.updateUserInfo = function() {
    const userNameEl = document.getElementById('sidebar-user-name');
    const userDescEl = document.getElementById('sidebar-user-desc');
    const userImgEl = document.getElementById('sidebar-user-img');
    const modalUserName = document.getElementById('modal-username'); // Profil içindeki başlık
    
    if (window.isUserLoggedIn) {
        // Hafızadan kullanıcının formda yazdığı gerçek adını çek
        const storedName = localStorage.getItem('visi_user_name') || "Kullanıcı";
        
        if(userNameEl) userNameEl.innerText = storedName;
        if(userDescEl) userDescEl.innerText = "Seviye 1";
        if(userImgEl) userImgEl.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        if(modalUserName) modalUserName.innerHTML = `Merhaba, ${storedName}! 👋`;
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
    localStorage.removeItem('visi_user_name'); // Çıkışta ismi de hafızadan sil
    window.isUserLoggedIn = false;
    window.updateUserInfo();
    window.closeModals();
    alert("Hesabınızdan başarıyla çıkış yapıldı.");
};

window.performLogin = function(e) {
    if(e) e.preventDefault();
    
    // Tıklanan buton "Google ile Giriş Yap" butonu mu?
    const isGoogleBtn = e && e.currentTarget && e.currentTarget.classList.contains('btn-google-login');
    const tabSignup = document.getElementById('tab-signup');
    const isSignup = tabSignup && tabSignup.classList.contains('active');
    
    let userName = "Kullanıcı";

    // İSİM ALMA MANTIĞI
    if (isGoogleBtn) {
        // Google butonu için demo isim girişi
        let googleName = prompt("Google üzerinden bağlanılacak ismi girin:", "Ali Yılmaz");
        if (!googleName) return; // İptal ederse durdur
        userName = googleName;
    } else if (isSignup) {
        // Kayıt formundan ismi çek
        const terms = document.getElementById('terms-check');
        if(terms && !terms.checked) {
            alert("Devam etmek için güvenlik sözleşmesini kabul etmelisiniz.");
            return;
        }
        const nameInput = document.querySelector('#form-signup-content input[type="text"]');
        if(nameInput && nameInput.value.trim() !== "") {
            userName = nameInput.value.trim();
        } else {
            alert("Lütfen adınızı ve soyadınızı giriniz.");
            return;
        }
    } else {
        // Giriş formundan sadece mail varsa, mailin başını isim yap
        const savedName = localStorage.getItem('visi_user_name');
        if (savedName) {
            userName = savedName; // Varsa eski ismi kullan
        } else {
            const emailInput = document.querySelector('#form-login-content input[type="email"]');
            if(emailInput && emailInput.value.trim() !== "") {
                let mailStr = emailInput.value.split('@')[0];
                userName = mailStr.charAt(0).toUpperCase() + mailStr.slice(1);
            } else {
                alert("Lütfen e-posta adresinizi giriniz.");
                return;
            }
        }
    }

    // KAYIT: Sisteme ismini kaydet! Artık sabit bir isim yok.
    localStorage.setItem('visi_logged_in', 'true');
    localStorage.setItem('visi_user_name', userName);
    window.isUserLoggedIn = true;
    
    window.updateUserInfo(); // Arayüzü anında yeni isimle yenile
    window.closeModals();
    
    alert(`Sisteme başarıyla giriş yaptın, hoş geldin ${userName}! 🚀`);
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
        if(
