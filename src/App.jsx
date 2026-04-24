import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const App = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [input, setInput] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks({
      ...tasks,
      todo: [...tasks.todo, { id: Date.now(), text: input }],
    });
    setInput("");
  };

  // To navigate 
  const moveTask = (task, from, to) => {
    setTasks({
      ...tasks,
      [from]: tasks[from].filter((t) => t.id !== task.id),
      [to]: [...tasks[to], task],
    });
  };

  const deleteTask = (task, from) => {
    setTasks({
      ...tasks,
      [from]: tasks[from].filter((t) => t.id !== task.id),
    });
  };

  const Column = ({ title, dataKey, next, prev }) => (
    <div className="w-full md:w-1/3 p-2">
      <Card className="h-full shadow-lg bg-gray-50/50">
        <CardBody className="p-4">
          <Typography variant="h5" color="blue-gray" className="mb-4 text-center border-b pb-2">
            {title}
          </Typography>

          {tasks[dataKey].map((task) => (
            <Card key={task.id} className="mb-3 p-3 shadow-sm border border-gray-200">
              <div className="flex flex-col gap-3">
                <Typography className="text-gray-800 font-medium">{task.text}</Typography>
                
                <div className="flex justify-between items-center border-t pt-2">
                   {/*to go back arrow*/}
                  <div>
                    {prev && (
                      <Button
                        size="sm"
                        variant="text"
                        color="blue-gray"
                        onClick={() => moveTask(task, dataKey, prev)}
                      >
                        ←
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="text"
                      color="red"
                      onClick={() => deleteTask(task, dataKey)}
                    >
                      ✕
                    </Button>
                    
                    {/* To move forward */}
                    {next && (
                      <Button
                        size="sm"
                        variant="gradient"
                        color="blue"
                        className="px-3"
                        onClick={() => moveTask(task, dataKey, next)}
                      >
                        →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardBody>
      </Card>
    </div>
  );
    return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <Typography variant="h2" color="blue-gray" className="text-center mb-8">
        Task Board
      </Typography>

      <div className="flex justify-center gap-2 mb-10 max-w-md mx-auto">
        <Input
          label="What's your next task?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <Button color="blue" onClick={addTask} className="shrink-0">
          Add Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto">
        <Column title="To Do" dataKey="todo" next="inProgress" />
        <Column title="In Progress" dataKey="inProgress" prev="todo" next="done" />
        <Column title="Done" dataKey="done" prev="inProgress" />
      </div>
    </div>
  );
}
export default App
