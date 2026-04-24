<script setup lang="ts">
import { deleteTag, toggleSelectTag } from '@/controllers/tag.controller';
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

function toggleSelect(filter: string = "search", isSelected: boolean)
{
    return toggleSelectTag(filter, isSelected, props.id, props.taskId || 0, isTagForSelectionSelected.value)
}

</script>

<template>

<button
    type="button"
    class="fr-tag parent-button"
    @click="isSelected = toggleSelect(type, isSelected)"
    style="background-color: transparent !important;"
>
    <button
        @click="deleteTag(props.id)"
        v-show="type == 'search'"
        class="tag-delete-cross"
        style="text-decoration: none !important;"
    >X</button>
    <button
        class="fr-tag select-button"
        :class="{ 'selected': isSelected || isTagForSelectionSelected }"
        :style="
            `background-color:${color};
            color:${getTextColor(color)} !important;`
        "
    >
        {{ name }}
    </button>
</button>

</template>

<style lang="css" scoped>

.fr-tag.parent-button
{
    overflow: visible;
    padding: 0;
}

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

.tag-delete-cross
{
    position: relative;
    border-radius: 10px;
    z-index: 200;
}

.select-button:hover
{
    text-decoration: underline;
    transition: all .4s;
}

.select-button:not(.fr-tag)
{
    border-radius: 50%;
    width: 22px;
    margin-bottom: auto;
    z-index: 100;
}
.select-button:hover
{
    background-color: #00000066;
}
.select-button.selected
{
    box-shadow: 0 0 10px #000;
}

</style>