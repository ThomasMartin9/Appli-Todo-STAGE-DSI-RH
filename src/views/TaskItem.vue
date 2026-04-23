<script setup lang="ts">
import { deleteTask, endTask, getTask } from '@/controllers/task.controller';

const props = defineProps<{
    taskId: number,
    description: string,
    dueDate: string,
    completedAt: string | null
}>()

</script>

<template>

{{ props.description }}
<div class="dueDate-completedAt-div">
    <div>
        <div>
            Date d'échéance : {{ props.dueDate }}
        </div>
        <div
            class="task-not-completed"
            :class="{ 'task-completed': completedAt != null}"
        >
            Finie le : {{ props.completedAt }}
        </div>
    </div>
    <div class="end-task-btn showed">
        <button
            @click="endTask(getTask(props.taskId))"
            class="fr-btn"
            v-show="props.completedAt == null"
        >
            Finir la tâche
        </button>
    </div>
    <div class="delete-task-btn">
        <button
            @click="deleteTask(getTask(props.taskId))"
            class="fr-btn"
        >
            Supprimer la tâche
        </button>
    </div>
</div>

</template>

<style lang="css" scoped>

.dueDate-completedAt-div
{
    display: flex;
    padding-top: .5%;
    font-size: .8rem;
}

.dueDate-completedAt-div > *:not(.delete-task-btn)
.dueDate-completedAt-div > *:not(.end-task-btn)
{
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 3%;
}

.end-task-btn.showed
{
    display: block;
    margin-left: auto;
    margin-right: 1%;
}

.end-task-btn.hidden
{
    display: none;
}

.task-not-completed
{
    display: none;
}

.task-completed
{
    display: block;
}

.fr-btn
{
    font-size: .8rem !important;
}

</style>