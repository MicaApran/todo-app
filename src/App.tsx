import { useState, useEffect } from "react";

// Types
interface TitleTask {
  title: string;
}

interface DescTask {
  title: string;
  description: string;
}

interface TaskDisplay {
  id: number;
  title: string;
  description?: string;
}

function App() {
  // for task name input fields
  const [titleInputs, setTitleInputs] = useState<TitleTask[]>(() => {
    const saved = localStorage.getItem("titleInputs");
    return saved ? JSON.parse(saved) : [{ title: "" }];
  });

  const [descInputs, setDescInputs] = useState<DescTask[]>(() => {
    const saved = localStorage.getItem("descInputs");
    return saved ? JSON.parse(saved) : [{ title: "", description: "" }];
  });

  //for task lists
  const [titleTasks, setTitleTasks] = useState<TaskDisplay[]>(() => {
    const saved = localStorage.getItem("titleTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [descTasks, setDescTasks] = useState<TaskDisplay[]>(() => {
    const saved = localStorage.getItem("descTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [showErrors, setShowErrors] = useState(false);

  // task name input fields on typing
  useEffect(() => {
    localStorage.setItem("titleInputs", JSON.stringify(titleInputs));
  }, [titleInputs]);

  useEffect(() => {
    localStorage.setItem("descInputs", JSON.stringify(descInputs));
  }, [descInputs]);

  //for input changes
  const handleTitleChange = (index: number, value: string) => {
    const newInputs = [...titleInputs];
    newInputs[index].title = value;
    setTitleInputs(newInputs);
    setShowErrors(false);
  };

  const handleDescChange = (index: number, field: "title" | "description", value: string) => {
    const newInputs = [...descInputs];
    newInputs[index][field] = value;
    setDescInputs(newInputs);
    setShowErrors(false);
  };

  // add new task name field buttons
  const addTitleField = () => setTitleInputs([...titleInputs, { title: "" }]);
  const addDescField = () => setDescInputs([...descInputs, { title: "", description: "" }]);

  //delete input field before adding
  const deleteTitleField = (index: number) => {
    const newInputs = [...titleInputs];
    newInputs.splice(index, 1);
    setTitleInputs(newInputs.length ? newInputs : [{ title: "" }]);
  };

  const deleteDescField = (index: number) => {
    const newInputs = [...descInputs];
    newInputs.splice(index, 1);
    setDescInputs(newInputs.length ? newInputs : [{ title: "", description: "" }]);
  };

  //single add form button
  const handleAddForm = () => {
    let hasEmptyTitle = titleInputs.some(input => input.title.trim() === "");
    let hasEmptyDesc = descInputs.some(input => input.title.trim() === "" || input.description.trim() === "");

    if (hasEmptyTitle || hasEmptyDesc) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);

    const newTitleTasks = titleInputs.map(input => ({
      id: Date.now() + Math.random(),
      title: input.title.trim(),
    }));

    const newDescTasks = descInputs.map(input => ({
      id: Date.now() + Math.random(),
      title: input.title.trim(),
      description: input.description.trim(),
    }));

    //save tasks to state and localStorage
    setTitleTasks(prev => {
      const updated = [...prev, ...newTitleTasks];
      localStorage.setItem("titleTasks", JSON.stringify(updated));
      return updated;
    });

    setDescTasks(prev => {
      const updated = [...prev, ...newDescTasks];
      localStorage.setItem("descTasks", JSON.stringify(updated));
      return updated;
    });

    // reset input fields
    setTitleInputs([{ title: "" }]);
    setDescInputs([{ title: "", description: "" }]);
  };

  // delete tasks from lists
  const handleDeleteTitleTask = (id: number) => {
    setTitleTasks(prev => {
      const updated = prev.filter(task => task.id !== id);
      localStorage.setItem("titleTasks", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteDescTask = (id: number) => {
    setDescTasks(prev => {
      const updated = prev.filter(task => task.id !== id);
      localStorage.setItem("descTasks", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-poppins">
      <h1 className="text-3xl font-bold mb-10 text-center">TO-DO LIST APPLICATION</h1>
      <div className="flex gap-8">
        {/*Left Container: Add Form*/}
        <div className="flex-1 border border-gray-300 p-6 rounded-lg bg-white shadow">
          {/* TodoList */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">TO-DO LIST</h2>
            {titleInputs.map((input, i) => 
            (
             <div key={i}>
                {/* INPUT TASK NAME */}
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Task Name"
                    className={`border p-2 rounded flex-1 ${
                    showErrors && !input.title ? "border-red-500" : ""}`}
                    value={input.title}
                    onChange={(e) => {handleTitleChange(i, e.target.value);
                    setShowErrors(false);}}/>
                  <button
                    className="h-8 w-8 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition flex items-center justify-center"
                    onClick={() => deleteTitleField(i)}>
                      X
                  </button>
                </div>
                    {/* EMPTY MESSAGE */}
                    {showErrors && !input.title && (
                      <p className="text-red-500 text-xs mb-2">
                        This field is required
                      </p>)}
                </div>
              ))}
                  <button
                    className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center px-3"
                    onClick={addTitleField}>
                      +
                  </button>
                </div>
          {/* TodoList with Description */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">TO-DO LIST WITH DESCRIPTION</h2>
            {descInputs.map((input, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Task title"
                    className={`border p-2 rounded flex-1 ${
                    showErrors && !input.title ? "border-red-500" : ""}`}
                    value={input.title}
                    onChange={(e) => handleDescChange(i, "title", e.target.value)}/>
                  <input
                    type="text"
                    placeholder="Task description"
                    className={`border p-2 rounded flex-1 ${
                    showErrors && !input.description ? "border-red-500" : ""}`}
                    value={input.description}
                    onChange={(e) => handleDescChange(i, "description", e.target.value)}/>
                  <button
                    className="h-8 w-8 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition flex items-center justify-center"
                    onClick={() => deleteDescField(i)}>
                      X
                  </button>
                </div>
                    {showErrors && (!input.title || !input.description) && (
                      <p className="text-red-500 text-xs mb-2">
                        Please fill in all fields
                      </p>
                    )}
                </div>
              ))}
                  <button
                    className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center px-3"
                    onClick={addDescField}>
                     +
                  </button>
                </div>
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded w-full hover:bg-green-600 transition-all duration-200 active:scale-95"
                  onClick={handleAddForm}>
                    Add Form
                </button>
              </div>
          {/* Right Container: Task Lists */}
            <div className="flex-1 border border-gray-300 p-6 rounded-lg bg-white shadow">
              <h2 className="font-bold mb-4">VIEW YOUR TO-DO LIST TASKS</h2>
              {titleTasks.length === 0 ? (
                <p className="text-gray-500 mb-4">No tasks yet</p>
              ) : (
            <ul className="space-y-2 mb-6">
              {titleTasks.map(task => (
                <li key={task.id}
                  className="bg-gray-50 p-3 rounded flex justify-between items-center shadow-sm hover:bg-gray-200 transition-colors duration-200">
                  <span>{task.title}</span>
                  <button
                    className="h-8 w-8 bg-red-100 text-red-600 text-sm rounded hover:bg-red-300 transition flex items-center justify-center"                  
                    onClick={() => handleDeleteTitleTask(task.id)}>
                      x
                  </button>
                </li>
              ))}
            </ul>
          )}
            <h2 className="font-bold mb-4">TO-DO LIST WITH DESCRIPTION TASKS</h2>
            {descTasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet</p>
            ) : (
            <ul className="space-y-2">
              {descTasks.map(task => (
                <li key={task.id}
                  className="bg-gray-50 p-3 rounded flex justify-between items-center shadow-sm hover:bg-gray-200 transition-colors duration-200">
                  <div>
                    <p className="font-bold">{task.title}</p>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <button
                    className="h-8 w-8 bg-red-100 text-red-600 text-sm rounded hover:bg-red-300 transition flex items-center justify-center"                    
                    onClick={() => handleDeleteDescTask(task.id)}>
                      x
                  </button>
                </li>
              ))}
            </ul>)}
        </div>
      </div>
    </div>
  );
}

export default App;
