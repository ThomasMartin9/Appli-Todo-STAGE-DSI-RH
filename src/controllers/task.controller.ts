import { getTaskJson, stringToTask, type Task } from '../models/task.model'

export function createTask
(
    title: string,
    description: string,
    dueDate: string
) : number
{
    let lastId: number = parseInt(localStorage.getItem("last-id") || "-1") + 1
    localStorage.setItem("last-id", lastId.toString())
    
    let task: Task = {
        id: lastId,
        title: title, 
        description: description, 
        dueDate: dueDate,
        completedAt: null
    };

    const taskJson = getTaskJson(task)
    localStorage.setItem(`task-${task.id}`, JSON.stringify(taskJson))

    window.location.reload()

    return task.id
}

export function deleteTask(task: Task)
{
    localStorage.removeItem(`task-${task.id}`)
    window.location.reload()
}

export function deleteAlltasks()
{
    const tasks = getAllTasks()

    for (const task of tasks)
        localStorage.removeItem(`task-${task.id}`)

    window.location.reload()
}

export function endTask(task: Task)
{
    task.completedAt = new Date(Date.now()).toLocaleDateString("fr-CA")
    const taskJson = getTaskJson(task)
    localStorage.setItem(`task-${task.id}`, JSON.stringify(taskJson))

    window.location.reload()
}

// get task by id
export function getTask(id: number) : Task
{
    const task = localStorage.getItem(`task-${id}`)
    if (!task) return stringToTask("")
    return JSON.parse(task) as Task
}
// get task by title
export function getTaskByTitle(title: string) : Array<Task>
{
    let tasks = new Array<Task>
    for (let i = 0; i <= parseInt(localStorage.getItem('last-id') || "1"); i++)
    {
        const raw = localStorage.getItem(`task-${i}`)
        if (!raw) continue
        const task: Task = JSON.parse(raw)
        if (task.title == title)
            tasks.push(task)
    }
    return tasks
    
}
// get task by due date
export function getTaskByDueDate(dueDate: string) : Array<Task>
{
    let tasks = new Array<Task>
    for (let i = 0; i <= parseInt(localStorage.getItem('last-id') || "1"); i++)
    {
        const raw = localStorage.getItem(`task-${i}`)
        if (!raw) continue
        const task: Task = JSON.parse(raw)
        if (task.dueDate == dueDate)
            tasks.push(task)
    }
    return tasks
}
// get all tasks
export function getAllTasks(filter: string = "due-date") : Array<Task>
{
    let tasks = new Array<Task>
    for (let i = 0; i < localStorage.length; i++)
    {
        const key = localStorage.key(i)

        if (key && key.startsWith("task-"))
        {
            const raw = localStorage.getItem(key)
            if (raw)
            {
                const task = JSON.parse(raw)
                if (task && task.id !== undefined)
                    tasks.push(task)
            }
        }
    }

    if (filter == "due-date")
        tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    else if (filter == "title")
        tasks.sort((a, b) => a.title.localeCompare(b.title))
    else if (filter == "completed-at")
        tasks.sort((a, b) => {
            if (!a.completedAt && !b.completedAt) return 0
            if (!a.completedAt) return 1
            if (!b.completedAt) return -1

            return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        })

    return tasks
}

//* TaskList
export function getTaskStatus(task: Task) : string
{
    const now = new Date(Date.now());
    const due = new Date(task.dueDate); due.setHours(23, 59, 59, 999);

    const diffMs = due.getTime() - now.getTime()
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    if (!task.completedAt) {
        if (now > due)
            return "late"
        if (diffMs <= threeDaysMs) {
            return "nearing-deadline";
        }
        return "in-progress"
    }

    const completed = new Date(task.completedAt)

    if (completed <= due) {
        return "done"
    }

    return "done-late"
}

export function getTaskStatusBadgeName(task: Task)
{
    let status = getTaskStatus(task)
    if (status == "in-progress")
        return "en cours"
    else if (status == "late")
        return "en retard"
    else if (status == "done")
        return "finie"
    else if (status == "done-late")
        return "finie en retard"
    else if (status == "nearing-deadline")
        return "écheance proche"
}

const ls_asksOpen = localStorage.getItem('tasks-open')
let tasksOpen: boolean
if (ls_asksOpen == "true")
    tasksOpen = true
else
    tasksOpen = false

export function areAllTasksOpen() : boolean
{ 
    if ((localStorage.getItem("tasks-open") || "" ) == "true")
        return true
    return false
}
export function toggleAllTaskOpenning()
{
    tasksOpen = !tasksOpen
    localStorage.setItem('tasks-open', tasksOpen ? "true" : "false")

    window.location.reload()
}

//* TaskFilters.vue