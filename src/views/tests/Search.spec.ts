import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import SearchPage from "../Search.vue";

const store = createStore({
	state: {
		search: {
			results: {},
			term: "",
		},
		people: [],
		totalPeopleCount: 0,
		itemsPerPage: 0,
	},
});

describe("SearchPage", () => {
	let wrapper: any;

	beforeEach(() => {
		store.dispatch = jest.fn();
		store.commit = jest.fn();
		jest.useFakeTimers();
		wrapper = mount(SearchPage, {
			global: {
				plugins: [store],
			},
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		wrapper.unmount();
	});

	it("renders the search input field correctly", () => {
		const searchInput = wrapper.find("#txtSearch");
		expect(searchInput.exists()).toBe(true);
		expect(searchInput.element.value).toBeUndefined;
	});

	it("updates the search term when input is entered", async () => {
		const searchInput = wrapper.find("#txtSearch");
		searchInput.element.value = "L";
		searchInput.trigger("input");

		await wrapper.vm.$nextTick();

		jest.advanceTimersByTime(200); // Advance timers by 200ms

		await wrapper.vm.$nextTick();

		await wrapper.vm.debouncedSearch(); // Trigger debouncedSearch explicitly
		expect(store.dispatch).toHaveBeenCalled();
		expect(store.dispatch).toHaveBeenCalledTimes(3); // Expect three dispatch calls
	});
	it("renders search results when there are results available", async () => {
		// Set search results in the store
		const results = {
			people: [
				{
					name: "Luke Skywalker",
					url: "https://swapi.dev/api/people/1/",
				},
			],
			films: [],
			planets: [],
		};
		store.state.search.results = results;

		// Wait for search results to be rendered
		await wrapper.vm.$nextTick();

		const searchResults = wrapper.find("#searchResults");
		expect(searchResults.exists()).toBe(true);

		const categoryResults = searchResults.findAll(".category-results");
		expect(categoryResults.length).toBe(Object.keys(results).length);

		const resultItems = searchResults.findAll(".result-item");
		expect(resultItems.length).toBe(1);

		const viewAllLink = searchResults.find(".view-all-link");
		expect(viewAllLink.exists()).toBe(true);
	});
	it("renders highlighted search term in search results", async () => {
		// Set search results in the store
		const results = {
			people: [
				{
					name: "Luke Skywalker",
					url: "https://swapi.dev/api/people/1/",
				},
			],
		};
		store.state.search.results = results;
		store.state.search.term = "Luke";

		// Wait for search results to be rendered
		await wrapper.vm.$nextTick();

		const resultItem = wrapper.find(".result-item");
		expect(resultItem.html()).toContain(
			'<span class="highlight">Luke</span>'
		);
	});
});
