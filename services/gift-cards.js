const OPTIONS_CONFIG = {
  single: {
    url: 'https://square.link/u/tRdCZZXK',
    amount: 1
  },
  double: {
    url: 'https://square.link/u/iARaBDl8',
    amount: 2,
  },
  tenPass: {
    url: '/bonus.html',
    amount: 280,
  }
}

const createPayButton = (option) => {
  const seat = document.getElementById('payment-button-area');
  const butt = document.createElement('a');
  butt.setAttribute('class', 'pay-button')
  butt.setAttribute('target', '_blank')
  butt.setAttribute('nooopener')
  butt.setAttribute('noreferrer')
  butt.setAttribute('href', OPTIONS_CONFIG[option].url);
  butt.innerText = `Pay $${OPTIONS_CONFIG[option].amount}.00`;
  seat.replaceChildren(butt);
  seat.style.display = 'block';
}


document.getElementById("top-drop").addEventListener("change", (e) => {

  if (['single','double','tenPass'].includes(e.target.value)) {
    createPayButton(e.target.value)
  } else if (e.target.value === 'custom') {

  }

})
