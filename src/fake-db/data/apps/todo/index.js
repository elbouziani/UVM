import mock from "@/fake-db/mock.js"

// Contact
let data = {
  tasks: [
    {
      "id": 10,
      "title": "Refactor Code",
      "desc": "Pie liquorice wafer cotton candy danish. Icing topping jelly-o halvah pastry lollipop.",
      "isImportant": true,
      "isStarred": false,
      "tags": ["doc", "backend"],
      "isCompleted": false,
      "isTrashed": false
    },
    {
      "id": 11,
      "title": "Submit Report",
      "desc": "Donut tart toffee cake cookie gingerbread. Sesame snaps brownie sugar plum candy canes muffin cotton candy.",
      "isImportant": false,
      "isStarred": true,
      "tags": ["frontend", "doc"],
      "isCompleted": false,
      "isTrashed": false
    },
  ],
  taskTags: [
    { id: 5,text: 'Frontend' ,value : 'frontend', color: 'primary' },
    { id: 7,text: 'Backend', value: 'backend', color: 'warning'},
    { id: 8,text: 'Doc', value: 'doc', color: 'success'},
    { id: 11,text: 'Bug', value: 'bug', color: 'danger' },
  ]
}

// POST : Add new Tasks
mock.onPost("/api/apps/todo/tasks/").reply((request) => {

  // Get task from post data
  let task = JSON.parse(request.data).task

  const length = data.tasks.length
  let lastIndex = 0
  if(length){
    lastIndex = data.tasks[length - 1].id
  }
  task.id = lastIndex + 1

  data.tasks.push(task)

  return [201, {id: task.id}]
})

// GET: Fetch Todos
mock.onGet("api/apps/todo/tasks").reply((request) => {

  const filter = request.params.filter

  const filteredTasks = data.tasks.filter((task)=> {

    // If filter == all
    if(filter === "all") return !task.isTrashed

      // If filter == starred
    if(filter === "starred") return !task.isTrashed && task.isStarred

    // If filter == important
    if(filter === "important") return !task.isTrashed && task.isImportant

    // If filter == completed
    if(filter === "completed") return !task.isTrashed && task.isCompleted

    // If filter == trashed
    if(filter === "trashed") return task.isTrashed

    else return task.tags.includes(filter)

  })


  return [200, JSON.parse(JSON.stringify(filteredTasks)).reverse()]
})

// GET: Fetch tags
mock.onGet("api/apps/todo/tags").reply(() => {
  return [200, JSON.parse(JSON.stringify(data.taskTags))]
})

// POST: Update Task
mock.onPost(/\/api\/apps\/todo\/task\/\d+/).reply((request) => {

  const taskId = request.url.substring(request.url.lastIndexOf("/")+1)

  let task = data.tasks.find((task) => task.id == taskId)
  // task.title = JSON.parse(request.data).task.title
  Object.assign(task, JSON.parse(request.data).task)

  return [200, task]
})
