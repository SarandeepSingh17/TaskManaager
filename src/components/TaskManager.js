import React, { useState, useEffect } from 'react';
import './TaskManager.css';

const TaskManager = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
      setTaskData({
        title: '',
        description: '',
        status: 'pending',
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={taskData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Add Task</button>
      </form>
      <div className="task-list">
        {tasks.map((task) => (
          <div className="task" key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-actions">
              <button
                className={`status-btn ${
                  task.status === 'completed' ? 'completed' : ''
                }`}
                onClick={() =>
                  handleStatusUpdate(
                    task._id,
                    task.status === 'completed' ? 'pending' : 'completed'
                  )
                }
              >
                {task.status === 'completed' ? 'Completed' : 'Pending'}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
