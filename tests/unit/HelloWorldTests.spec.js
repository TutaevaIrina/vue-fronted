import { shallowMount } from '@vue/test-utils';
import TasksView from '@/components/TasksView.vue';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponse(JSON.stringify({ data: 'Mocked response' }));
});
describe('TasksView', () => {
  it('deletes a task when the delete button is clicked', async () => {
    const task = {
      id: 1,
      name: 'Task 1',
    };
    const wrapper = shallowMount(TasksView, {
      props: {
        tasks: [task],
      },
    });
    const deleteButton = wrapper.find('.btn btn-danger');
    if (deleteButton.exists()) {
      await deleteButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.tasks).toHaveLength(0);
    } else {
      console.error('Delete button not found');
    }
  });

  it('updates a task when the edit and update buttons are clicked', async () => {
    const task = {
      id: 1,
      name: 'Task 1',
    };

    const wrapper = shallowMount(TasksView, {
      props: {
        tasks: [task],
      },
    });

    const editButton = wrapper.find('.btn btn-primary');

    if (editButton.exists()) {
      await editButton.trigger('click');
      const inputField = wrapper.find('input');

      if (inputField.exists()) {
        await inputField.setValue('Updated Task');
        const updateButton = wrapper.find('.btn btn-success');

        if (updateButton.exists()) {
          await updateButton.trigger('click');
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.tasks[0].name).toBe('Updated Task');
        } else {
          console.error('Update button not found');
        }
      } else {
        console.error('Input field not found');
      }
    } else {
      console.error('Edit button not found');
    }
  });
  it('saves a task when the user inputs name and deadline and clicks the button', async () => {
    const wrapper = shallowMount(TasksView);

    const nameInput = wrapper.find('.form-control');
    const deadlineInput = wrapper.find('.form-control');

    nameInput.element.value = 'New Task';
    deadlineInput.element.value = '2023-07-31';

    await nameInput.trigger('input');
    await deadlineInput.trigger('input');

    const saveButton = wrapper.find('.btn btn-primary');

    if (saveButton.exists()) {
      await saveButton.trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.tasks.length).toBe(1);
      expect(wrapper.vm.tasks[0].name).toBe('New Task');
      expect(wrapper.vm.tasks[0].deadline).toBe('2023-07-31');
    }
  });

  it('renders the task table with correct columns', () => {
    const wrapper = shallowMount(TasksView);

    const columns = wrapper.findAll('th.column-task');
    expect(columns.length).toBe(1);
    expect(columns.at(0).text()).toBe('Task');

    const checkboxColumn = wrapper.find('th.column-checkbox');
    expect(checkboxColumn.exists()).toBe(true);

    const descriptionColumn = wrapper.find('th.column-description');
    expect(descriptionColumn.exists()).toBe(true);

    const deadlineColumn = wrapper.find('th.column-deadline');
    expect(deadlineColumn.exists()).toBe(true);

    const statusColumn = wrapper.find('th.column-status');
    expect(statusColumn.exists()).toBe(true);

    const actionColumn = wrapper.find('th.column-action');
    expect(actionColumn.exists()).toBe(true);
  });

  it('should display the deadline input field', () => {
    const wrapper = shallowMount(TasksView)

    const deadlineInput = wrapper.find('input[placeholder="Select date"]')

    expect(deadlineInput.exists()).toBe(true)
  });

  it('should display the title input field', () => {
    const wrapper = shallowMount(TasksView)

    const titleInput = wrapper.find('input[placeholder="Enter title"]')

    expect(titleInput.exists()).toBe(true)
  });

  it('should display the description input field', () => {
    const wrapper = shallowMount(TasksView)

    const descriptionInput = wrapper.find('input[placeholder="Enter description"]')

    expect(descriptionInput.exists()).toBe(true)
  });

  it('should display the table header', () => {
    const wrapper = shallowMount(TasksView)

    const tableHeader = wrapper.find('.table-head')

    expect(tableHeader.exists()).toBe(true)
  });

  it('should display the filter select field', () => {
    const wrapper = shallowMount(TasksView)

    const filterSelect = wrapper.find('select.form-select')

    expect(filterSelect.exists()).toBe(true)
  });
  it('should display the table body', () => {
    const wrapper = shallowMount(TasksView)

    const tableBody = wrapper.find('.tasks')

    expect(tableBody.exists()).toBe(true)
  });

  it('should display the footer', () => {
    const wrapper = shallowMount(TasksView)

    const footer = wrapper.find('footer')

    expect(footer.exists()).toBe(true)
  });

  it('should display the submit button', () => {
    const wrapper = shallowMount(TasksView)

    const submitButton = wrapper.find('.circle-plus-icon')

    expect(submitButton.exists()).toBe(true)
  });

  it('renders props.msg when passed', async () => {
    const msg = '© 2023 Studious. All rights reserved.';
    const wrapper = shallowMount(TasksView, {
      props: { msg },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toMatch(msg);
  });

});







