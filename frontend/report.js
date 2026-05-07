const params=new URLSearchParams(window.location.search);
const id=params.get("id");

if(!id || id==="undefined"){
alert("Invalid Report ID");
throw new Error("No ID");
}

fetch("http://localhost:5000/api/history/"+id)
.then(res=>res.json())
.then(data=>{

document.getElementById("fileName").innerText=data.fileName;
document.getElementById("gap").innerText=(data.analysis?.gapPercent || "0")+"%";
document.getElementById("total").innerText=data.analysis?.totalChecked || 0;

const found=document.getElementById("found");
found.innerHTML="";
(data.analysis?.found||[]).forEach(s=>{
const li=document.createElement("li");
li.innerText=s;
found.appendChild(li);
});

const missing=document.getElementById("missing");
missing.innerHTML="";
(data.analysis?.missing||[]).forEach(s=>{
const li=document.createElement("li");
li.innerText=s;
missing.appendChild(li);
});

})
.catch(err=>{
console.log(err);
alert("Report load failed");
});
