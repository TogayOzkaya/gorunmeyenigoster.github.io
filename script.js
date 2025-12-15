// 1. Haritayı Başlat (Konum: İzmir Alsancak civarı)
var map = L.map('map').setView([38.4237, 27.1428], 13);

// 2. Harita Katmanını Ekle (OpenStreetMap kullanıyoruz - Ücretsiz)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. Örnek Bir İşaretçi Ekle (Alsancak İskelesi)
var marker = L.marker([38.4381, 27.1418]).addTo(map);

// İşaretçiye tıklayınca çıkacak baloncuğu ayarla
marker.bindPopup("<b>Alsancak İskelesi</b><br>Erişilebilir Rampa: Var<br>Engelli WC: Var").openPopup();

// 4. Modal (Pop-up) Kontrolü
const modal = document.getElementById('addModal');

// Modalı Açan Fonksiyon
function openModal() {
    modal.style.display = 'flex';
}

// Modalı Kapatan Fonksiyon
function closeModal() {
    modal.style.display = 'none';
}

// Modalın dışına tıklanırsa kapat
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Form gönderildiğinde (Şimdilik sadece uyarı verelim)
document.getElementById('placeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Teşekkürler! Mekan önerisi sisteme kaydedildi (Demo).");
    closeModal();
});
