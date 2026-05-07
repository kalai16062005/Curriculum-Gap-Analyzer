let myChart = null;

// Tab Switching Logic
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    
    // Event handling for button highlight
    if (window.event && window.event.currentTarget && window.event.currentTarget.classList.contains('nav-btn')) {
        window.event.currentTarget.classList.add('active');
    }
    
    // Chart resize for visual tab
    if(tabId === 'visuals' && myChart) {
        setTimeout(() => myChart.resize(), 100);
    }
}

// Main Upload & Comparison Logic
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfInput');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');

    if (fileInput.files.length === 0) return alert("Please select a Syllabus PDF first!");

    const formData = new FormData();
    formData.append("syllabus", fileInput.files[0]);

    // UI Reset & Loading State
    loading.classList.remove('hidden');
    loading.innerText = "Deep Analysis in Progress... ⚡";
    resultSection.classList.add('hidden');

    try {
        const response = await fetch("http://127.0.0.1:5000/api/syllabus/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.summary) {
            
            document.getElementById('matchedCount').innerText = data.summary.matched || 0;
            document.getElementById('gapPercent').innerText = data.summary.curriculumGap || "100%"; 
            document.getElementById('totalSkills').innerText = data.summary.totalSkillsChecked || 18104;

            
            const score = parseFloat(data.summary.matchedPercentage || 0);
            const progressBar = document.getElementById('readinessProgressBar');
            
            if (progressBar) {
                progressBar.style.width = Math.max(score, 5) + "%";
                progressBar.innerText = score.toFixed(2) + "% Readiness";
                
                if (score < 10) {
                    progressBar.style.backgroundColor = "#ef4444"; // Red
                } else if (score < 50) {
                    progressBar.style.backgroundColor = "#f59e0b"; // Orange
                } else {
                    progressBar.style.backgroundColor = "#22c55e"; // Green
                }
                progressBar.style.color = "white";
            }

            
            const domainStats = { 
                "Cloud & Infra": data.domainStats?.cloud || 0,
                "Data & AI": data.domainStats?.ai || 0,
                "Software Engg": data.domainStats?.software || 0,
                "Cyber Security": data.domainStats?.cyber || 0
            };

            
            renderLineTrendChart(domainStats);
            

            renderTable('matchedTableBody', data.foundSkillsList || [], 'PRESENT', 'bg-success');
            renderTable('missingTableBody', data.missingSkillsList || [], 'GAP', 'bg-danger');

           
            prepareProfessionalReport(data, score, domainStats);

            
            resultSection.classList.remove('hidden');
            showTab('overview');
        } else {
            alert("Analysis failed: " + (data.error || "Unknown server error"));
        }
    } catch (e) { 
        console.error("Critical Connection Error:", e);
        alert("Cannot connect to Backend Server. Please ensure the Node.js server is running on port 5000.");
    } finally { 
        loading.classList.add('hidden'); 
    }
});


function renderLineTrendChart(stats) {
    const canvas = document.getElementById('readinessChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (myChart) myChart.destroy();
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: 'Identified Skill Gaps',
                data: Object.values(stats),
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderColor: '#4f46e5',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#4f46e5',
                pointRadius: 6
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Gaps' }
                }
            }
        }
    });
}


function renderTable(id, list, status, badge) {
    const tbody = document.getElementById(id);
    if (!tbody) return;
    
    if (list.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3' class='text-center'>No items found in this category</td></tr>";
        return;
    }
    
   
    const itemsToShow = list.slice(0, 100); 
    tbody.innerHTML = itemsToShow.map((skill, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="text-uppercase fw-bold" style="font-size: 0.85rem;">${skill}</td>
            <td><span class="badge ${badge}">${status}</span></td>
        </tr>
    `).join('');
}


function prepareProfessionalReport(data, score, domainStats) {
    const btn = document.getElementById('downloadProposalBtn');
    if (!btn) return;

    btn.onclick = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
      
        doc.setFillColor(31, 41, 55); 
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("CURRICULUM STRATEGIC AUDIT", 105, 25, { align: "center" });

        
        doc.setTextColor(40);
        doc.setFontSize(12);
        doc.text(`Institutional Readiness: ${score.toFixed(2)}%`, 20, 55);
        doc.text(`Target Syllabus: ${data.fileName || 'Uploaded_Document.pdf'}`, 20, 63);
        doc.text(`Total Skills Audited: ${data.summary.totalSkillsChecked || 18104}`, 20, 71);

        
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text("Domain-wise Gap Summary", 20, 90);
        
        doc.setTextColor(40);
        doc.setFontSize(11);
        let yPos = 105;
        Object.entries(domainStats).forEach(([name, count]) => {
            doc.text(`${name}: ${count} Missing Industry Skills`, 25, yPos);
            yPos += 10;
        });

        
        doc.setFontSize(14);
        doc.text("Strategic Recommendation:", 20, yPos + 10);
        doc.setFontSize(10);
        doc.text("Immediate integration of missing domain skills is required to meet industry standards.", 20, yPos + 20);

        doc.save("Strategic_Curriculum_Audit.pdf");
    };
}