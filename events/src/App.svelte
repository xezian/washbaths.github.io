<script lang="ts">
  import events from './assets/events.json';
  const mapEvents = (eves) => {
    return eves.map(event => {
      const dateIsArray = Array.isArray(event.date);
      const oneDate = (date:string) => {
        const dateObj = new Date(date);
        return dateObj instanceof Date ? `${dateObj.getMonth()+1}/${dateObj.getDate()+1}` : ""
      }
      if (dateIsArray) {
        return {
          ...event,
          dateString: `${oneDate(event.date[0])} through ${oneDate(event.date[1])}`
        }
      } else {
        return {
          ...event,
          dateString: oneDate(event.date as string)
        }
      }
    }).sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate < bDate ? 1 : -1;
    })
  }
  $: eventsRoll = mapEvents(events);
  const removeEvent = (event) => {
    eventsRoll = eventsRoll.filter(e => e !== event);
  }
  const resetEvents = () => {
    eventsRoll = mapEvents(events);
  }
  const addNew = () => {
    const date = new Date();
    eventsRoll = [{
      title: "New Event",
      date: date,
      dateString: `${date.getMonth() + 1}/${date.getDate() + 1}`,
      text: []
    },...eventsRoll]
  }
  const createDatepicker = (event, index, dateIndex?) => {
    if (document.getElementById(`date-${index}`)) return;
    const datepicker = document.createElement("input");
    datepicker.type = "date";
    datepicker.value = eventsRoll[index].date;
    datepicker.id = `date-${index}`;
    datepicker.addEventListener('change', (e) => {
      const newDate = new Date(datepicker.value);
      eventsRoll[index] = {
        ...eventsRoll[index],
        date: newDate,
        dateString: `${newDate.getMonth() + 1}/${newDate.getDate() + 1}`
      }
      datepicker.remove();
      console.log(event.target)
      event.target.style.display = "inherit";
    });
    // hide the text
    const closeButton = createCloseButton(datepicker, event.target);
    const hereGoes = document.createElement("div");
    hereGoes.appendChild(datepicker);
    hereGoes.appendChild(closeButton);
    event.target.style.display = "none";
    event.target.parentNode ? event.target.parentNode.appendChild(hereGoes) : event.target.appendChild(hereGoes);
  }

  const createTitleInput = (event, index) => {
    if (document.getElementById(`title-${index}`)) return;
    const input = document.createElement("input");
    input.type = "text";
    input.id = `title-${index}`;
    input.value = eventsRoll[index].title;
    input.addEventListener('change', (e) => {
      eventsRoll[index] = {
        ...eventsRoll[index],
        title: input.value
      }
      input.remove();
      event.target.style.display = "inherit";
    });
    // hide the text
    event.target.style.display = "none";
    const closeButton = createCloseButton(input, event.target);
    const hereGoes = document.createElement("div");
    hereGoes.appendChild(input);
    hereGoes.appendChild(closeButton);
    event.target.parentNode ? event.target.parentNode.appendChild(hereGoes) : event.target.appendChild(hereGoes);
  }

  const createTextInput = (event, index, textIndex) => {
    if (document.getElementById(`text-input-${index}-${textIndex}`)) return;
    const input = document.createElement("input");
    input.type = "text";
    input.id = `text-input-${index}-${textIndex}`;
    input.value = eventsRoll[index].text[textIndex]
    input.addEventListener('change', (e) => {
      eventsRoll[index] = {
        ...eventsRoll[index],
        text: eventsRoll[index].text.map((t, i) => i === textIndex ? input.value : t)
      }
      input.remove();
      event.target.style.display = "inherit";
    });
    // hide the text
    event.target.style.display = "none";
    const closeButton = createCloseButton(input, event.target);
    const hereGoes = document.createElement("div");
    hereGoes.appendChild(input);
    hereGoes.appendChild(closeButton);
    event.target.parentNode ? event.target.parentNode.appendChild(hereGoes) : event.target.appendChild(hereGoes);
  }

  const createCloseButton = (elementToClose, targetToDisplay) => {
    const button = document.createElement("button");
    button.innerText = "x";
    button.addEventListener('click', (e) => {
      e.preventDefault();
      button.remove();
      elementToClose.remove();
      targetToDisplay.style.display = "inherit";
    });
    return button;
  }

  const addText = (index) => {
    eventsRoll[index] = {
      ...eventsRoll[index],
      text: eventsRoll[index].text ? [...eventsRoll[index].text, "..."] : ["..."]
    };
  }

  /**
   * Outputs the updated events to a JSON file for download
  */
  const outputEventsJson = () => {
    const filteredUp = eventsRoll.map(event => {
      const {dateString, ...rest} = event;
      return rest;
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredUp));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "events.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
</script>

<div class="manage">
  <h1>Manage events here:</h1>
  <button on:click={resetEvents}>reset</button>
  <button on:click={addNew}>add new</button>
  <button on:click={outputEventsJson}>output events JSON</button>
  <div class="events">
    {#each [...eventsRoll] as event, i}
      <div class="controlBox">
        <button on:click={()=>removeEvent(event)} class="close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L15 15" stroke-width="2"/>
            <path d="M15 1L1 15" stroke-width="2"/>
          </svg>
        </button>
        <p>
          <b class="title">
            <span on:keyup={()=>{}} on:click={(e)=>createDatepicker(e,i)}>
              <span>{event.dateString}</span>
            </span> - 
            <span on:keyup={()=> {}} on:click={(e)=>createTitleInput(e,i)}>
              <span>{event.title}</span>
            </span>
          </b>
          {#if event.text}
            <div class="text">
              {#each [...event.text] as text, ti}
              <span id={`text-${i}-${ti}`} on:keyup={()=>{}} on:click={(e)=>createTextInput(e,i,ti)}><span>{text}</span></span>
              {/each}
            </div>
          {/if}
          <button class="add-button" on:click={()=>addText(i)}>
            <!-- plus sign -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15" stroke="black" stroke-width="2"/>
              <path d="M1 8H15" stroke="black" stroke-width="2"/>
            </svg>
          </button>
          <br />
        </p>
      </div>
    {/each}
  </div>
</div>

<style>
  .manage {
    width:100vs; height:100vh; display: grid; place-items:center;
  }
  .manage div.events div.controlBox {
    width: 500px;
    min-height: 100px;
    border: 1px solid black;
    border-radius: 5px;
    margin: 10px;
  }
  .manage div.events div.controlBox button.close {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    width: 20px;
    height: 20px;
    background: #ccc;
    border: none;
    cursor: pointer;
    border-radius: 50%
  }
  .manage div.events div.controlBox button.close:hover {
    background: #333;
  }
  .manage div.events div.controlBox button.close svg path {
    stroke: #333;
  }
  .manage div.events div.controlBox button.close:hover svg path {
    stroke: #ccc;
  }
  .manage div.events div.controlBox p div.text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .manage div.events div.controlBox p b.title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .manage div.events div.controlBox p button.add-button {
    display: grid;
    place-items: center;
  }
</style>
