const loopText = (text) => {
  if (!text || !text.length) return;
  let rtnStr = "";
  text.forEach((one) => {
    rtnStr += `<br/>${one}`;
  });
  return rtnStr;
};

const populateUpcomingEvents = async () => {
  const response = await fetch("/washbaths.github.io/events.json");
  const events = await response.json();
  const place = document.getElementById("upcoming-events");
  if (!place) return;
  events.forEach((event) => {
    const para = document.createElement("p");
    const eventDate = new Date(event.date);
    if (eventDate >= new Date()) {
      para.innerHTML = `
        <b>${eventDate.getMonth() + 1}/${eventDate.getDate() + 1} - ${
        event.title
      }</b>
        ${loopText(event.text) || ""}
        <br/><br/><br/>
      `;
      place.appendChild(para);
    }
  });
};

const populatePastEvents = async () => {
  const response = await fetch("/washbaths.github.io/events.json");
  const events = await response.json();
  const place = document.getElementById("past-events");
  if (!place) return;
  events.forEach((event) => {
    const para = document.createElement("p");
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
      para.innerHTML = `
        <b>${eventDate.getMonth() + 1}/${eventDate.getDate() + 1} - ${
        event.title
      }</b>
        ${loopText(event.text) || ""}
        <br/><br/><br/>
      `;
      place.appendChild(para);
    }
  });
};

populateUpcomingEvents();
populatePastEvents();
