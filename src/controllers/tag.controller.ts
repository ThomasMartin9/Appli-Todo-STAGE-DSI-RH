import { getAllTags, getTag, Tag, tagToJson } from "@/models/tag.model";

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

    // window.location.reload()

    return tag.id
}

export function deleteTag(id: number)
{
    localStorage.removeItem(`tag-${id}`)
    // window.location.reload()
}

export function toggleSelectTag
(
    filter: string = "search",
    isSelected: boolean,
    id: number,
    taskId: number,
    isTagForSelectionSelected: boolean
) : boolean
{
    if (!getAllTags().includes(getTag(id)))
    {
        let jsonTags = JSON.parse(getAllSelectedTags())
        const indexOfId = jsonTags.indexOf(getTag(id))
        jsonTags.splice(indexOfId)
        localStorage.setItem("selected-tags", jsonTags)
    }

    if (filter == "search")
    {
        isSelected = !isSelected
        if (isSelected)
        {
            let selectedTags = JSON.parse(localStorage.getItem('selected-tags') || '[]')
            if (!selectedTags.includes(id))
            {
                selectedTags.push(id);
                localStorage.setItem('selected-tags', JSON.stringify(selectedTags))
            }
        }
        else 
        {
            let selectedTags = JSON.parse(localStorage.getItem('selected-tags') || '[]')
            const index = selectedTags.indexOf(id);
            if (index !== -1)
                selectedTags.splice(index, 1)
            localStorage.setItem('selected-tags', JSON.stringify(selectedTags))
        }
    }
    else if (filter == "task")
    {
        isTagForSelectionSelected = !isTagForSelectionSelected
        if (isTagForSelectionSelected)
        {
            let selectedTagsForTask = JSON.parse(localStorage.getItem(`tag-selection-for-task-${taskId}`) || '[]')
            if (!selectedTagsForTask.includes(id))
            {
                selectedTagsForTask.push(id)
                localStorage.setItem(`tag-selection-for-task-${taskId}`, JSON.stringify(selectedTagsForTask))
            }
        }
        else
        {
            let selectedTagsForTask = JSON.parse(localStorage.getItem(`tag-selection-for-task-${taskId}`) || '[]')
            console.log(selectedTagsForTask)
            const index = selectedTagsForTask.indexOf(id);
            // if (index !== -1)
            //     selectedTagsForTask.splice(index, 1)
            localStorage.setItem(`tag-selection-for-task-${taskId}`, JSON.stringify(selectedTagsForTask))
        }
    }
    return isSelected
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