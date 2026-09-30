const API_URL = "http://127.0.0.1:5000";


// -----------------------------
// Navigation
// -----------------------------

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    // Refresh data whenever a section is opened
    loadAllData();
}


// -----------------------------
// Load Robots
// -----------------------------

async function loadRobots() {

    const response = await fetch(`${API_URL}/api/robots`);
    const robots = await response.json();

    // Dashboard counts
    document.getElementById("totalRobots").textContent = robots.length;

    const available = robots.filter(
        robot => robot.status === "Available"
    ).length;

    const busy = robots.filter(
        robot => robot.status === "Busy"
    ).length;

    document.getElementById("availableRobots").textContent = available;
    document.getElementById("busyRobots").textContent = busy;


    // Robot table
    const tableBody = document.getElementById("robotTableBody");

    tableBody.innerHTML = "";

    robots.forEach(robot => {

        const row = document.createElement("tr");

        const statusClass = robot.status.toLowerCase();
        
        row.innerHTML = `
        <td>${robot.id}</td>

    <td>
        <span class="status-badge status-${statusClass}">
            ${robot.status}
        </span>
    </td>

    <td>${robot.battery}%</td>

    <td>(${robot.x}, ${robot.y})</td>

    <td>${robot.current_task || "-"}</td>
`;
        tableBody.appendChild(row);
    });
}


// -----------------------------
// Load Tasks
// -----------------------------

async function loadTasks() {

    const response = await fetch(`${API_URL}/api/tasks`);
    const tasks = await response.json();

    // Dashboard counts
    const pending = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completedTasks").textContent = completed;


    // Task table
    const tableBody = document.getElementById("taskTableBody");

    tableBody.innerHTML = "";

    tasks.forEach(task => {

        const row = document.createElement("tr");

        let actionButton = "";

        if (task.status === "Pending") {

            actionButton = `
                <button
                    class="assign-btn"
                    onclick="assignTask('${task.id}')">
                    Assign
                </button>
            `;

        } else {

            actionButton = "-";

        }

        const taskStatusClass = task.status.toLowerCase();

        row.innerHTML = `
    <td>${task.id}</td>

    <td>${task.pickup}</td>

    <td>${task.dropoff}</td>

    <td>
        <span class="status-badge status-${taskStatusClass}">
            ${task.status}
        </span>
    </td>

    <td>${task.stage || "-"}</td>

    <td>${task.robot_id || "-"}</td>

    <td>${actionButton}</td>
`;

        tableBody.appendChild(row);
    });
}


// -----------------------------
// Assign Task
// -----------------------------

async function assignTask(taskId) {

    try {

        const response = await fetch(
            `${API_URL}/api/tasks/${taskId}/assign`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.error);
            return;

        }

        alert(
            `Task ${taskId} assigned to ${result.robot.id}`
        );

        // Refresh dashboard
        loadAllData();

    } catch (error) {

        console.error(error);

        alert("Could not connect to WCS backend.");

    }
}


// -----------------------------
// Load All Data
// -----------------------------

async function loadAllData() {

    try {

        await Promise.all([
            loadRobots(),
            loadTasks(),
            loadMap()
        ]);

    } catch (error) {

        console.error("Backend connection error:", error);

    }
}


// -----------------------------
// Initial Load
// -----------------------------

// -----------------------------
// Load Warehouse Map
// -----------------------------

async function loadMap() {

    const robotsResponse = await fetch(`${API_URL}/api/robots`);
    const stationsResponse = await fetch(`${API_URL}/api/stations`);

    const robots = await robotsResponse.json();
    const stations = await stationsResponse.json();

    const map = document.getElementById("warehouseMap");

    map.innerHTML = "";

    for (let y = 1; y <= 6; y++) {

        for (let x = 1; x <= 10; x++) {

            const cell = document.createElement("div");

            cell.className = "map-cell";

            // Check if a station is here
            const station = stations.find(
                station => station.x === x && station.y === y
            );

            if (station) {
    if (station.type === "pickup") {
        cell.textContent = "📦 P1";
    } else if (station.type === "dropoff") {
        cell.textContent = "📍 D1";
    } else if (station.type === "charging") {
        cell.textContent = "🔋 C1";
    }

    cell.classList.add("station");

            }

            // Check if a robot is here
            const robot = robots.find(
                robot => robot.x === x && robot.y === y
            );

            if (robot) {
                cell.textContent = "🤖";
            }

            map.appendChild(cell);
        }
    }
}

loadAllData();

setInterval(async () => {

    try {

        await fetch(`${API_URL}/api/simulation/tick`, {
            method: "POST"
        });

        await loadAllData();

    } catch (error) {

        console.error("Simulation error:", error);

    }

}, 2000);
