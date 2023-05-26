<template>
    <!-- Dialog component with a model binding to the localDialogVisible variable -->
    <v-dialog v-model="localDialogVisible" :max-width="500">
        <v-card>
            <v-card-title>
                <!-- Displaying the dialog title -->
                <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
                <!-- Form submission handler -->
                <v-form @submit.prevent="save" id="personForm"> 
                    <v-text-field v-model="localFormData.name" label="Name" required id="txtName"></v-text-field>
                    <v-text-field v-model="localFormData.gender" label="Gender" required id="txtGender"></v-text-field>
                    <v-text-field v-model="localFormData.birth_year" label="Birth Year" required id="txtBirthYear"></v-text-field>
                    <v-text-field v-model="localFormData.height" label="Height" required id="txtHeight"></v-text-field>
                    <v-text-field v-model="localFormData.mass" label="Mass" required id="txtMass"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="save" id="btnSave">Save</v-btn>
                <v-btn color="secondary" @click="cancel" id="btnCancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Person } from '@/types';

export default defineComponent({
    name: 'PersonForm',
    props: {
        formData: {
            type: Object as () => Person | null,
            required: true,
            default: null,
        },
        dialogVisible: {
            type: Boolean,
            required: true,
        },
        dialogTitle: {
            type: String,
            required: true,
        },
    },
    setup(props, context) {
        const localDialogVisible = ref(props.dialogVisible); 
        const localFormData = ref<Person>({ 
            name: '',
            gender: '',
            birth_year: '',
            height: '',
            mass: '',
        });

        // Watch for changes in the dialogVisible prop
        watch(() => props.dialogVisible, (newVal) => {
            localDialogVisible.value = newVal; 
        });

        watch(
            () => props.formData,
            (newFormData) => {
                if (newFormData !== null && typeof newFormData === 'object') {
                    // Assign the values of newFormData to localFormData
                    Object.assign(localFormData.value, newFormData); 
                } else {
                    // Reset localFormData to empty values if newFormData is null or not an object
                    localFormData.value = { 
                        name: '',
                        gender: '',
                        birth_year: '',
                        height: '',
                        mass: '',
                    };
                }
            },
            { immediate: true } // Trigger the watcher immediately when the component is created
        );

        const save = () => {
            if (localFormData.value) {
                context.emit('save', { ...localFormData.value });
            }
        };

        const cancel = () => {
            context.emit('cancel');
        };

        return {
            localDialogVisible,
            localFormData,
            save,
            cancel,
        };
    },
});
</script>
