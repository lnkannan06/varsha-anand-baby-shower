(() => {
  const settings = window.INVITATION || {};
  function secureUrl(value) { try { const u = new URL(value); return u.protocol === "https:" ? u : null; } catch { return null; } }
  if (settings.location) document.getElementById("location").textContent = settings.location;
  if (settings.address) document.getElementById("address").textContent = settings.address;
  const registry = secureUrl(settings.registryUrl);
  if (registry) { const a = document.getElementById("registry"); a.href = registry.href; a.hidden = false; }
  const form = secureUrl(settings.formUrl);
  if (form && form.hostname === "docs.google.com" && /^\/forms\/d\/(e\/)?[a-zA-Z0-9_-]+\/viewform$/.test(form.pathname)) {
    document.getElementById("form-link").href = form.href;
    form.searchParams.set("embedded", "true");
    document.getElementById("form").src = form.href;
    document.getElementById("form-wrap").hidden = false;
    document.getElementById("fallback").hidden = false;
    document.getElementById("pending").hidden = true;
  }
  document.getElementById("calendar").addEventListener("click", () => {
    const escapeIcs = value => String(value).replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Varsha Anand Shower//EN","BEGIN:VEVENT","UID:varsha-anand-shower-20261031", "DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""), "DTSTART:20261031T180000Z","DTEND:20261031T220000Z","SUMMARY:Varsha & Anand Baby Shower","DESCRIPTION:Vegetarian brunch celebrating Varsha and Anand and their baby girl.","LOCATION:"+escapeIcs((settings.location||"Varsha & Anand’s home")+". "+(settings.address||"Address shared by hosts")),"END:VEVENT","END:VCALENDAR"].join("\r\n")+"\r\n";
    const url=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"})); const a=document.createElement("a"); a.href=url; a.download="Varsha-Anand-Baby-Shower.ics"; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
})();
