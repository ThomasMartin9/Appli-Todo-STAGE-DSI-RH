export interface Task
{
    id: number,
    title: string,
    description: string,
    dueDate: string, // ISO string
    completedAt: string | null;
}

export function getTaskString(task: Task) : string
{
    return `${task.id}:${task.title}:${task.description}:${task.dueDate}:${task.completedAt}`
}

export function getTaskJson(task: Task)
: {
    id: number,
    title: string,
    description: string,
    dueDate: string, // ISO string
    completedAt: string | null;
}
{
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completedAt: task.completedAt
    }
}

export function jsonToTask
(
    task: {
        id: number,
        title: string,
        description: string,
        dueDate: string, // ISO string
        completedAt: string | null;
    }
) : Task
{
    let t: Task = {
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completedAt: task.completedAt
    }
    return t
}

export function getArrayTaskString(tasks: Array<Task>) : string
{
    let t: string = ""
    for (let i = 0; i < tasks.length; i++)
    {
        const task = tasks[i] || stringToTask('')
        t += getTaskString(task)
        if (i <= tasks.length -1)
            t += '\n'
    }
    return t
}

export function stringToTask(task: string) : Task
{
    const taskSplit: string[] = task.split(":")
    let t: Task = {
        id: parseInt(taskSplit[0] || "0"),
        title: taskSplit[1] || "sans-nom",
        description: taskSplit[2] || "",
        dueDate: taskSplit[3] || "",
        completedAt: taskSplit[4] || null
    }
    return t
}