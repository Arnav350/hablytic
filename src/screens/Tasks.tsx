import React, { useState } from "react";
import TaskModal from "../components/TaskModal";

interface SubTask {
  id: number;
  text: string;
  completed: boolean;
}

interface Task {
  id: number;
  text: string;
  priority: "low" | "medium" | "high";
  subtasks: SubTask[];
  dueDate: string;
  completed: boolean;
  favorite: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          priority: "medium",
          subtasks: [],
          dueDate: new Date().toISOString().split("T")[0],
          completed: false,
          favorite: false,
        },
      ]);
      setNewTask("");
    }
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleToggleFavorite = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, favorite: !task.favorite } : task)));
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ff4444";
      case "medium":
        return "#ffbb33";
      case "low":
        return "#00C851";
      default:
        return "#61dafb";
    }
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !tasks.find((t) => t.dueDate === dueDate)?.completed;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="tasks-container dark-theme">
      <div className="header-nav">
        <button className="back-button">
          <span>&#8592;</span> Lists
        </button>
        <h1>Tasks</h1>
        <button className="menu-button">&#8942;</button>
      </div>

      <div className="tasks-list">
        {activeTasks.map((task) => (
          <div key={task.id} className="task-item">
            <button
              className="circle-checkbox"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteTask(task.id);
              }}
            >
              <span className="checkbox-inner"></span>
            </button>
            <div className="task-main" onClick={() => setSelectedTask(task)}>
              <span className="task-text">{task.text}</span>
            </div>
            <button
              className={`favorite-button ${task.favorite ? "active" : ""}`}
              onClick={(e) => handleToggleFavorite(task.id, e)}
            >
              &#9733;
            </button>
          </div>
        ))}
      </div>

      <div className="add-task-form">
        <button className="add-button" onClick={handleAddTask}>
          +
        </button>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a Task"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask(e);
            }
          }}
        />
      </div>

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <button className="completed-toggle" onClick={() => setShowCompleted(!showCompleted)}>
            <span className={`toggle-icon ${showCompleted ? "expanded" : ""}`}>&#9660;</span>
            Completed
          </button>

          {showCompleted && (
            <div className="tasks-list completed">
              {completedTasks.map((task) => (
                <div key={task.id} className="task-item completed">
                  <button
                    className="circle-checkbox completed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id);
                    }}
                  >
                    <span className="checkbox-inner completed">✓</span>
                  </button>
                  <div className="task-main" onClick={() => setSelectedTask(task)}>
                    <span className="task-text">{task.text}</span>
                  </div>
                  <button
                    className={`favorite-button ${task.favorite ? "active" : ""}`}
                    onClick={(e) => handleToggleFavorite(task.id, e)}
                  >
                    &#9733;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTask} />}
    </div>
  );
};

export default Tasks;
