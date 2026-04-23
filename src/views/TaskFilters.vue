<script setup lang="ts">
import { deleteTag } from '@/controllers/tag.controller';
import { computed, ref } from 'vue';

const props = defineProps<{
    id: number
    name: string,
    color: string
    type: string
    taskId?: number
}>()

function getTextColor(bgColor: string) : string
{
    const color = bgColor.replace("#", "")
    let r = parseInt(color.substring(0, 2), 16)
    let g = parseInt(color.substring(2, 4), 16)
    let b = parseInt(color.substring(4, 6), 16)
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness > 128 ? '#000000' : '#ffffff'
}

const isSelected = ref(false)
const isTagForSelectionSelected = ref(false)

if (JSON.parse(localStorage.getItem('selected-tags') || '[]').includes(props.id))
    isSelected.value = true

computed(() => {
    if (JSON.parse(localStorage.getItem(`tag-selection-for-task-${props.taskId}`) || '[]').includes(props.id))
        isTagForSelectionSelected.value = true
})

function toggleSelect(filter: string = "search")
{
    if (filter == "search")
    {
        isSelected.value = !isSelected.value
        if (isSelected.value)
        {
            let selectedTags = JSON.parse(localStorage.getItem('selected-tags') || '[]')
            if (!selectedTags.includes(props.id))
            {
                selectedTags.push(props.id);
                localStorage.setItem('selected-tags', JSON.stringify(selectedTags))
            }
        }
        else 
        {
            let selectedTags = JSON.parse(localStorage.getItem('selected-tags') || '[]')
            const index = selectedTags.indexOf(props.id);
            if (index !== -1)
                selectedTags.splice(index, 1)
            localStorage.setItem('selected-tags', JSON.stringify(selectedTags))
        }
    }
    else if (filter == "task")
    {
        isTagForSelectionSelected.value = !isTagForSelectionSelected.value
        if (isTagForSelectionSelected.value)
        {
            let selectedTagsForTask = JSON.parse(localStorage.getItem(`tag-selection-for-task-${props.taskId}`) || '[]')
            if (!selectedTagsForTask.includes(props.id))
            {
                selectedTagsForTask.push(props.id)
                localStorage.setItem(`tag-selection-for-task-${props.taskId}`, JSON.stringify(selectedTagsForTask))
            }
        }
        else
        {
            let selectedTagsForTask = JSON.parse(localStorage.getItem(`tag-selection-for-task-${props.taskId}`) || '[]')
            const index = selectedTagsForTask.indexOf(props.id);
            if (index !== -1)
                selectedTagsForTask.splice(index, 1)
            localStorage.setItem(`tag-selection-for-task-${props.taskId}`, JSON.stringify(selectedTagsForTask))
        }
        window.location.reload()
    }
}

</script>

<template>

<button
    type="button"
    class="fr-tag"
    :class="{ 'selected': isSelected || isTagForSelectionSelected }"
    :style="
        `background-color:${color};
        color:${getTextColor(color)} !important;`
    "
    @click="toggleSelect(type)"
>
    <button
        @click="deleteTag(props.id)"
        v-show="type == 'search'"
    >X</button>
    {{ name }}
</button>

</template>

<style lang="css" scoped>

.fr-tag
{
    margin: 5px;
    color: black !important;
    overflow: hidden;
    max-height: 20px;
    max-width: 65vw;
    white-space: nowrap;
    justify-content: left;
}

.fr-tag:hover
{
    text-decoration: underline;
    transition: all .4s;
}

button:not(.fr-tag)
{
    border-radius: 50%;
    width: 22px;
    /* margin-top: auto; */
    margin-bottom: auto;
}
button:hover
{
    background-color: #00000066;
}
button.selected
{
    box-shadow: 0 0 10px #000;
}

</style>