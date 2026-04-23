export interface Tag
{
    id: number,
    name: string,
    color: string
    tasks: Array<string>
}

export function getTag(id: number): Tag
{
    const tagString = localStorage.getItem(`tag-${id}`)
    return jsonToTag(JSON.parse(tagString || '{"id": "", "name": "", "color": "", "tasks": []}'))
}

export function getAllTags(): Array<Tag>
{
    let tags = new Array<Tag>
    for (let i = 0; i < localStorage.length; i++)
    {
        const key = localStorage.key(i)

        if (key && key.startsWith("tag-"))
        {
            const raw = localStorage.getItem(key)
            if (raw)
            {
                const tag = JSON.parse(raw)
                if (tag && tag.id !== undefined)
                    tags.push(tag)
            }
        }
    }

    return tags
}

export function tagToJson(tag: Tag)
: {
    id: number,
    name: string,
    color: string
    tasks: Array<string>
}
{
    return {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        tasks: tag.tasks
    }
}

export function jsonToTag
(
    tag: {
        id: number,
        name: string
        color: string
        tasks: Array<string>
    }
) : Tag
{
    let t: Tag = {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        tasks: tag.tasks
    }
    return t
}