import axios from "axios";

const baseURL = "https://swapi.dev/api";

const api = axios.create({
	baseURL,
});

// Function to search for entities based on entity type and search term
export async function searchEntities(entityType: string, searchTerm: string) {
	try {
		// Send a GET request to the API with the specified entity type and search term as parameters
		const response = await api.get(`/${entityType}`, {
			params: {
				search: searchTerm,
			},
		});
		return response.data.results;
	} catch (error) {
		// If an error occurs, log the error message and throw the error
		console.error(`Error searching ${entityType}:`, error);
		throw error;
	}
}

// Function to fetch people from the API based on page and items per page
export async function fetchPeople(page: number, itemsPerPage: number) {
	try {
		// Send a GET request to the API to fetch people with the specified page and items per page as parameters
		const response = await api.get("people", {
			params: {
				page: page,
				per_page: itemsPerPage,
			},
		});
		return response.data;
	} catch (error) {
		// If an error occurs, log the error message and throw the error
		console.error("Error fetching people:", error);
		throw error;
	}
}
