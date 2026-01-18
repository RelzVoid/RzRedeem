function togglePass() {
   let pass = document.getElementById("password");
   pass.type = pass.type === "password" ? "text" : "password";
}
function login() {
   let email = document.getElementById("email").value;
   localStorage.setItem("email", email);
   window.location.href = "dashboard.html";
}
async function redeem() {
   let server = document.getElementById("server").value;
   let android = document.getElementById("android").value;
   let kode = document.getElementById("kode").value;
   if (!server || !android || !kode) { alert("Isi semua!"); return; }

   let notif = document.getElementById("notif");
   notif.innerHTML = "<div class='otw'>OTW REDEEM</div>";
   setTimeout(() => {
      notif.innerHTML = "<div class='proses'>PROSES REDEEM</div>";
      // Kirim data ke backend (simulasi)
      fetch('https://backend-kamu.herokuapp.com/redeem', {
         method: 'POST',
         body: JSON.stringify({server, android, kode, email: localStorage.getItem("email")})
      }).then(res => res.json()).then(data => {
         if (data.success) {
            notif.innerHTML = "<div class='berhasil'>REDEEM CLOUD PHONE BERHASIL KETUA</div>";
         }
      });
   }, 20000);
}