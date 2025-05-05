import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Habit {
  id: number;
  name: string;
  completedDates: string[];
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      setHabits([...habits, { id: Date.now(), name: newHabit.trim(), completedDates: [] }]);
      setNewHabit("");
    }
  };

  const handleDeleteHabit = (id: number) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const handleToggleHabit = (id: number) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const completedDates = habit.completedDates.includes(today)
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today];
          return { ...habit, completedDates };
        }
        return habit;
      })
    );
  };

  // Prepare data for the graph
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const chartData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: "Completed Habits",
        data: getLast7Days().map((date) => habits.filter((habit) => habit.completedDates.includes(date)).length),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="habits-container">
      <h1>Habits</h1>

      <form onSubmit={handleAddHabit}>
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
        />
        <button type="submit">Add Habit</button>
      </form>

      <div className="habits-list">
        {habits.map((habit) => (
          <div key={habit.id} className="habit-item">
            <input
              type="checkbox"
              checked={habit.completedDates.includes(new Date().toISOString().split("T")[0])}
              onChange={() => handleToggleHabit(habit.id)}
            />
            <span>{habit.name}</span>
            <button onClick={() => handleDeleteHabit(habit.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="habits-graph">
        <h2>Habit Completion History</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Habits;
