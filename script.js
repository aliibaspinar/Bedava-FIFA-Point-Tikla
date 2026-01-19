const messages = [
  "birazda götten ver bakim gürkan (sesi fulleeeeee)",
  "Bu FIFA Point’i istiyorum",
  "Bu zamana kadar FIFA Point atmadı diye Yiğithan’a söylediklerimden dolayı resmi olarak özür diliyorum.",
  "Şüphesiz Allah (C.C) geciktiriyorsa güzelleştiriyordur.",
  "LoL’de rage quit attığım için özür diliyorum, bir daha yapmayacağım.",
  "Ali benim büyüğümdür.",
  "Ali flame atıyorsa haklıdır.",
  "Bir daha Ali’ye hakaret etmeyeceğime söz veriyorum.",
  "Bir daha Yiğithan ve Merve’nin evliliğini bozmaya çalışmayacağım.",
  "Lütfen FIFA Pointi istiyorsanız sıradaki uyarıda yer alan QR kodu okutunuz. Güle güle kullanın.",
  "QR kodu aşağıdadır, okuttuktan sonra alttaki butona basabilirsiniz.",
  "Şaka şaka… Bu sefer gerçekten kodu okutun.",
  "QR kodu aşağıdadır, okuttuktan sonra alttaki butona basabilirsiniz.",
  " ",
];

let currentIndex = 0;
// Özel indexler
const INDEX_HAKARET = 7; // "Bir daha Ali’ye hakaret..." satırı
const INDEX_YM = 8; // Yiğithan & Merve uyarısı
const INDEX_QR_TEXT = 9; // QR açıklama yazısı
const INDEX_QR_IMAGE = 10; // QR görselinin göründüğü son uyarı
const INDEX_REAL_QR_TEXT = 11; // şaka şaka uyarısı
const INDEX_QR2_IMAGE = 12; // qr2.png
const INDEX_KARIKOCA = 13; // karıkoca.jpeg + final buton
const FINAL_INDEX = INDEX_KARIKOCA;

// 8. uyarıya (INDEX_HAKARET) geldiğinde 12 tıklama kilidi
let confirmClicksOnLocked = 0;
const REQUIRED_CLICKS = 12;

const alertTextEl = document.getElementById("alert-text");
const confirmBtn = document.getElementById("confirm-btn");
const rejectBtn = document.getElementById("reject-btn");
const nextBtn = document.getElementById("next-btn");
const alertBox = document.querySelector(".alert-box");
const alertImage = document.getElementById("alert-image");
const audio = document.getElementById("uefa-audio");
let codeLinkEl = null;

function playMusic(src) {
  if (!audio) return;
  if (src && audio.getAttribute("src") !== src) {
    audio.pause();
    audio.setAttribute("src", src);
    audio.load();
  }
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.catch(() => {
      // Sessiz kalır, kullanıcı tekrar tıklayana kadar denemeyiz
    });
  }
}

function updateUI() {
  alertTextEl.textContent = messages[currentIndex];

  // Varsayılan: sadece Onaylıyorum, normal boyutta, QR gizli
  confirmBtn.style.display = "inline-flex";
  confirmBtn.classList.remove("tiny");
  confirmBtn.textContent = "Onaylıyorum";
  confirmBtn.disabled = false;
  rejectBtn.style.display = "none";
  rejectBtn.style.position = "";
  if (nextBtn) nextBtn.style.display = "none";
  if (codeLinkEl) {
    codeLinkEl.remove();
    codeLinkEl = null;
  }
  if (alertImage) {
    alertImage.style.display = "none";
    alertImage.removeAttribute("src");
    alertImage.alt = "";
  }

  if (currentIndex < INDEX_HAKARET) {
    // Normal uyarılar: sadece Onaylıyorum
    return;
  }

  if (currentIndex === INDEX_HAKARET) {
    // Kilitli uyarı: küçük Onaylıyorum, kaçan Onaylamıyorum
    confirmBtn.classList.add("tiny");
    rejectBtn.style.display = "inline-flex";
    rejectBtn.style.position = "absolute";
    moveRejectButton();
    return;
  }

  if (currentIndex === INDEX_YM || currentIndex === INDEX_QR_TEXT) {
    // Yiğithan & Merve uyarısı ve QR metni: normal Onaylıyorum, başka bir şey yok
    return;
  }

  if (currentIndex === INDEX_QR_IMAGE) {
    // Son uyarı: QR görseli + "Okuttum" butonu, Onaylamıyorum tamamen kaybolur
    confirmBtn.classList.remove("tiny");
    confirmBtn.textContent = "Okuttum";
    rejectBtn.style.display = "none";
    if (alertImage) {
      alertImage.src = "qr.png";
      alertImage.alt = "QR kodu";
      alertImage.style.display = "block";
    }
    return;
  }

  if (currentIndex === INDEX_REAL_QR_TEXT) {
    // Şaka şaka metni: sadece Onaylıyorum
    return;
  }

  if (currentIndex === INDEX_QR2_IMAGE) {
    // qr2.png ekranına gelince sarki.mp4 girsin
    confirmBtn.textContent = "Okuttum";
    if (alertImage) {
      alertImage.src = "qr2.png";
      alertImage.alt = "QR kodu (2)";
      alertImage.style.display = "block";
    }
    playMusic("sarki.mp4");
    return;
  }

  if (currentIndex === INDEX_KARIKOCA) {
    // karıkoca.jpeg final ekranı
    confirmBtn.textContent = "Kocam Yiğithana teşekkür ederim.(Geçme az dinleyelim)";
    confirmBtn.disabled = true;
    if (alertImage) {
      alertImage.src = "karıkoca.jpeg";
      alertImage.alt = "karıkoca";
      alertImage.style.display = "block";
    }

    // Biraz bekledikten sonra gerçek "Geç" butonu gelsin
    if (nextBtn) {
      setTimeout(() => {
        if (currentIndex === INDEX_KARIKOCA) {
          nextBtn.style.display = "inline-flex";
        }
      }, 3000);
    }
  }
}

function moveRejectButton() {
  if (!alertBox || !rejectBtn) return;
  const boxRect = alertBox.getBoundingClientRect();
  const btnRect = rejectBtn.getBoundingClientRect();

  const padding = 10;
  const maxLeft = boxRect.width - btnRect.width - padding;
  const maxTop = boxRect.height - btnRect.height - padding;

  const left = Math.random() * Math.max(maxLeft, 0);
  const top = Math.random() * Math.max(maxTop, 0);

  rejectBtn.style.left = `${left}px`;
  rejectBtn.style.top = `${top}px`;
}

// İlk durum: sadece 1. mesaj, sadece "Onaylıyorum" görünsün
updateUI();

confirmBtn.addEventListener("click", () => {
  // 1. uyarıdan 2. uyarıya geçerken müzik girsin
  if (currentIndex === 0) {
    playMusic("UEFA Şampiyonlar Ligi Müziği.mp4");
  }

  // Kilitli uyarı: 12 kere tıklamadan Yiğithan & Merve uyarısına geçilmesin
  if (currentIndex === INDEX_HAKARET) {
    confirmClicksOnLocked += 1;
    if (confirmClicksOnLocked >= REQUIRED_CLICKS) {
      currentIndex = INDEX_YM;
      updateUI();
    }
    return;
  }

  // Diğer uyarılarda normal sırayla ilerle
  if (currentIndex < FINAL_INDEX) {
    currentIndex += 1;
    updateUI();
  } else {
    // Final ekranda tekrar tıklarsa da aynı ekranda kalsın
    currentIndex = FINAL_INDEX;
  }
});

// Final ekranda gelen "Geç" butonu
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    // Geç'e basınca: kod ekranı + "tıklayınız" linki
    if (audio) audio.pause();
    nextBtn.style.display = "none";

    // Görselleri kapat
    if (alertImage) {
      alertImage.style.display = "none";
      alertImage.removeAttribute("src");
      alertImage.alt = "";
    }

    // Ana butonları gizle
    confirmBtn.style.display = "none";
    rejectBtn.style.display = "none";

    // Metinleri bas
    alertTextEl.textContent = "03V3D-7Y2B7-46311";

    codeLinkEl = document.createElement("div");
    codeLinkEl.className = "fake-link";
    codeLinkEl.textContent = "KOD ÇALIŞMAZSA LÜTFEN BURAYA TIKLAYINIZ";
    codeLinkEl.addEventListener("click", () => {
      window.location.href = "maymun.html";
    });

    alertTextEl.insertAdjacentElement("afterend", codeLinkEl);
  });
}

// "Onaylamıyorum" butonuna basılamasın: üstüne gelince kaçsın
rejectBtn.addEventListener("mouseenter", moveRejectButton);
rejectBtn.addEventListener("mousemove", moveRejectButton);
