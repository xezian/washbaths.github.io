
const gcm = {
  loaded: false,
  modal: null,
};


async function openModal () {
  const position = document.documentElement.scrollTop;
  document.body.style.top =  "-" + position + "px";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.overflowY = "scroll";
  if (!gcm.loaded) {
    loadGCM();
  }
  gcm.modal.style.height = "100vh";
  gcm.modal.style.opacity = 1;
  closeButton = document.getElementById("closeGiftCardModal")
  closeButton.addEventListener("click", () => {
    document.body.style.position = "static";
    document.body.style.overflow = "auto"
    gcm.modal.style.opacity = 0;
    document.documentElement.scrollTop = position;
    setTimeout(()=>{
      gcm.modal.style.height = 0;
    }, 231);
  })
}

async function loadGCM () {
  gcm.modal = document.getElementById("gift-card-modal");
  gcm.modal.innerHTML = await (await fetch("gift-card-modal.html")).text();
  await (await fetch("https://sandbox.web.squarecdn.com/v1/square.js")).text().then(txt => {
    var script = document.createElement("script");
    script.innerHTML = txt;
    document.body.appendChild(script);
  });
  await (await fetch("gift-card-modal.js")).text().then(txt => {
    var script = document.createElement("script");
    script.innerHTML = txt;
    document.body.appendChild(script);
  });
  gcm.loaded = true;
}

loadGCM();

document.getElementById("gift-card-modal-button").addEventListener("click", openModal);
