import { createStore } from "vuex";
import { searchEntities, fetchPeople } from "@/api";
import { Person, RootState, SearchResults } from "@/types";

export default createStore<RootState>({
	state: {
		search: {
			results: {},
			term: "",
		},
		people: [],
		totalPeopleCount: 0,
		itemsPerPage: 0,
	},
	mutations: {
		// Mutation to set the search results
		setSearchResults(state, results) {
			const key = Object.keys(results)[0];
			if (key) {
				state.search.results[key] = results[key];
			} else {
				state.search.results = {};
			}
		},
		// Mutation to set the search term
		setSearchTerm(state, term) {
			state.search.term = term;
		},
		// Mutation to set the people array, total count, and items per page
		setPeople(state, { people, totalPeopleCount, page, itemsPerPage }) {
			const startIndex = (page - 1) * itemsPerPage;
			people.forEach((person: Person, index: number) => {
				state.people[startIndex + index] = person;
			});
			state.totalPeopleCount = totalPeopleCount;
			state.itemsPerPage = itemsPerPage;
		},
		// Mutation to delete a person from the people array
		deletePerson(state, person) {
			state.people = state.people.filter((p) => p !== person);
			state.totalPeopleCount--;
		},
		// Mutation to create a new person and add it to the beginning of the people array
		createPerson(state, person) {
			state.people.unshift(person);
			state.totalPeopleCount++;
		},
		// Mutation to update a person in the people array
		updatePerson(state, updatedPerson) {
			const index = state.people.findIndex(
				(person) => person.name === updatedPerson.name
			);
			if (index !== -1) {
				state.people.splice(index, 1, updatedPerson);
			}
		},
	},
	actions: {
		// Action to search entities based on the entity type and search term
		async searchEntities({ commit }, { entity, searchTerm }) {
			if (searchTerm && searchTerm.length > 0) {
				const response = await searchEntities(entity, searchTerm);
				const results: SearchResults = { [entity]: response };
				commit("setSearchResults", results);
				return response;
			} else {
				commit("setSearchResults", {});
			}
		},
		// Action to fetch people from the API based on the page number and items per page
		async fetchPeople({ commit }, { page, itemsPerPage }) {
			try {
				const response = await fetchPeople(page, itemsPerPage);
				const people: Person[] = response.results;
				const totalPeopleCount = response.count;
				commit("setPeople", {
					people,
					totalPeopleCount,
					page,
					itemsPerPage,
				});
				return response;
			} catch (error) {
				console.error("Error fetching people:", error);
				throw error;
			}
		},
		// Action to create a new person
		async createPerson({ commit }, person: Person) {
			commit("createPerson", person);
		},
		// Action to update a person
		async updatePerson({ commit }, person: Person) {
			commit("updatePerson", person);
		},
	},
});
