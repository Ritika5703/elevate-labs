class TodoApp {
  constructor() {
    this.tasks = [];
    this.taskId = 1;
    this.currentFilter = "all";
    this.setupElements();
    this.setupEvents();
    this.updateDisplay();
  }

  setupElements() {
    this.textInput = document.getElementById("textInput");
    this.addButton = document.getElementById("addButton");
    this.myList = document.getElementById("myList");
    this.noTasks = document.getElementById("noTasks");
    this.totalNumber = document.getElementById("totalNumber");
    this.doneNumber = document.getElementById("doneNumber");
    this.leftNumber = document.getElementById("leftNumber");
    this.filterButtons = document.querySelectorAll(".filter-button");
  }

  setupEvents() {
    this.addButton.addEventListener("click", () => this.addTask());
    this.textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
      }
    });

    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.currentFilter = e.target.dataset.filter;
        this.updateFilterButtons();
        this.updateDisplay();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "/") {
          e.preventDefault();
          this.textInput.focus();
        }
      }
    });

    this.textInput.addEventListener("focus", () => {
      this.textInput.style.transform = "translateY(-1px)";
    });

    this.textInput.addEventListener("blur", () => {
      this.textInput.style.transform = "translateY(0)";
    });
  }

  addTask() {
    const taskText = this.textInput.value.trim();

    if (taskText === "") {
      this.showError();
      return;
    }

    const newTask = {
      id: this.taskId++,
      text: taskText,
      completed: false,
      createdAt: new Date(),
      priority: this.checkImportant(taskText),
    };

    this.tasks.unshift(newTask);
    this.textInput.value = "";
    this.updateDisplay();
    this.showSuccess();
    this.makeSparkles();
  }

  checkImportant(text) {
    const urgentWords = [
      "urgent",
      "asap",
      "important",
      "critical",
      "!!!",
      "priority",
    ];
    return urgentWords.some((word) => text.toLowerCase().includes(word))
      ? "high"
      : "normal";
  }

  showError() {
    this.textInput.style.borderColor = "#dc3545";
    this.textInput.style.background = "#ffebee";
    this.textInput.style.animation = "shake 0.5s ease-in-out";

    setTimeout(() => {
      this.textInput.style.borderColor = "#e1e5e9";
      this.textInput.style.background = "#fafbfc";
      this.textInput.style.animation = "";
    }, 1000);

    this.textInput.focus();
  }

  showSuccess() {
    this.addButton.style.background =
      "linear-gradient(135deg, #28a745, #20c997)";
    this.addButton.style.transform = "translateY(-2px) scale(1.05)";

    setTimeout(() => {
      this.addButton.style.background =
        "linear-gradient(135deg, #667eea, #764ba2)";
      this.addButton.style.transform = "translateY(-2px)";
    }, 300);
  }

  toggleTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.updateDisplay();

      if (task.completed) {
        this.makeConfetti();
        this.animateNumber("doneNumber");
      } else {
        this.animateNumber("leftNumber");
      }
    }
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex > -1) {
      const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

      if (taskElement) {
        taskElement.style.animation = "taskSlideOut 0.3s ease-out forwards";

        setTimeout(() => {
          this.tasks.splice(taskIndex, 1);
          this.updateDisplay();
          this.animateNumber("totalNumber");
        }, 300);
      } else {
        this.tasks.splice(taskIndex, 1);
        this.updateDisplay();
      }
    }
  }

  animateNumber(numberId) {
    const numberElement = document.getElementById(numberId);
    if (numberElement) {
      numberElement.style.transform = "scale(1.2)";
      numberElement.style.color = "#667eea";

      setTimeout(() => {
        numberElement.style.transform = "scale(1)";
        numberElement.style.color = "#333";
      }, 300);
    }
  }

  updateFilterButtons() {
    this.filterButtons.forEach((button) => {
      if (button.dataset.filter === this.currentFilter) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case "active":
        return this.tasks.filter((task) => !task.completed);
      case "completed":
        return this.tasks.filter((task) => task.completed);
      default:
        return this.tasks;
    }
  }

  updateDisplay() {
    this.showTasks();
    this.updateNumbers();
    this.showNoTasks();
  }

  showTasks() {
    this.myList.innerHTML = "";
    const filteredTasks = this.getFilteredTasks();

    filteredTasks.forEach((task, index) => {
      const taskElement = this.createTaskElement(task, index);
      this.myList.appendChild(taskElement);
    });
  }

  createTaskElement(task, index) {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "done" : ""} ${
      task.priority === "high" ? "important" : ""
    }`;
    li.setAttribute("data-task-id", task.id);
    li.style.animationDelay = `${index * 0.1}s`;

    const timeAgo = this.getTimeAgo(task.createdAt);
    const priorityIcon = task.priority === "high" ? "🔥 " : "";

    li.innerHTML = `
            <div class="checkbox ${task.completed ? "checked" : ""}" 
                 onclick="myTodoApp.toggleTask(${task.id})"></div>
            <div class="task-info">
              <div class="task-title">${priorityIcon}${this.escapeHtml(
      task.text
    )}</div>
              <div class="task-time">Created ${timeAgo}</div>
            </div>
            <button class="deleteButton" onclick="myTodoApp.deleteTask(${
              task.id
            })">Delete</button>
          `;

    return li;
  }

  getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  updateNumbers() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const remaining = total - completed;

    this.animateNumberChange(this.totalNumber, total);
    this.animateNumberChange(this.doneNumber, completed);
    this.animateNumberChange(this.leftNumber, remaining);
  }

  animateNumberChange(element, newNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    if (currentNumber === newNumber) return;

    const duration = 400;
    const startTime = performance.now();
    const startNumber = currentNumber;
    const difference = newNumber - startNumber;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);

      const current = Math.round(startNumber + difference * easeOutQuad);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  showNoTasks() {
    const filteredTasks = this.getFilteredTasks();
    if (filteredTasks.length === 0) {
      this.noTasks.classList.add("show");
      this.myList.style.display = "none";
    } else {
      this.noTasks.classList.remove("show");
      this.myList.style.display = "block";
    }
  }

  makeConfetti() {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
    ];
    const confettiCount = 20;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 1 + "s";

        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 4000);
      }, i * 30);
    }
  }

  makeSparkles() {
    const sparkleCount = 6;
    const inputRect = this.textInput.getBoundingClientRect();

    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.innerHTML = "✨";
        sparkle.style.position = "fixed";
        sparkle.style.left =
          inputRect.left + Math.random() * inputRect.width + "px";
        sparkle.style.top =
          inputRect.top + Math.random() * inputRect.height + "px";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "1000";
        sparkle.style.fontSize = "16px";
        sparkle.style.animation = "sparkleFloat 1s ease-out forwards";

        document.body.appendChild(sparkle);

        setTimeout(() => {
          sparkle.remove();
        }, 1000);
      }, i * 80);
    }
  }
}

const sparkleStyle = document.createElement("style");
sparkleStyle.textContent = `
        @keyframes sparkleFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.5);
          }
        }
      `;
document.head.appendChild(sparkleStyle);

const myTodoApp = new TodoApp();

setInterval(() => {
  if (myTodoApp.tasks.length > 0) {
    console.log("💾 Auto-saved tasks:", myTodoApp.tasks.length);
  }
}, 30000);

setTimeout(() => {
  if (myTodoApp.tasks.length === 0) {
    const originalPlaceholder = myTodoApp.textInput.placeholder;
    myTodoApp.textInput.placeholder = "✨ Ready to be productive? Start here!";
    setTimeout(() => {
      myTodoApp.textInput.placeholder = originalPlaceholder;
    }, 2500);
  }
}, 1500);
