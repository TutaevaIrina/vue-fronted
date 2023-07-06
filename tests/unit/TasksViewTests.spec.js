import { shallowMount, flushPromises } from '@vue/test-utils';
import TasksView from '@/components/TasksView.vue';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();


describe('TasksView', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should render the task table with correct columns', async () => {
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

  it('should display the deadline input field', async () => {
    const wrapper = shallowMount(TasksView);

    const deadlineInput = wrapper.find('input[placeholder="Select date"]');

    expect(deadlineInput.exists()).toBe(true);
  });

  it('should display the title input field', async () => {
    const wrapper = shallowMount(TasksView);

    const titleInput = wrapper.find('input[placeholder="Enter title"]');

    expect(titleInput.exists()).toBe(true);
  });

  it('should display the description input field', async () => {
    const wrapper = shallowMount(TasksView);

    const descriptionInput = wrapper.find('input[placeholder="Enter description"]');

    expect(descriptionInput.exists()).toBe(true);
  });

  it('should display the table header', async () => {
    const wrapper = shallowMount(TasksView);

    const tableHeader = wrapper.find('.table-head');

    expect(tableHeader.exists()).toBe(true);
  });

  it('should display the filter select field', async () => {
    const wrapper = shallowMount(TasksView);

    const filterSelect = wrapper.find('select.form-select');

    expect(filterSelect.exists()).toBe(true);
  });

  it('should display the table body', async () => {
    const wrapper = shallowMount(TasksView);

    const tableBody = wrapper.find('.tasks');

    expect(tableBody.exists()).toBe(true);
  });

  it('should display the footer', async () => {
    const wrapper = shallowMount(TasksView);

    const footer = wrapper.find('footer');

    expect(footer.exists()).toBe(true);
  });

  it('should display the submit button', async () => {
    const wrapper = shallowMount(TasksView);

    const submitButton = wrapper.find('.circle-plus-icon');

    expect(submitButton.exists()).toBe(true);
  });

  it('should delete a task when the delete button is clicked', async () => {
    const wrapper = shallowMount(TasksView);

    const deleteButton = wrapper.find('.btn.btn-danger');
    if (deleteButton.exists()) {
      await deleteButton.trigger('click');
    }

    await flushPromises();
    expect(wrapper.vm.tasks).toHaveLength(0);
  });

  it('should render props.msg when passed', async () => {
    const msg = '© 2023 Studious. All rights reserved.';
    const wrapper = shallowMount(TasksView, {
      props: { msg },
    });
    await flushPromises();
    expect(wrapper.text()).toMatch(msg);
  });
});
