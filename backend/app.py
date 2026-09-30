from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Simulated robot fleet
robots = [
    {
        "id": "AMR-01",
        "status": "Available",
        "x": 1,
        "y": 1,
        "battery": 90,
        "current_task": None
    },
    {
        "id": "AMR-02",
        "status": "Available",
        "x": 5,
        "y": 1,
        "battery": 75,
        "current_task": None
    },
    {
        "id": "AMR-03",
        "status": "Charging",
        "x": 9,
        "y": 5,
        "battery": 40,
        "current_task": None
    }
]


# Warehouse stations
stations = [
    {
        "id": "P1",
        "name": "Pickup Station",
        "type": "pickup",
        "x": 2,
        "y": 2
    },
    {
        "id": "D1",
        "name": "Drop-off Station",
        "type": "dropoff",
        "x": 8,
        "y": 2
    },
    {
        "id": "C1",
        "name": "Charging Station",
        "type": "charging",
        "x": 9,
        "y": 5
    }
]


# Task queue
tasks = [
    {
        "id": "T001",
        "pickup": "P1",
        "dropoff": "D1",
        "status": "Pending",
        "robot_id": None,
        "stage": "Waiting"
    },
    {
        "id": "T002",
        "pickup": "P1",
        "dropoff": "D1",
        "status": "Pending",
        "robot_id": None,
        "stage": "Waiting"
    }
]


@app.route("/")
def home():
    return jsonify({
        "message": "WCS Robot Fleet Backend is running"
    })


@app.route("/api/robots", methods=["GET"])
def get_robots():
    return jsonify(robots)


@app.route("/api/stations", methods=["GET"])
def get_stations():
    return jsonify(stations)


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)


# Assign a pending task to an available robot
@app.route("/api/tasks/<task_id>/assign", methods=["POST"])
def assign_task(task_id):

    # Find the task
    task = next(
        (task for task in tasks if task["id"] == task_id),
        None
    )

    if not task:
        return jsonify({
            "error": "Task not found"
        }), 404

    if task["status"] != "Pending":
        return jsonify({
            "error": "Task is not pending"
        }), 400

    # Find an available robot with enough battery
    available_robots = [
        robot for robot in robots
        if robot["status"] == "Available"
        and robot["battery"] >= 20
        ]
    robot = available_robots[0] if available_robots else None

    if not robot:
        return jsonify({
            "error": "No available robot"
        }), 400

    # Assign the task
    task["status"] = "Assigned"
    task["robot_id"] = robot["id"]
    task["stage"] = "To Pickup"

    # Update robot
    robot["status"] = "Busy"
    robot["current_task"] = task["id"]

    return jsonify({
        "message": "Task assigned successfully",
        "task": task,
        "robot": robot
    })

# Move robots one step toward their destination
@app.route("/api/simulation/tick", methods=["POST"])
def simulation_tick():

    for robot in robots:

        if robot["status"] != "Busy":
            continue

        # Find the robot's current task
        task = next(
            (
                task for task in tasks
                if task["id"] == robot["current_task"]
            ),
            None
        )

        if not task:
            continue

        # Find pickup and drop-off stations
        pickup = next(
            station for station in stations
            if station["id"] == task["pickup"]
        )

        dropoff = next(
            station for station in stations
            if station["id"] == task["dropoff"]
        )

        # Decide destination
        if task["stage"] == "To Pickup":
            target = pickup

        elif task["stage"] == "To Drop-off":
            target = dropoff

        else:
            continue

        # Move horizontally
        if robot["x"] < target["x"]:
            robot["x"] += 1

        elif robot["x"] > target["x"]:
            robot["x"] -= 1

        # Move vertically
        elif robot["y"] < target["y"]:
            robot["y"] += 1

        elif robot["y"] > target["y"]:
            robot["y"] -= 1

        # Check if robot reached destination
        if robot["x"] == target["x"] and robot["y"] == target["y"]:

            if task["stage"] == "To Pickup":

                task["stage"] = "To Drop-off"

            elif task["stage"] == "To Drop-off":

                task["stage"] = "Completed"
                task["status"] = "Completed"

                robot["status"] = "Available"
                robot["current_task"] = None

    return jsonify({
        "message": "Simulation step completed",
        "robots": robots,
        "tasks": tasks
    })


if __name__ == "__main__":
    app.run(debug=True)