
const gcmButton = document.getElementById("gift-card-modal-button");


async function openModal () {
  const gcm = document.getElementById("gift-card-modal");
  const position = document.documentElement.scrollTop;
  document.body.style.top =  "-" + position + "px";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.overflowY = "scroll"
  gcm.style.display = "grid";
  gcm.innerHTML = await (await fetch("gift-card-modal.html")).text();
  gcm.addEventListener("click", () => {
    document.body.style.position = "static";
    document.body.style.overflow = "auto"
    document.documentElement.scrollTop = position;
    gcm.style.display = "none";
  })
}

gcmButton.addEventListener("click", openModal)
