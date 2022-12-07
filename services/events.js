const loopText = (text) => {
  if (!text || !text.length) return;
  let rtnStr = document.createElement("span");
  text.forEach((one) => {
    rtnStr.innerHTML = rtnStr.innerHTML + `<br/>${one}`;
  });
  return rtnStr;
};

const populateUpcomingEvents = async () => {
  const response = await fetch(
    "/washbaths.github.io/events/src/assets/events.json"
  );
  const events = await response.json();
  const place = document.getElementById("upcoming-events");
  if (!place) return;
  events.forEach((event) => {
    const para = document.createElement("p");
    if (Array.isArray(event.date)) {
      const eventDates = [new Date(event.date[0]), new Date(event.date[1])];
      if (eventDates[1] >= new Date()) {
        para.innerHTML = `
          <b>${eventDates[0].getMonth() + 1}/${
          eventDates[0].getDate() + 1
        } through ${eventDates[1].getMonth() + 1}/${
          eventDates[1].getDate() + 1
        } - ${event.title}</b>`;
        if (event.text) para.appendChild(loopText(event.text));
      }
    } else {
      const eventDate = new Date(event.date);
      if (eventDate >= new Date()) {
        para.innerHTML = `
          <b>${eventDate.getMonth() + 1}/${eventDate.getDate() + 1} - ${
          event.title
        }</b>`;
        if (event.text) para.appendChild(loopText(event.text));
      }
    }
    place.appendChild(para);
  });
};

const populatePastEvents = async () => {
  const response = await fetch(
    "/washbaths.github.io/events/src/assets/events.json"
  );
  const events = await response.json();
  const place = document.getElementById("past-events");
  if (!place) return;
  events.forEach((event) => {
    const para = document.createElement("p");
    if (Array.isArray(event.date)) {
      const eventDates = [new Date(event.date[0]), new Date(event.date[1])];
      if (eventDates[1] < new Date()) {
        para.innerHTML = `
          <b>${eventDates[0].getMonth() + 1}/${
          eventDates[0].getDate() + 1
        } through ${eventDates[1].getMonth() + 1}/${
          eventDates[1].getDate() + 1
        } - ${event.title}</b>`;
        if (event.text) para.appendChild(loopText(event.text));
      }
    } else {
      const eventDate = new Date(event.date);
      if (eventDate < new Date()) {
        para.innerHTML = `
          <b>${eventDate.getMonth() + 1}/${eventDate.getDate() + 1} - ${
          event.title
        }</b>`;
        if (event.text) para.appendChild(loopText(event.text));
      }
    }
    place.appendChild(para);
  });
};

populateUpcomingEvents();
populatePastEvents();
