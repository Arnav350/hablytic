import React, { useState } from "react";

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

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setEditedTask({
        ...editedTask,
        subtasks: [
          ...editedTask.subtasks,
          {
            id: Date.now(),
            text: newSubtask.trim(),
            completed: false,
          },
        ],
      });
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: number) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      ),
    });
  };

  const handleDeleteSubtask = (subtaskId: number) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.filter((subtask) => subtask.id !== subtaskId),
    });
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Task Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={editedTask.text}
              onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
              style={{ backgroundColor: getPriorityColor(editedTask.priority) }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            />
          </div>

          <div className="subtasks-section">
            <h3>Subtasks</h3>
            <div className="subtask-form">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a new subtask"
              />
              <button onClick={handleAddSubtask}>Add</button>
            </div>

            <ul className="subtasks-list">
              {editedTask.subtasks.map((subtask) => (
                <li key={subtask.id} className="subtask-item">
                  <input type="checkbox" checked={subtask.completed} onChange={() => handleToggleSubtask(subtask.id)} />
                  <span
                    style={{
                      textDecoration: subtask.completed ? "line-through" : "none",
                    }}
                  >
                    {subtask.text}
                  </span>
                  <button onClick={() => handleDeleteSubtask(subtask.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => onSave(editedTask)}>Save Changes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
