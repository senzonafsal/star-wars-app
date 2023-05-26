<template>
    <div class="search-container">
        <!-- Search input field -->
        <v-text-field label="Search Star Wars" variant="outlined" v-model="searchTerm" @input="debouncedSearch"
            @click.stop class="mb-0" id="txtSearch"></v-text-field>

        <!-- Search results popup -->
        <transition name="fade">
            <div v-if="hasSearchResults" class="search-results" id="searchResults">
                <div class="popup">
                    <!-- Iterate over search results by category -->
                    <div v-for="(results, category) in searchResults" :key="category" class="category-results">
                        <template v-if="results && results.length > 0">
                            <!-- Category title -->
                            <h2>{{ category }}</h2>
                            <ul>
                                <!-- Display individual search results -->
                                <li v-for="result in results" :key="result.url">
                                    <router-link :to="getEntityPath(result.url)">
                                        <div class="result-item" v-html="highlightSearchTerm(result.name || result.title)">
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                            <!-- Link to view all results for the category -->
                            <router-link :to="`/${category}`" class="view-all-link">View All</router-link>
                        </template>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
  
<script lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { RootState } from '@/types';

export default {
    name: 'SearchPage',
    setup() {
        // Access Vuex store
        const store = useStore<RootState>();
        const debounceRate = 200;

        let debounceTimer: ReturnType<typeof setTimeout> | null = null;

        // Function to perform debounced search
        const debouncedSearch = () => {
            // Clear previous debounce timer
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            // Set new debounce timer
            debounceTimer = setTimeout(async () => {
                // Define entities to search for
                const entities = ['people', 'films', 'planets'];

                // Dispatch search action for each entity with the search term
                for (const entity of entities) {
                    await store.dispatch('searchEntities', { entity, searchTerm: store.state.search.term });
                }
            }, debounceRate);
        };


        // Compute a function to highlight the search term in text
        const highlightSearchTerm = computed(() => {
            const regex = new RegExp(store.state.search.term, 'gi');
            return (text: string) => text.replace(regex, '<span class="highlight">$&</span>');
        });

        // Get the entity path based on its URL
        const getEntityPath = (url: string) => {
            const path = url.replace('https://swapi.dev/api/', '');
            return `/${path}`;
        };

        // Check if there are search results
        const hasSearchResults = computed(() => Object.keys(store.state.search.results).length > 0);

        // Get and set the search term from/to the store
        const searchTerm = computed({
            get: () => store.state.search.term,
            set: (value) => store.commit('setSearchTerm', value),
        });

        // Clean up search results when component is unmounted
        onBeforeUnmount(() => {
            if (store.state.search.term === '' && Object.keys(store.state.search.results).length > 0) {
                store.commit('setSearchResults', {});
            }
        });

        return {
            searchTerm,
            searchResults: computed(() => store.state.search.results),
            debouncedSearch,
            highlightSearchTerm,
            getEntityPath,
            hasSearchResults,
        };
    },
};
</script>


<style>
.highlight {
    background-color: yellow;
    font-weight: bold;
}
</style>
  
<style scoped>
.search-container {
    position: relative;
    width: 640px;
    margin: 0 auto;
}

.search-container>input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.search-results {
    position: absolute;
    top: calc(100% + 0px);
    left: 0;
    width: 100%;
    background-color: #eee;
    border: 1px solid #ddd;
    border-radius: 0px 0px 4px 4px;
    z-index: 999;
    text-align: left;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.category-results {
    margin-bottom: 20px;
}

h2 {
    margin: 0 0 15px 0;
    text-transform: capitalize;
    background: #ddd;
    padding: 12px;
    font-size: 20px;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0 12px;
}

li {
    margin-bottom: 5px;
    padding: 0px 0px 15px 0px;
}

.result-item {
    cursor: pointer;
}

.view-all-link {
    display: block;
    margin: 5px 12px;
    text-align: right;
}
</style>