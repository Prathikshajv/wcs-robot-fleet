# WCS Robot Fleet Interface

## Demo Video

[Watch the WCS Robot Fleet Interface Demo](./wcs-demo-video.mp4)

A basic web-based Warehouse Control System (WCS) simulation for managing an AMR robot fleet and warehouse tasks.

## Project Overview

This project simulates a Warehouse Control System that coordinates warehouse tasks and assigns them to available Autonomous Mobile Robots (AMRs).

The system provides a simple control-center interface where users can:

* View the warehouse layout
* Monitor robot status and battery
* Assign warehouse tasks to robots
* Track task progress
* Observe robot movement
* Monitor completed and pending tasks
* Apply basic robot assignment rules

This is a simulation project and does not control real robots.

## What is a WCS?

A Warehouse Control System is an operational software layer used to coordinate and control warehouse automation equipment.

A simplified flow is:

```text
WMS → WCS → Robot Fleet
```

The WMS can manage higher-level warehouse operations such as inventory and orders.

The WCS focuses on executing and coordinating material movement tasks with automation equipment such as AMRs and AGVs.

In this project, the WCS simulation manages:

* Robot availability
* Robot assignment
* Task states
* Robot movement
* Pickup and drop-off stages
* Basic fleet rules

## Features

### 1. Warehouse Map

A simple 10 × 6 warehouse grid displays:

* Pickup station
* Drop-off station
* Charging station
* Robot locations

### 2. Robot Fleet

The system tracks:

* Robot ID
* Robot status
* Battery level
* Position
* Current task

Example robot states:

* Available
* Busy
* Charging

### 3. Task Management

Tasks contain:

* Task ID
* Pickup station
* Drop-off station
* Status
* Current stage
* Assigned robot

Task lifecycle:

```text
Pending → Assigned → To Pickup → To Drop-off → Completed
```

### 4. Live Robot Movement

Robot movement is simulated on the warehouse grid.

The frontend polls the backend every 2 seconds and updates robot positions automatically.

### 5. Task Queue

Pending tasks can be assigned to available robots using the Assign button.

### 6. Basic WCS Rules

The system applies simple assignment rules:

* Only available robots can receive tasks.
* Robot battery must be at least 20%.
* Busy robots cannot receive another task.
* Charging robots are not assigned tasks.

### 7. Dashboard

The dashboard displays:

* Total robots
* Available robots
* Busy robots
* Pending tasks
* Completed tasks
* WCS system status
* Basic WCS rules

## Architecture

```text
+-----------------------------+
|        Web Frontend         |
|      HTML / CSS / JS        |
+-------------+---------------+
              |
              | HTTP REST API
              |
+-------------v---------------+
|        Flask Backend        |
|                             |
|  Robot State                |
|  Task Management            |
|  Assignment Rules           |
|  Simulation Engine          |
+-------------+---------------+
              |
              |
+-------------v---------------+
|      In-Memory State        |
|                             |
|  Robots                     |
|  Stations                   |
|  Tasks                      |
+-----------------------------+
```

## Technology Stack

### Backend

* Python
* Flask
* Flask-CORS

### Frontend

* HTML
* CSS
* JavaScript

### Communication

* REST API
* HTTP polling

### Storage

* In-memory data structures

## API Endpoints

| Method | Endpoint                      | Purpose                  |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/robots`                 | Get robot information    |
| GET    | `/api/stations`               | Get warehouse stations   |
| GET    | `/api/tasks`                  | Get task information     |
| POST   | `/api/tasks/<task_id>/assign` | Assign a task to a robot |
| POST   | `/api/simulation/tick`        | Run one simulation step  |

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Prathikshajv/wcs-robot-fleet.git
cd wcs-robot-fleet
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

Windows PowerShell:

```powershell
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the backend

```bash
cd backend
python app.py
```

The Flask backend runs at:

```text
http://127.0.0.1:5000
```

### 6. Start the frontend

Open the `frontend` folder in VS Code and run `index.html` using VS Code Live Server.

Then open the generated local URL in your browser.

## Example Workflow

1. Open the WCS Dashboard.
2. Open the Task Queue.
3. Assign a pending task.
4. The WCS selects an available robot.
5. The robot moves toward the pickup station.
6. After reaching pickup, the task changes to the drop-off stage.
7. The robot moves toward the drop-off station.
8. The task becomes Completed.
9. The robot becomes Available again.
10. Dashboard statistics update automatically.

## Design Approach

The project was intentionally kept simple and focused on the core responsibilities of a WCS.

Instead of implementing real robot communication, the project uses an in-memory simulation.

The backend maintains the current state of:

* Robots
* Tasks
* Warehouse stations

The assignment logic selects the first available robot that satisfies the basic rules.

Robot movement is simulated one grid step at a time.

The frontend periodically requests updated backend state so that the dashboard, task queue, robot fleet, and map remain synchronized.

## WCS vs WMS

A WMS and WCS have different responsibilities.

### WMS

A Warehouse Management System generally focuses on:

* Inventory
* Orders
* Storage
* Stock movement
* Warehouse business processes

### WCS

A Warehouse Control System focuses more on:

* Executing warehouse movement tasks
* Coordinating automation equipment
* Managing robot activity
* Monitoring equipment status
* Sending work to automation systems

In a larger warehouse architecture, the WMS can generate or request work while the WCS coordinates its execution through automation equipment.

## Limitations

This is a basic simulation and does not include:

* Real robot communication
* Real-time WebSocket communication
* Persistent database storage
* Collision detection
* Advanced path planning
* Multi-floor warehouse support
* Real warehouse hardware integration

## Future Improvements

Possible improvements include:

* WebSocket-based real-time updates
* Database persistence
* A* or other path-planning algorithms
* Collision avoidance
* Automatic task prioritization
* Better battery management
* Automatic charging task generation
* Integration with real robot fleet APIs
* Integration with a WMS
* Authentication and user roles

## Author

Prathiksha J V
