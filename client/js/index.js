const modalBtns = document.querySelectorAll('.modalBtn');
const modalClose = document.querySelectorAll('.closebtn')

if (modalBtns) {
	modalBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			var modal = document.getElementById('my-modal');
			if (modal) {
				modal.classList.add('open');
				document.body.style.overflow = 'hidden';
			}
		})
	})
}


if (modalClose) {
	modalClose.forEach(btn => {
		btn.addEventListener('click', () => {
			var modal = document.getElementById('my-modal');

			if (modal) {
				modal.classList.remove('open');
				document.body.style.overflowY = 'scroll';
			}
		})
	})
}

// ----------------- SignUp ----------------- //
document.querySelector('.modal__form').addEventListener('submit', function (e) {
	e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы)
	const email = document.querySelector('input[name="email"]').value;
	const password = document.querySelector('input[name="password"]').value;

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
			} else if(res.status === 200) {
				window.location.href = 'http://localhost:3000/profile'
			}
		})
});

// Предполагается, что у вас есть форма с id "signupForm"
// const form = document.querySelector('.modal__form');
// form.addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const formData = new FormData(form);

//   try {
//     const response = await fetch('/signup', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       // Предполагается, что у вас есть функция для отображения предупреждения
//       alert(errorData.message);
//     } else {
//       // Перенаправление или обработка успешного сценария по мере необходимости
//       window.location.href = '/profile';
//     }
//   } catch (error) {
//     console.error('Произошла ошибка:', error);
//     // Обработка других ошибок при необходимости
//   }
// });


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

