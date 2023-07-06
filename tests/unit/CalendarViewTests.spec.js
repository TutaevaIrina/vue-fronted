import { shallowMount, flushPromises } from '@vue/test-utils';
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

    it('should render correctly', async () => {
        const wrapper = shallowMount(CalendarView);
        const footer = wrapper.find('footer');
        expect(footer.exists()).toBe(true);
    });

    it('should fetch tasks on created', async () => {
        shallowMount(CalendarView);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/tasks');
    });

    it('should close day details when a day without tasks is clicked', async () => {
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
    it('should render the correct number of task points for a day', async () => {
        const tasks = [
            { name: 'Task 1', deadline: '2023-07-01' },
            { name: 'Task 2', deadline: '2023-07-01' },
        ];
        axios.get.mockResolvedValueOnce({ data: tasks });

        const wrapper = shallowMount(CalendarView);
        await flushPromises();

        const dayButton = wrapper.find('.day-button');
        dayButton.trigger('click');
        await flushPromises();

        const taskPoints = wrapper.findAll('.task-point');
        expect(taskPoints.length).toBe(2);
    });

    it('should render the correct month and year', async () => {
        const wrapper = shallowMount(CalendarView);
        const monthYearText = wrapper.find('h1').text();
        const expectedMonthYear = moment().format('MMMM YYYY');
        expect(monthYearText).toBe(expectedMonthYear);
    });


    const NextButtonStub = {
        template: '<button class="btn-primary next" @click="nextMonth"></button>',
        methods: {
            nextMonth() {
            },
        },
    };

    it('should update the current month when next month button is clicked', async () => {
        const wrapper = shallowMount(CalendarView, {
            stubs: {
                '.btn-primary.next': NextButtonStub,
            },
        });
        await wrapper.find('.btn-primary.next').trigger('click');
        const expectedMonth = moment().month() + 2;
        expect(wrapper.vm.current.month() + 1).toBe(expectedMonth);
    });

    const PrevButtonStub = {
        template: '<button class="btn-primary mr-2" @click="prevMonth"></button>',
        methods: {
            prevMonth() {
            },
        },
    };
    it('should update the current month when previous month button is clicked', async () => {
        const wrapper = shallowMount(CalendarView, {
            stubs: {
                '.btn-primary.mr-2': PrevButtonStub,
            },
        });
        await wrapper.find('.btn-primary.mr-2').trigger('click');
        await wrapper.vm.$nextTick();

        const expectedMonth = moment().month();
        expect(wrapper.vm.current.month() + 1).toBe(expectedMonth);
    });


    it('should mark the current day as active', async () => {
        const wrapper = shallowMount(CalendarView);
        const currentDay = wrapper.find('.today');
        const expectedCurrentDay = moment().date();
        expect(currentDay.text()).toBe(expectedCurrentDay.toString());
    });


});
