const $ = id => document.getElementById(id);
const store = {
  get(key, fallback){try{return JSON.parse(localStorage.getItem("shield_"+key)) ?? fallback}catch{return fallback}},
  set(key,value){localStorage.setItem("shield_"+key,JSON.stringify(value))}
};
let latestLocation = null;
let journeyEnd = null;

function updateNetwork(){
  const online = navigator.onLine;
  $("networkPill").textContent = online ? "ONLINE" : "OFFLINE";
  $("networkPill").style.color = online ? "#7ee0b0" : "#ffd27a";
}
window.addEventListener("online",updateNetwork);
window.addEventListener("offline",updateNetwork);
updateNetwork();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}

function saveHistory(type,detail){
  const items=store.get("history",[]);
  items.unshift({type,detail,time:new Date().toISOString()});
  store.set("history",items.slice(0,30));
}
function formatCoord(n){return Number(n).toFixed(6)}
function getLocation(){
  return new Promise((resolve,reject)=>{
    if(!("geolocation" in navigator)){reject(new Error("This browser does not support location."));return}
    $("locationStatus").textContent="Requesting device location…";
    navigator.geolocation.getCurrentPosition(pos=>{
      latestLocation={lat:pos.coords.latitude,lon:pos.coords.longitude,accuracy:Math.round(pos.coords.accuracy)};
      $("locationStatus").textContent=`${formatCoord(latestLocation.lat)}, ${formatCoord(latestLocation.lon)} · ±${latestLocation.accuracy} m`;
      saveHistory("Location checked",`Coordinates obtained (accuracy ±${latestLocation.accuracy} m)`);
      resolve(latestLocation);
    },err=>{
      const messages={1:"Location permission denied",2:"Location unavailable",3:"Location request timed out"};
      $("locationStatus").textContent=messages[err.code]||"Could not get location";
      reject(new Error(messages[err.code]||"Could not get location"));
    },{enableHighAccuracy:true,timeout:20000,maximumAge:10000});
  });
}
$("locationButton").addEventListener("click",async()=>{
  try{await getLocation()}catch(e){alert(e.message+". Check device Location settings and browser permission.")}
});

function openDialog(id){$(id).showModal()}
$("sosButton").addEventListener("click",()=>openDialog("sosDialog"));
$("cancelSos").addEventListener("click",()=> $("sosDialog").close());
$("prepareAlert").addEventListener("click",async()=>{
  $("sosResult").textContent="Getting current location…";
  let locationText="Location could not be obtained. Include your location manually if known.";
  try{
    const p=await getLocation();
    const map=`https://maps.google.com/?q=${p.lat},${p.lon}`;
    locationText=`My current location: ${p.lat}, ${p.lon} (accuracy about ${p.accuracy} m). Map: ${map}`;
  }catch(e){locationText=e.message+". GPS may work without internet, but device location must be enabled."}
  const message=`SOS — I need help. ${locationText}`;
  $("sosResult").textContent=message;
  saveHistory("SOS alert prepared","A message draft was prepared. No message was sent.");
  const contacts=store.get("contacts",[]);
  const first=contacts[0];
  if(first){
    const sms=`sms:${encodeURIComponent(first.phone)}?body=${encodeURIComponent(message)}`;
    $("sosResult").innerHTML="";
    const p=document.createElement("p");p.textContent=message;$("sosResult").append(p);
    const a=document.createElement("a");a.className="call-button";a.href=sms;a.textContent=`Open SMS draft for ${first.name}`;$("sosResult").append(a);
  }
  $("sosHint").textContent="Alert prepared. Review and send it yourself; delivery is not confirmed.";
});

$("contactsOpen").addEventListener("click",()=>{renderContacts();openDialog("contactsDialog")});
function renderContacts(){
  const list=$("contactList");list.innerHTML="";
  const contacts=store.get("contacts",[]);
  if(!contacts.length){list.textContent="No trusted contacts saved yet.";return}
  contacts.forEach((c,i)=>{
    const row=document.createElement("div");row.className="list-item";
    const label=document.createElement("span");label.textContent=`${c.name} · ${c.phone}`;
    const del=document.createElement("button");del.textContent="Remove";del.addEventListener("click",()=>{const arr=store.get("contacts",[]);arr.splice(i,1);store.set("contacts",arr);renderContacts()});
    row.append(label,del);list.append(row);
  });
}
$("addContact").addEventListener("click",()=>{
  const name=$("contactName").value.trim(),phone=$("contactPhone").value.trim();
  if(!name||!phone){alert("Enter both a name and phone number.");return}
  if(!/^[+0-9()\-\s]{7,20}$/.test(phone)){alert("Please enter a valid phone number.");return}
  const arr=store.get("contacts",[]);
  if(arr.length>=5){alert("For this prototype, save up to 5 trusted contacts.");return}
  arr.push({name,phone});store.set("contacts",arr);
  $("contactName").value="";$("contactPhone").value="";renderContacts();
});

$("journeyOpen").addEventListener("click",()=>{renderJourney();openDialog("journeyDialog")});
function renderJourney(){
  if(journeyEnd){const remaining=Math.max(0,Math.ceil((journeyEnd-Date.now())/60000));$("journeyStatus").textContent=remaining?`Journey timer active · about ${remaining} minute(s) remaining.`:"Journey timer ended. Please check in with someone you trust.";$("checkIn").disabled=false}
  else{$("journeyStatus").textContent="No active journey.";$("checkIn").disabled=true}
}
$("startJourney").addEventListener("click",()=>{
  const mins=Number($("journeyMinutes").value);journeyEnd=Date.now()+mins*60000;
  store.set("journeyEnd",journeyEnd);saveHistory("Safe Journey started",`${mins}-minute local check-in timer`);
  renderJourney();
});
$("checkIn").addEventListener("click",()=>{
  journeyEnd=null;store.set("journeyEnd",null);saveHistory("Safe check-in","User marked themselves safe.");renderJourney();
});
journeyEnd=store.get("journeyEnd",null);if(journeyEnd && journeyEnd<Date.now())journeyEnd=Date.now();

$("historyOpen").addEventListener("click",()=>{
  const list=$("historyList");list.innerHTML="";
  const items=store.get("history",[]);
  if(!items.length)list.textContent="No local records yet.";
  items.forEach(item=>{
    const row=document.createElement("div");row.className="list-item";
    const span=document.createElement("span");span.textContent=`${item.type}: ${item.detail} · ${new Date(item.time).toLocaleString()}`;
    row.append(span);list.append(row);
  });
  openDialog("historyDialog");
});
$("helpOpen").addEventListener("click",()=>openDialog("helpDialog"));
