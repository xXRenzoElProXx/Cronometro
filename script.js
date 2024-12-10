let timer;
let seconds = 0;
let isRunning = false;
let isPaused = false;
let lapCount = 0;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const clearLapsButton = document.getElementById('clearLaps');
const exportCSVButton = document.getElementById('exportCSV');
const lapsContainer = document.querySelector('.laps');
const lapsControls = document.querySelector('.laps-controls');
const lapsTableBody = document.querySelector('#lapsTable tbody');

function updateDisplay() {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;

    document.title = `${hrs}:${mins}:${secs} - Cronómetro`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
        resetButton.classList.remove('hidden');
        lapButton.classList.remove('hidden');
        timer = setInterval(() => {
            if (!isPaused) {
                seconds++;
                updateDisplay();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Reanudar' : 'Pausar';
    }
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    isRunning = false;
    isPaused = false;
    lapCount = 0;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    resetButton.classList.add('hidden');
    lapButton.classList.add('hidden');
    clearLapsButton.classList.add('hidden');
    exportCSVButton.classList.add('hidden');
    lapsContainer.classList.add('hidden');
    lapsControls.classList.add('hidden');
    lapsTableBody.innerHTML = '';
}

function stopTimer() {
    clearInterval(timer);
    seconds = 0;
    isRunning = false;
    isPaused = false;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    resetButton.classList.add('hidden');
    lapButton.classList.add('hidden');
    clearLapsButton.classList.add('hidden');
    exportCSVButton.classList.add('hidden');
    lapsContainer.classList.add('hidden');
    lapsControls.classList.add('hidden');
    lapsTableBody.innerHTML = '';
}

function addLap() {
    if (isRunning) {
        if (lapsContainer.classList.contains('hidden')) {
            lapsContainer.classList.remove('hidden');
            lapsControls.classList.remove('hidden');
        }

        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        const lapTime = `${hrs}:${mins}:${secs}`;

        const now = new Date();
        const currentTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${++lapCount}</td>
            <td>${lapTime}</td>
            <td>${updateElapsedTime()}</td>
            <td>${currentTime}</td>
        `;
        lapsTableBody.appendChild(row);
    }
}

function updateElapsedTime() {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function clearLaps() {
    lapsTableBody.innerHTML = '';
    lapCount = 0;
    lapsContainer.classList.add('hidden'); 
    lapsControls.classList.add('hidden');
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");
    downloadLink.download = filename;

    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("#lapsTable tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    downloadCSV(csv.join("\n"), filename);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', addLap);
clearLapsButton.addEventListener('click', clearLaps);
exportCSVButton.addEventListener('click', () => exportTableToCSV('vuelta_cronometro.csv'));
