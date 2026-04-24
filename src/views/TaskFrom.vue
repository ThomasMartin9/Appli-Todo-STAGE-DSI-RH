<script setup lang="ts">
import { createTask, getTask, getTaskByDueDate, getTaskByTitle } from '@/controllers/task.controller'
import { getArrayTaskString, getTaskString } from '@/models/task.model'
import { ref } from 'vue'

const taskTitle = ref<string>('')
const taskDescription = ref<string>('')
const dueDate = ref<string>('')

const emit = defineEmits<{ close: [] }>()

function handleSubmit()
{
    if (!taskTitle.value)
    {
        alert("Nom de la tâche manquant")
        return
    }
    
    if (!dueDate.value)
    {
        alert("Date d'échéance non reseignée")
        return
    }

    // create task
    let id = createTask(taskTitle.value, taskDescription.value, dueDate.value)
    emit('close')
}

</script>

<template>

<form action="" class="prevent-select">
    <fieldset class="fr-fieldset" aria-labelledby="text-legend text-messages">
        <legend class="fr-fieldset__legend" id="text-legend">
            Nouvelle tâche
            <!-- <span class="fr-hint-text">Texte de description additionnel</span> -->
        </legend>
        <div class="fr-fieldset__element">
            <div class="fr-input-group">
                <label class="fr-label" for="taskform-form-task-name">
                    Nom de la tâche*
                </label>
                <input class="fr-input" name="taskform-form-task-name" id="taskform-form-task-name" type="text" v-model="taskTitle">
            </div>
        </div>
        <div class="fr-fieldset__element">
            <div class="fr-input-group">
                <label class="fr-label" for="taskform-form-task-description">
                    Description
                </label>
                <input class="fr-input" name="taskform-form-task-description" id="taskform-form-task-description" type="text" v-model="taskDescription">
            </div>
        </div>
        <div class="fr-fieldset__element">
            <div class="fr-input-group">
                <label class="fr-label" for="taskform-form-task-dueDate">
                    Date d'échéance*
                </label>
                <input class="fr-input" name="taskform-form-task-dueDate" id="taskform-form-task-dueDate" type="date" v-model="dueDate">
            </div>
        </div>
        <div class="fr-messages-group" id="text-messages" aria-live="polite">
        </div>
    </fieldset>

    <div id="form-button">
        <button class="fr-btn" type="button" id="taskform-form-submit-button" @click="handleSubmit">
            Enregistrer les informations
        </button>
        <button class="fr-btn" type="button" @click="emit('close')">
            Annuler
        </button>
    </div>
</form>

</template>

<style lang="css" scoped>

form
{
    margin-left: auto;
    margin-right: auto;
    width: 40vw;
    display: flex;
    flex-direction: column;
}

button
{
    margin-left: auto;
    margin-right: auto;
}

#form-button
{
    display: flex;
}

</style>