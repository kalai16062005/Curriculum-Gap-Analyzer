fetch("http://localhost:5000/api/history")
.then(res=>res.json())
.then(data=>{

const table=document.getElementById("historyTable");

data.forEach(r=>{

table.innerHTML+=`
<tr>
<td>${r.fileName}</td>
<td>${r.gapPercent}</td>
<td>${r.totalSkills}</td>
<td>${new Date(r.createdAt).toLocaleDateString()}</td>
<td>
<a href="report.html?id=${r._id}">
View
</a>
</td>
</tr>
`;

});

});
