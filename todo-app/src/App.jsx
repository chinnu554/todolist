import { useContext, useMemo, useState } from "react";
import Task from "../components/Task/Task.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Header from "../components/Header/Header.jsx";
import userContext from "../context/userContext.jsx";

function App() {
  const {
    user,
    tasks,
    message,
    isLoading,
    login,
    register,
    requestRegistrationOtp,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
  } = useContext(userContext);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    email: "",
    otp: "",
  });
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [taskText, setTaskText] = useState("");

  const remainingTasks = useMemo(
    () => tasks.filter((task) => !task.cleared).length,
    [tasks]
  );

  async function handleAuth(event) {
    event.preventDefault();

    if (authMode === "register") {
      if (!isOtpStep) {
        const didSendOtp = await requestRegistrationOtp(authForm.email);
        if (didSendOtp) {
          setIsOtpStep(true);
        }
        return;
      }

      const didRegister = await register(authForm);
      if (didRegister) {
        setAuthMode("login");
        setIsOtpStep(false);
        setAuthForm({ username: "", password: "", email: "", otp: "" });
      }
    } else {
      const didLogin = await login(authForm);
      if (didLogin) {
        setAuthForm({ username: "", password: "", email: "", otp: "" });
      }
    }
  }

  function switchAuthMode() {
    setAuthMode((mode) => (mode === "login" ? "register" : "login"));
    setIsOtpStep(false);
    setAuthForm({ username: "", password: "", email: "", otp: "" });
  }

  async function handleAddTask(event) {
    event.preventDefault();
    const task = taskText.trim();

    if (!task) return;

    const didAdd = await addTask(task);
    if (didAdd) {
      setTaskText("");
    }
  }

  if (!user) {
    return (
      <>
      <main className="app-shell auth-shell">
        <section className="panel auth-panel">
          <p className="eyebrow">Todo List</p>
          <h1>
            {authMode === "login"
              ? "Welcome back"
              : isOtpStep
                ? "Verify OTP"
                : "Create account"}
          </h1>

          <form className="stack" onSubmit={handleAuth}>
            {!isOtpStep ? (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={authForm.username}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, username: event.target.value })
                  }
                />
                {authMode === "register" && (
                  <input
                    type="email"
                    placeholder="Email"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, email: event.target.value })
                    }
                  />
                )}
                <input
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, password: event.target.value })
                  }
                />
              </>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter OTP"
                value={authForm.otp}
                onChange={(event) =>
                  setAuthForm({ ...authForm, otp: event.target.value })
                }
              />
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : authMode === "login"
                  ? "Login"
                  : isOtpStep
                    ? "Verify & Register"
                    : "Send OTP"}
            </button>
          </form>

          {isOtpStep && (
            <button
              className="link-button"
              type="button"
              onClick={() => setIsOtpStep(false)}
            >
              Change registration details
            </button>
          )}

          <button
            className="link-button"
            type="button"
            onClick={switchAuthMode}
          >
            {authMode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>

          {message && <p className="message">{message}</p>}
        </section>
      </main>
      <Footer/>
      </>
    );
  }

  return (
    <>
    <Header />
    <main className="app-shell">
      <section className="panel todo-panel">
        <div className="section-heading">
          <p className="eyebrow">Stay focused</p>
          <h1>Today's tasks</h1>
        </div>

        <form className="add-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add a new task"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            Add
          </button>
        </form>

        <div className="summary">
          <span>{tasks.length} total</span>
          <span>{remainingTasks} left</span>
          <span>{tasks.length - remainingTasks} done</span>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="task-list">
          {isLoading && tasks.length === 0 ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add your first one.</p>
          ) : (
            tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))
          )}
        </div>
      </section>
    </main>
    <Footer/>
    </>
  );
}

export default App;
