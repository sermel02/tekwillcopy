// ----------------- SignUp ----------------- //
const signinBtns = document.querySelectorAll('.signinBtn');
const signinModal = document.getElementById('signin-modal');
const signinModalClose = document.getElementById('signin-modal-close');
const signinModalEmail = document.getElementById('signin-modal-email');
const signinModalPassword = document.getElementById('signin-modal-password');
const signinModalForm = document.getElementById('signin-modal-form');

if (signinBtns) {
	signinBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			if (signinModal) {
				signinModal.classList.add('open');
				document.body.style.overflow = 'hidden';
			}
		})
	})
}

if (signinModalClose) {
	signinModalClose.addEventListener('click', () => {
		if (signinModal) {
			signinModal.classList.remove('open');
			document.body.style.overflowY = 'scroll';
		}
	})
}

if (signinModalForm) {
	signinModalForm.addEventListener('submit', function (e) {
		e.preventDefault();
		const email = signinModalEmail.value;
		const password = signinModalPassword.value;

		fetch('http://localhost:3000/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
			.then(res => {
				if (res.status === 401) {
					return res.json().then(error => {
						alert(error.message);
					});
				} else if (res.status === 200) {
					window.location.href = 'http://localhost:3000/profile'
				}
			})
	});
}

// ----------------- Register ----------------- //
const registerBtns = document.querySelectorAll('.registerBtn');
const registerModal = document.getElementById('register-modal');
const registerModalClose = document.getElementById('register-modal-close');
const registerModalEmail = document.getElementById('register-modal-email');
const registerModalPassword = document.getElementById('register-modal-password');
const registerModalForm = document.getElementById('register-modal-form');

if (registerBtns) {
	registerBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			if (registerModal) {
				registerModal.classList.add('open');
				document.body.style.overflow = 'hidden';
			}
		})
	})
}

if (registerModalClose) {
	registerModalClose.addEventListener('click', () => {
		if (registerModal) {
			registerModal.classList.remove('open');
			document.body.style.overflowY = 'scroll';
		}
	})
}

if (registerModalForm) {
	registerModalForm.addEventListener('submit', function (e) {
		e.preventDefault();
		const email = registerModalEmail.value;
		const password = registerModalPassword.value;

		fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
			.then(res => {
				if (res.status === 401) {
					return res.json().then(error => {
						alert(error.message);
					});
				} else if (res.status === 200) {
					window.location.href = 'http://localhost:3000/profile'
				}
			})
	});
}



// ----------------- TODO ----------------- //
const tasksWrapper = document.getElementById('tasksWrapper');
const inputTask = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskDoneBtns = document.querySelectorAll('.taskDoneBtn');

const tasks = [];
const emptyTaskWrapperHtml = `
<div class="todo__wrapper-empty" id="tasksWrapper">
	TODO List is empty...
</div>
`

addTaskBtn.addEventListener('click', () => {
	let newTask = {
		id: Date.now(),
		content: inputTask.value,
		isDone: false,
	}

	inputTask.value = ''
	tasks.push(newTask)

	tasksWrapper.innerHTML += `
				<div class="todo__task task" id="${newTask.id}">
				<div class="task__text">${newTask.content}</div>
				<div class="task__action">
					<button class="taskDoneBtn" onclick="taskDone(this)">
						<span class="material-symbols-outlined">done</span>
					</button>
					<button class="taskNotDoneBtn" onclick="taskNotDone(this)">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>
			</div>
				`

	renderWrapper()

})



function renderWrapper() {

	if (tasks.length < 1) {
		tasksWrapper.innerHTML = emptyTaskWrapperHtml
	} else if (tasks.length >= 1) {
		tasksWrapper.innerHTML = ``
		tasks.forEach(task => {
			tasksWrapper.innerHTML += `
			<div class="todo__task task" id="${task.id}">
			<div class="task__text">${task.content}</div>
			<div class="task__action">
				<button class="taskDoneBtn" onclick="taskDone(this)">
					<span class="material-symbols-outlined">done</span>
				</button>
				<button class="taskNotDoneBtn" onclick="taskNotDone(this)">
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>
		</div>
			`
		})
	}
}

function taskDone(button) {
	let taskHtml = (button.parentNode).parentNode;
	let taskId = taskHtml.getAttribute("id");

	tasks.forEach(task => {
		if (task.id == taskId) {
			task.isDone = true
			let taskIndex = tasks.indexOf(task);
			tasks.splice(taskIndex, 1);
			taskHtml.remove();
			renderWrapper();
		}
	})
}

function taskNotDone(button) {
	console.log("Not Done");
}

renderWrapper()

