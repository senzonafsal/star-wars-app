import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import PeopleList from '../PeopleList.vue';

// Mock the Vuex store
const store = createStore({
    state: {
        search: {
            results: {},
            term: "",
        },
        people: [
            { name: 'Luke Skywalker', gender: 'male', birth_year: '19BBY', height: '172', mass: '77' },
            { name: 'Leia Organa', gender: 'female', birth_year: '19BBY', height: '150', mass: '49' },
            { name: 'Obi-Wan Kenobi', gender: 'male', birth_year: '57BBY', height: '182', mass: '77' },
            { name: 'Anakin Skywalker', gender: 'male', birth_year: '41.9BBY', height: '188', mass: '84' },
            { name: 'Padmé Amidala', gender: 'female', birth_year: '46BBY', height: '165', mass: '45' },
            { name: 'Qui-Gon Jinn', gender: 'male', birth_year: '92BBY', height: '193', mass: '89' },
            { name: 'Mace Windu', gender: 'male', birth_year: '72BBY', height: '188', mass: '84' },
            { name: 'Yoda', gender: 'male', birth_year: '896BBY', height: '66', mass: '17' },
            { name: 'Darth Maul', gender: 'male', birth_year: '54BBY', height: '175', mass: '80' },
            { name: 'Count Dooku', gender: 'male', birth_year: '102BBY', height: '193', mass: '86' },
            { name: 'General Grievous', gender: 'male', birth_year: 'unknown', height: '216', mass: '159' },
            { name: 'Rey Skywalker', gender: 'female', birth_year: 'unknown', height: '170', mass: 'unknown' },
            { name: 'Finn', gender: 'male', birth_year: 'unknown', height: 'unknown', mass: 'unknown' },
            { name: 'Poe Dameron', gender: 'male', birth_year: 'unknown', height: 'unknown', mass: 'unknown' },
            { name: 'Kylo Ren', gender: 'male', birth_year: 'unknown', height: 'unknown', mass: 'unknown' },
            { name: 'BB-8', gender: 'unknown', birth_year: 'unknown', height: 'unknown', mass: 'unknown' },
            { name: 'R2-D2', gender: 'n/a', birth_year: '33BBY', height: '96', mass: '32' },
            { name: 'C-3PO', gender: 'n/a', birth_year: '112BBY', height: '167', mass: '75' },
            { name: 'Han Solo', gender: 'male', birth_year: '29BBY', height: '180', mass: '80' },
            { name: 'Chewbacca', gender: 'male', birth_year: '200BBY', height: '228', mass: '112' },
            { name: 'Lando Calrissian', gender: 'male', birth_year: '31BBY', height: '177', mass: '79' },
            { name: 'Boba Fett', gender: 'male', birth_year: '31.5BBY', height: '183', mass: '78.2' },
            { name: 'Jabba Desilijic Tiure', gender: 'hermaphrodite', birth_year: '600BBY', height: '175', mass: '1,358' },
            { name: 'Wedge Antilles', gender: 'male', birth_year: '21BBY', height: '170', mass: '77' },
            { name: 'Darth Sidious', gender: 'male', birth_year: '82BBY', height: '170', mass: 'unknown' },
        ],
        totalPeopleCount: 26,
        itemsPerPage: 10,
    },
    actions: {
        fetchPeople: jest.fn(),
        createPerson: jest.fn(),
        updatePerson: jest.fn(),
    },
    mutations: {
        deletePerson: jest.fn(),
    },
});

describe('PeopleList', () => {
    let wrapper:any;
    beforeEach(() => {
        store.dispatch = jest.fn();
        store.commit = jest.fn();
        wrapper = mount(PeopleList, {
            global: {
                plugins: [store]
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    test('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    test('calls fetchPeople when mounted', () => {
        expect(store.dispatch).toHaveBeenCalledWith('fetchPeople', {
            page: 1,
            itemsPerPage: wrapper.vm.itemsPerPage,
        });
    });

    test('calls deletePerson when delete icon is clicked', async () => {
        const deleteIcon = wrapper.find('#deleteButton');
        await deleteIcon.trigger('click');

        // Introduce a delay using a setTimeout promise
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(store.commit).toHaveBeenCalledWith('deletePerson', expect.any(Object));
    });

    test('opens the dialog when create button is clicked', async () => {
        const createButton = wrapper.find('#createButton');
        await createButton.trigger('click');
        expect(wrapper.vm.dialogVisible).toBe(true);
    });

    test('displays the correct dialog title when editing a person', async () => {
        const editIcon = wrapper.find('#editButton');
        await editIcon.trigger('click');
        expect(wrapper.vm.dialogTitle).toBe('Edit Person');
    });

    test('displays the correct number of people', () => {
        const people = wrapper.vm.displayedPeople;
        expect(people.length).toBe(store.state.itemsPerPage);
    });

    test('displays the correct number of rows in the table', async () => {
        const rows = wrapper.findAll('#dataTable transition-group-stub tr');
        expect(rows.length).toBe(wrapper.vm.displayedPeople.length);
      });

    test('displays the correct person data in each row', () => {
        const rows = wrapper.findAll('#dataTable transition-group-stub tr');
        const people = store.state.people;
        rows.forEach((row: any, index:number) => {
            const person = people[index];
            const name = row.find('td:nth-child(1)').text();
            const gender = row.find('td:nth-child(2)').text();
            const birthYear = row.find('td:nth-child(3)').text();
            const height = row.find('td:nth-child(4)').text();
            const mass = row.find('td:nth-child(5)').text();
            expect(name).toBe(person.name);
            expect(gender).toBe(person.gender);
            expect(birthYear).toBe(person.birth_year);
            expect(height).toBe(person.height);
            expect(mass).toBe(person.mass);
        });
    });
});
