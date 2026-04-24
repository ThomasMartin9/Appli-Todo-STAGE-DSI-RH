<script setup lang="ts">
import { createTag } from '@/controllers/tag.controller';
import { getAllTags } from '@/models/tag.model';
import { ref } from 'vue'

const tagId = ref<string>('')
const color = ref<string>('')

const emit = defineEmits<{ close: [] }>()

function handleSubmit()
{
    if (!tagId.value)
    {
        alert("Nom du tag manquant")
        return
    }

    console.log("Verify tag unicity")

    const tags = getAllTags()
    for (let i = 0; i < tags.length; i++)
    {
        console.log(tags[i], i)
        if (tags[i]?.name === tagId.value)
        {
            window.alert("Vous ne pouvez pas créer deux tag du même nom")
            emit('close')
        }
    }

    let res: string = "#"
    let characters: string = "0123456789ABCDEF"
    const characterLength = characters.length
    // create task
    if (color.value != "")
    {
        createTag(tagId.value, color.value.toLocaleLowerCase())
        console.warn("HELLO")
    }
    else 
    {
        for (let i = 0; i < 6; i++)
            res += characters.charAt(Math.floor(Math.random() * characterLength))
        createTag(tagId.value, res.toLocaleLowerCase())
        console.log("Hello this is tag", res)
    }
    
    emit('close')
}

</script>

<template>

<form action="" class="prevent-select">
    <fieldset class="fr-fieldset" aria-labelledby="text-legend text-messages">
        <legend class="fr-fieldset__legend" id="text-legend">
            Nouveau tag
            <!-- <span class="fr-hint-text">Texte de description additionnel</span> -->
        </legend>
        <div class="fr-fieldset__element">
            <div class="fr-input-group">
                <label class="fr-label" for="taskform-form-task-name">
                    Nom du tag*
                </label>
                <input class="fr-input" name="taskform-form-task-name" id="taskform-form-task-name" type="text" v-model="tagId">
            </div>
        </div>
        <div class="fr-fieldset__element">
            <div class="fr-input-group">
                <label class="fr-label" for="taskform-form-task-description">
                    Couleur
                    <span class="fr-hint-text">( aléatoire si non spécifiée )</span>
                </label>
                <input class="fr-input" name="taskform-form-task-description" id="taskform-form-task-description" type="text" v-model="color">
            </div>
        </div>
    </fieldset>

    <div id="form-button">
        <button
            class="fr-btn"
            type="button"
            id="taskform-form-submit-button"
            @click="handleSubmit(); tagId = ''; color = ''"
        >
            Enregistrer les informations
        </button>
        <button
            class="fr-btn"
            type="button"
            @click="emit('close'); tagId = ''; color = ''"
        >
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