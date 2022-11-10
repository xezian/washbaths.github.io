const OPTIONS_CONFIG = {
  single: {
    url: "https://square.link/u/tRdCZZXK",
    amount: 1,
  },
  double: {
    url: "https://square.link/u/iARaBDl8",
    amount: 2,
  },
  tenPass: {
    url: "/bonus.html",
    amount: 280,
  },
  custom: {
    url: "#",
    amount: 0,
  },
};

const createPayButton = (option) => {
  const seat = document.getElementById("payment-button-area");
  const butt = document.createElement("a");
  butt.setAttribute("class", "pay-button");
  butt.setAttribute("target", "_blank");
  butt.setAttribute("rel", "nooopener noreferrer");
  butt.setAttribute("href", OPTIONS_CONFIG[option].url);
  butt.innerText = `Pay $${OPTIONS_CONFIG[option].amount}.00`;
  seat.replaceChildren(butt);
  seat.style.display = "block";
};

const getCustomLink = () => {
  // implement square link creation here
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("/bonus.html");
    }, 3000);
  });
};

let buttonUpdated = false;

const clickCustom = async (e) => {
  if (buttonUpdated) {
    buttonUpdated = false;
    return;
  }
  e.preventDefault();
  const amount = document.getElementById("custom-amount").value;
  if (amount > 0) {
    const link = await getCustomLink(amount);
    e.target.setAttribute("href", link);
    buttonUpdated = true;
    e.target.click();
  }
};

const updateAmount = (e) => {
  const butt = document.getElementById("payment-button-area").firstChild;
  if (e.target.value >= 1) {
    butt.innerText = `Pay $${e.target.value}`;
    document.getElementById("payment-button-area").style.display = "block";
  } else {
    document.getElementById("payment-button-area").style.display = "none";
  }
};

const createInputField = async () => {
  document.getElementById("custom-amount-area").style.display = "flex";
  document.getElementById("custom-amount-area").style.flexDirection = "column";
  document.getElementById("custom-amount-area").style.alignItems = "center";
  const inputAmount = document.getElementById("custom-amount");
  inputAmount.value = "";
  inputAmount.addEventListener("keyup", updateAmount);
  createPayButton("custom");
  const butt = document.getElementById("payment-button-area").firstChild;
  butt.addEventListener("click", clickCustom);
};

const listenToDropdown = (e) => {
  if (["single", "double", "tenPass"].includes(e.target.value)) {
    document.getElementById("custom-amount-area").style.display = "none";
    createPayButton(e.target.value);
  } else if (e.target.value === "custom") {
    createInputField();
    document.getElementById("payment-button-area").style.display = "none";
  } else if (e.target.value === "none") {
    document.getElementById("custom-amount-area").style.display = "none";
    document.getElementById("payment-button-area").style.display = "none";
  }
};

// setup listeners
document
  .getElementById("top-drop")
  .addEventListener("change", listenToDropdown);
