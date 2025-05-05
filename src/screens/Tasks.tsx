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
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
        },
      ]);
      setNewTask("");
    }
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
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
    <div className="tasks-container">
      <h1>Tasks</h1>
      <form onSubmit={handleAddTask}>
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task" />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-section">
        <h2>Active Tasks</h2>
        <div className="tasks-list">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="task-item"
              style={{
                backgroundColor: `${getPriorityColor(task.priority)}15`,
                borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
              }}
            >
              <div className="task-main" onClick={() => setSelectedTask(task)}>
                <div className="task-header">
                  <span className="task-text">{task.text}</span>
                  {task.dueDate && <span className="due-date">Due: {formatDate(task.dueDate)}</span>}
                </div>
                {task.subtasks.length > 0 && (
                  <div className="subtasks-preview">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="subtask-preview-item">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            setTasks(
                              tasks.map((t) =>
                                t.id === task.id
                                  ? {
                                      ...t,
                                      subtasks: t.subtasks.map((st) =>
                                        st.id === subtask.id ? { ...st, completed: !st.completed } : st
                                      ),
                                    }
                                  : t
                              )
                            );
                          }}
                        />
                        <span style={{ textDecoration: subtask.completed ? "line-through" : "none" }}>
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="complete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteTask(task.id);
                }}
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="tasks-section completed">
          <h2>Completed Tasks</h2>
          <div className="tasks-list">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="task-item completed"
                style={{
                  backgroundColor: `${getPriorityColor(task.priority)}15`,
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                }}
              >
                <div className="task-main" onClick={() => setSelectedTask(task)}>
                  <div className="task-header">
                    <span className="task-text">{task.text}</span>
                    {task.dueDate && <span className="due-date">Due: {formatDate(task.dueDate)}</span>}
                  </div>
                  {task.subtasks.length > 0 && (
                    <div className="subtasks-preview">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="subtask-preview-item">
                          <input type="checkbox" checked={subtask.completed} disabled />
                          <span style={{ textDecoration: subtask.completed ? "line-through" : "none" }}>
                            {subtask.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="complete-button completed"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompleteTask(task.id);
                  }}
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTask} />}
    </div>
  );
};

export default Tasks;
