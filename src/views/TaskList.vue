<script setup lang="ts">
import { areAllTasksOpen, getTask, getTaskStatus, getTaskStatusBadgeName, isTaskOpen } from '@/controllers/task.controller';
import { computed, ref } from 'vue';
import TaskItem from './TaskItem.vue';
import TaskFilters from './TaskFilters.vue';
import { getAllTags } from '@/models/tag.model';
import { getAllSelectedTags, isTaskTaggedBySelected } from '@/controllers/tag.controller';

const props = defineProps<{
    taskId: number
}>()

let title = getTask(props.taskId).title
let description = getTask(props.taskId).description
let dueDate = getTask(props.taskId).dueDate
let completedAt = getTask(props.taskId).completedAt

const isOpen = ref(areAllTasksOpen())

let tags = ref(getAllTags())
const showTagSelection = ref(true)

const changeTag = ref(false)

const isTaskTagged = computed(() => {
    // console.log(props.taskId, isTaskTaggedBySelected(props.taskId))
    return isTaskTaggedBySelected(props.taskId)
})
const noTagSelected = computed(() => {
    return getAllSelectedTags().length === 0
})

console.log("S => ", isTaskTagged.value, noTagSelected.value)

</script>

<template>

<section class="fr-accordion">
    <h3 class="fr-accordion__title">
        <button
            type="button"
            class="fr-accordion__btn"
            :aria-expanded="isTaskOpen(props.taskId, isOpen)"
            aria-controls="accordion-1"
            @click="isOpen = !isOpen"
        >
            {{ title }}
            <p
                class="fr-badge"
                :class="`badge--${getTaskStatus(getTask(props.taskId))}`"
            >
                {{ getTaskStatusBadgeName(getTask(props.taskId)) }}
            </p>
        </button>
    </h3>
    <div
        id="accordion-1"
        :class="{ 'fr-collapse-expanded': isTaskOpen(props.taskId, isOpen), 'fr-collapse': !isTaskOpen(props.taskId, isOpen)}"
    >
        <TaskItem
            :taskId="props.taskId"
            :description="description"
            :due-date="dueDate"
            :completedAt="completedAt"
        >
        </TaskItem>

        <div class="divTags">
            <div>
                <button
                    class="fr-btn"
                    @click="changeTag = !changeTag"
                >
                    {{ changeTag ? "Confirmer" : "Changer les tags" }}
                </button>
            </div>
            <div class="tags">
                <div
                    v-for="tag in tags"
                    v-show="showTagSelection"
                >
                    <TaskFilters
                        v-show="changeTag"
                        :id="tag.id"
                        :name="tag.name"
                        :color="tag.color"
                        :tasks="tag.tasks"
                        type="task"
                        :taskId="taskId"
                    ></TaskFilters>
                </div>
            </div>
        </div>
    </div>
</section>

</template>

<style lang="css" scoped>

.fr-collapse-expanded
{
    padding-left: 5%;
    padding-top: .3%;
    padding-bottom: .5%;
}

.fr-badge
{
    margin-left: 2%;
}

.badge--in-progress
{
    background-color: var(--background-contrast-blue-ecume-hover);
}

.badge--late
{
    background-color: var(--background-contrast-red-marianne-hover);
}

.badge--done
{
    background-color: var(--background-contrast-green-bourgeon-hover);
}

.badge--done-late
{
    background-color: var(--background-contrast-brown-cafe-creme-hover);
}

.badge--nearing-deadline
{
    background-color: var(--background-contrast-yellow-tournesol-hover);

}

.divTags
{
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    flex-direction: column;
    margin-bottom: .5vh;
    margin-top: .5vh;
}

.divTags > div:not(.tags)
{
    margin-left: auto;
}

.tags
{
    display: flex !important;
    flex-wrap: wrap;
}

.fr-btn
{
    font-size: .8rem !important;
}

</style>