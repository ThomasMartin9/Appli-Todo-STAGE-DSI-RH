<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { areAllTasksOpen, getAllTasks, toggleAllTaskOpenning } from './controllers/task.controller';
import TaskFrom from './views/TaskFrom.vue';
import TaskList from './views/TaskList.vue';
import '@gouvfr/dsfr/dist/dsfr.css'
import '@gouvfr/dsfr/dist/utility/utility.css'
import '@gouvfr/dsfr/dist/component/form/form.css'
import '@gouvfr/dsfr/dist/component/accordion/accordion.css'
import TaskFilters from './views/TaskFilters.vue';
import { getAllTags, Tag } from './models/tag.model';
import TagForm from './views/TagForm.vue';
import { getAllSelectedTags, isTaskTaggedBy, isTaskTaggedBySelected } from './controllers/tag.controller';

const selectedValue = ref<string>('0')
let values = ["due-date", "title", "completed-at"]

let allTasks = ref(getAllTasks())

const tasks = computed(() => {
    const filter = values[parseInt(selectedValue.value)]
    return [...allTasks.value].sort((a, b) => {
        if (filter == "title")
            return a.title.localeCompare(b.title)
        else if (filter == "completed-at")
        {
            if (!a.completedAt && !b.completedAt) return 0
            if (!a.completedAt) return 1
            if (!b.completedAt) return -1

            return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
})

const showForm = ref(false)

const isExpanded = computed(() => {
    if (localStorage.getItem("tasks-open") == "true")
        return true
    return false
})

// const tags = ref(getAllTags())
const tags = ref(getAllTags())

const showTagCreation = ref(false)

const filterKey = ref(0)

function isTaskVisible(taskId: number): boolean {
    filterKey.value
    return isTaskTaggedBySelected(taskId)
}

// Écoute les changements de sélection de tags
window.addEventListener('storage', () => {
    filterKey.value++
})

</script>

<template>

<main>
    <div id="task-list-header">
        <div class="fr-select-group">
            <label
                class="fr-label"
                for="select-hint"
            >
                Trier
            </label>
            <select
                class="fr-select"
                aria-describedby="select-hint-messages"
                id="select-hint"
                name="select-hint"
                v-model="selectedValue"
            >
                <option value="0">Date déchéance</option>
                <option value="1">Nom de tâche</option>
                <option value="2">Date de complétion</option>
            </select>
            <div
                class="fr-messages-group"
                id="select-hint-messages"
                aria-live="polite"
            >
            </div>
        </div>
        <button
            @click="toggleAllTaskOpenning()"
            class="prevent-selec fr-btn btn-open-close-all-tasks"
        >
            {{ isExpanded ? "Fermer les tâches" : "Ouvrir les tâches" }}
        </button>
    </div>

    <div class="div-tags">
        <p class="fr-fieldset">Tags</p>
        <div
            v-for="tag in tags"
            :key="tag.id"
        >
            <TaskFilters
                :id="tag.id"
                :name="tag.name"
                :color="tag.color"
                type="search"
            >
            </TaskFilters>
        </div>
    </div>

    <div
        v-for="task in tasks"
        :key="task.id"
    >
        <TaskList
            :taskId="task.id"
            class="tasklist"
            v-show="isTaskVisible(task.id)"
        >
        </TaskList>
    </div>

    <button
        @click="showTagCreation = true; showForm = false"
        class="prevent-selec fr-btn button-create-tag"
    >
        Créer un nouveau tag
    </button>

    <button
        @click="showForm = true; showTagCreation = false"
        class="prevent-selec fr-btn button-create-task"
    >
        Créer une nouvelle tâche
    </button>

    <TaskFrom
        v-show="showForm"
        @close="showForm = false"
    ></TaskFrom>

    <TagForm
        v-show="showTagCreation"
        @close="showTagCreation = false; tags = getAllTags()"
    ></TagForm>
</main>

</template>

<style>

body
{
    background-color: var(--background-default-grey);
    color: var(--text-default-grey);
}

main
{
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
}

#task-list-header
{
    display: flex;
    flex-direction: row;
    margin-right: 15vw;
    margin-left: 15vw;
}

.fr-select-group
{
    width: 20vw;
}

.fr-select-group > label
{
    text-align: left;
    padding-left: .2vw;
}

.btn-open-close-all-tasks
{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
}

.button-create-tag
{
    margin-left: 60vw;
    margin-top: 1vh;
}

.button-create-task
{
    margin-left: 1%;
}

.prevent-select {
    -webkit-user-select: none; /* Safari */   
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}

.div-tags
{
    background-color: var(--background-contrast-grey);
    margin-left: 15vw;
    padding-left: 1vw;
    margin-right: 15vw;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
}

.div-tags > p
{
    width: 100%;
    /* margin-left: 1%; */
    font-size: 1.5rem;
    padding-top: 1%;
    margin-bottom: 1vh;
}

.tasklist
{
    width: 60vw;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
}

.task-hidden
{
    display: block;
}

.task-showed
{
    display: block;
}

</style>
