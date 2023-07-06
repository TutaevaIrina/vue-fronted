import { shallowMount } from '@vue/test-utils';
import CalendarView from '@/components/CalendarView.vue';
import axios from 'axios';
import moment from "moment";

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] }),
}));

describe('CalendarView', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('renders correctly', () => {
        const wrapper = shallowMount(CalendarView);
        const footer = wrapper.find('footer');
        expect(footer.exists()).toBe(true);
    });

    it('fetches tasks on created', () => {
        shallowMount(CalendarView);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/tasks');
    });

    it('closes day details when a day without tasks is clicked', async () => {
        const tasks = [];
        axios.get.mockResolvedValueOnce({ data: tasks });

        const wrapper = shallowMount(CalendarView);
        await wrapper.vm.$nextTick();

        const dayButton = wrapper.find('.day-button');
        dayButton.trigger('click');
        await wrapper.vm.$nextTick();

        const selectedDay = wrapper.vm.selectedDay;
        expect(selectedDay).toBeNull();
        expect(wrapper.vm.openDetails).toBe(false);
    });
    it('renders the correct number of task points for a day', async () => {
        const tasks = [
            { name: 'Task 1', deadline: '2023-07-01' },
            { name: 'Task 2', deadline: '2023-07-01' },

        ];
        axios.get.mockResolvedValueOnce({ data: tasks });

        const wrapper = shallowMount(CalendarView);
        await wrapper.vm.$nextTick();

        const dayButton = wrapper.find('.day-button');
        dayButton.trigger('click');
        await wrapper.vm.$nextTick();

        const taskPoints = wrapper.findAll('.task-point');
        expect(taskPoints.length).toBe(2); // Update the expected value to 2
    });

    it('updates the current month when next month button is clicked', () => {
        const wrapper = shallowMount(CalendarView);
        const nextButton = wrapper.find('.btn-primary.next');
        nextButton.trigger('click');
        const expectedMonth = moment().month() +2 ;
        console.log(expectedMonth)
        expect(wrapper.vm.current.month() + 1).toBe(expectedMonth);
    });



    it('updates the current month when prev month button is clicked', () => {
        const wrapper = shallowMount(CalendarView);
        const prevButton = wrapper.find('.btn-primary.mr-2');
        prevButton.trigger('click');
        expect(wrapper.vm.current.month()).toBe(moment().month() - 1);
    });



});
