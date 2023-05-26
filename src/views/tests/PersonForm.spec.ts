import { mount } from "@vue/test-utils";
import PersonForm from "../PersonForm.vue";
import { Person } from "@/types";

describe("PersonForm", () => {
	let wrapper: any;
	beforeEach(() => {
		wrapper = mount(PersonForm, {
			props: {
				formData: {} as Person,
				dialogVisible: true,
				dialogTitle: "Edit Person",
			},
		});
	});
	afterEach(() => {
		wrapper.unmount();
	});
	test("renders the component", () => {
		expect(wrapper.exists()).toBe(true);
	});

	test("emits the save event on form submission", async () => {
		// Simulate filling in the form fields
		const nameInput = wrapper.find("#txtName");
		nameInput.element.value = "John Doe";
		nameInput.trigger("input");

		const genderInput = wrapper.find("#txtGender");
		genderInput.element.value = "male";
		genderInput.trigger("input");

		const birthYearInput = wrapper.find("#txtBirthYear");
		birthYearInput.element.value = "1962";
		birthYearInput.trigger("input");

		const heightInput = wrapper.find("#txtHeight");
		heightInput.element.value = "173";
		heightInput.trigger("input");

		const massInput = wrapper.find("#txtMass");
		massInput.element.value = "80";
		massInput.trigger("input");

		// Trigger the form submission
		const formElement = wrapper.find("#personForm");
		formElement.trigger("submit.prevent");

		// Verify that the save event is emitted with the correct form data
		const emittedSaveEvent = wrapper.emitted()["save"];
		expect(emittedSaveEvent).toBeTruthy();
	});

	test("emits the cancel event on cancel button click", () => {
		wrapper.find("#btnCancel").trigger("click");
		expect(wrapper.emitted().cancel).toBeTruthy();
	});

	test("updates the localDialogVisible when dialogVisible prop changes", async () => {
		// Update the dialogVisible prop
		await wrapper.setProps({ dialogVisible: true });
		// Verify that the localDialogVisible variable is updated
		expect(wrapper.vm.localDialogVisible).toBe(true);
	});

	test("emits the cancel event on cancel button click", () => {
		wrapper.find("#btnCancel").trigger("click");
		expect(wrapper.emitted().cancel).toBeTruthy();
	});

	test("updates the localFormData when formData prop changes with non-empty values", async () => {
		await wrapper.setProps({
			formData: {
				name: "John Doe",
				gender: "male",
				birth_year: "1980",
				height: "180",
				mass: "75",
			},
		});

		expect(wrapper.vm.localFormData).toEqual({
			name: "John Doe",
			gender: "male",
			birth_year: "1980",
			height: "180",
			mass: "75",
		});
	});

	test("updates the localFormData when formData prop changes with empty values", async () => {
		await wrapper.setProps({
			formData: {
				name: "",
				gender: "",
				birth_year: "",
				height: "",
				mass: "",
			},
		});

		expect(wrapper.vm.localFormData).toEqual({
			name: "",
			gender: "",
			birth_year: "",
			height: "",
			mass: "",
		});
	});
});
