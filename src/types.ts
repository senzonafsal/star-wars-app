// Interface to represent a person
export interface Person {
	name: string;
	gender: string;
	birth_year: string;
	height: string;
	mass: string;
}

// Interface to represent search results
export interface SearchResults {
	[key: string]: any[];
}

// Interface to represent the root state of the application
export interface RootState {
	search: {
		term: string;
		results: SearchResults;
	};
	people: Person[];
	totalPeopleCount: number;
	itemsPerPage: number;
}
