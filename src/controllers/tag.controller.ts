import { getAllTags, Tag, tagToJson } from "@/models/tag.model";

export function createTag(name: string, color: string) : number
{
    const id = parseInt(localStorage.getItem("last-tag-id") || "-1") + 1
    localStorage.setItem("last-tag-id", id.toString())

    let tag: Tag = {
        id: id,
        name: name,
        color: color,
        tasks: []
    }

    const tagJson = tagToJson(tag)
    localStorage.setItem(`tag-${tag.id}`, JSON.stringify(tagJson))

    window.location.reload()

    return tag.id
}

export function deleteTag(id: number)
{
    localStorage.removeItem(`tag-${id}`)
    window.location.reload()
}

export function addTagToTask(tagId: number, taskId: number)
{
    let tt = JSON.parse(localStorage.getItem(`tag-${tagId}`) || '{"id": "", "name": "", "color": "", "tasks": []}')
    tt.tasks.push(taskId)
    localStorage.setItem(`tag-${tagId}`, JSON.stringify(tt))
}

export function addTagsToTask
(
    tagsIds: Array<number>,
    taskId: number
)
{
    for (let i = 0; i < localStorage.length; i++)
    {
        const key = localStorage.key(i)
        if (key?.startsWith("tag-")) {
            const tagId = parseInt(key.replace("tag-", ""), 10);

            if (tagsIds.includes(tagId)) {
                addTagToTask(tagId, taskId);
            }
        }
    }
}

export function isTaskTaggedBy(taskId: number, tagId: number): boolean
{
    const key = `tag-selection-for-task-${taskId}`
    const raw = localStorage.getItem(key)
    console.log(`[isTaskTaggedBy] key=${key} raw=${raw} tagId=${tagId}`)
    
    const arr = JSON.parse(raw || '[]')
    console.log(`[isTaskTaggedBy] parsed=`, arr, `includes(${tagId})=`, arr.includes(tagId))
    
    return arr.includes(tagId)
}

export function isTaskTaggedBySelected(taskId: number): boolean
{
    const selectedTags: number[] = getAllSelectedTags()

    if (selectedTags.length === 0)
        return true

    return selectedTags.some(tagId => isTaskTaggedBy(taskId, tagId))
}

export function getAllSelectedTags()
{
    return JSON.parse(localStorage.getItem('selected-tags') || '[]')
}