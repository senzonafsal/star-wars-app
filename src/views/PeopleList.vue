<template>
  <div class="people-list">
    <h1>People List</h1>
    <v-container fluid fill-height>
      <div class="flex-container">
        <div class="pagination-container">
          <!-- Display pagination component with current page, visible page count, total page count, and loadPeople event handler -->
          <v-pagination v-model="currentPage" :total-visible="5" :length="totalPages" @click="loadPeople"></v-pagination>
        </div>
        <div class="per-page-container">
          <!-- Display combobox and bind the selected value to itemsPerPage -->
          <v-combobox label="Select" :items="['10']" variant="outlined" v-model="itemsPerPage"></v-combobox>
        </div>
      </div>
    </v-container>

    <!-- Display the table with people data -->
    <v-container fluid fill-height>
      <v-table width="100%" class="data-table" id="dataTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Birth Year</th>
            <th>Height</th>
            <th>Mass</th>
            <th width="100">Actions</th>
          </tr>
        </thead>
        <transition-group name="fade" tag="tbody">
          <!-- Wrap the rows with transition-group -->
          <tr v-for="(person, index) in displayedPeople" :key="index" @mouseenter="hoveredRow = index"
            @mouseleave="hoveredRow = 0" :class="{ 'fade-leave': deletingIndex === index }">
            <td>{{ person.name }}</td>
            <td>{{ person.gender }}</td>
            <td>{{ person.birth_year }}</td>
            <td>{{ person.height }}</td>
            <td>{{ person.mass }}</td>
            <td>
              <div v-if="hoveredRow === index">
                <!-- Display icons for editing and deleting the person when hovering over the row -->
                <v-icon @click="editPerson(person)" icon="mdi-pencil" id="editButton"></v-icon>
                <v-icon @click="deletePerson(person, index)" icon="mdi-delete" class="ml-3" id="deleteButton"></v-icon>
              </div>
            </td>
          </tr>
        </transition-group>
      </v-table>
    </v-container>

    <!-- Create button for adding a new person -->
    <div class="text-right mr-5">
      <v-btn color="primary" @click="createPerson" id="createButton">Create</v-btn>
    </div>

    <!-- Use v-dialog to display the PersonForm component as a dialog -->
    <v-dialog v-model="dialogVisible" :max-width="500">
      <PersonForm :formData="formData" :dialogVisible="dialogVisible" :dialogTitle="dialogTitle" @save="savePerson"
        @cancel="closeDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { Person } from '@/types';
import PersonForm from '@/views/PersonForm.vue';

export default defineComponent({
  name: "PeopleList",
  components: {
    PersonForm,
  },
  setup() {
    const store = useStore();
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const loading = ref(false);

    // Compute the total number of people in the store's state
    const totalPeopleCount = computed(() => store.state.totalPeopleCount);
    // Keep track of the currently hovered row index
    const hoveredRow = ref(0);
    // Keep track of the deleting row index
    const deletingIndex = ref<number | null>(null);

    // Compute the array of people to be displayed based on the current page and items per page
    const displayedPeople = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return store.state.people.slice(start, end).filter((person: Person) => person !== undefined);
    });

    // Compute the total number of pages based on the total number of people and items per page
    const totalPages = computed(() => Math.ceil(totalPeopleCount.value / itemsPerPage.value));

    // Keep track of the visibility of the dialog component
    const dialogVisible = ref(false);

    // Keep track of the title and form data for the dialog component
    const dialogTitle = ref('');
    const formData = ref<Person | null>({} as Person);

    // Function to handle editing a person
    const editPerson = (person: Person) => {
      dialogTitle.value = 'Edit Person';
      formData.value = { ...person };
      dialogVisible.value = true;
    };

    // Function to handle deleting a person
    const deletePerson = async (person: Person, index: number) => {
      deletingIndex.value = index;

      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for the animation to complete

      store.commit('deletePerson', person);
      deletingIndex.value = null;
    };


    // Function to create a new person
    const createPerson = () => {
      dialogTitle.value = 'Create Person';
      formData.value = {} as Person;
      dialogVisible.value = true;
    };

    // Function to save the person data (either update or create)
    const savePerson = (person: Person) => {
      if (dialogTitle.value === 'Edit Person') {
        if (person.name) {
          store.dispatch('updatePerson', person);
        }
      } else if (dialogTitle.value === 'Create Person') {
        if (person.name) {
          store.dispatch('createPerson', person);
        }
      }
      closeDialog();
    };

    // Function to close the dialog and reset form data
    const closeDialog = () => {
      dialogVisible.value = false;
      formData.value = {} as Person;
    };

    // Function to load the people data from the store
    const loadPeople = async () => {
      loading.value = true;
      try {
        await store.dispatch("fetchPeople", {
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value,
        });
      } catch (error) {
        console.error("Error loading people:", error);
      } finally {
        loading.value = false;
      }
    };

    // Load the people data when the component is mounted
    onMounted(() => {
      loadPeople();
    });

    // Watch for changes in the itemsPerPage value and reload the people data
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      loadPeople();
    });

    return {
      displayedPeople,
      currentPage,
      itemsPerPage,
      totalPages,
      loading,
      loadPeople,
      hoveredRow,
      dialogVisible,
      dialogTitle,
      formData,
      editPerson,
      createPerson,
      savePerson,
      closeDialog,
      deletePerson,
      deletingIndex
    };
  },
});
</script>

<style scoped>
.people-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

td,
th {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

table {
  border-collapse: collapse;
}

tbody tr:nth-child(odd) {
  background: #eee;
}

tbody tr:hover {
  cursor: pointer;
  background: #eef;
}

.pagination-container {
  flex: 0;
}

.per-page-container {
  margin-left: 20px;
}

.v-combobox {
  width: 120px;
  margin-left: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-leave {
  background: #fee !important;
}
</style>
