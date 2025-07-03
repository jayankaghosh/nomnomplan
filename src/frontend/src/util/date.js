import dayjs from 'dayjs';

export function getWeeksInMonth(year, monthIndex) {
    const startOfMonth = dayjs(new Date(year, monthIndex, 1));
    const endOfMonth = startOfMonth.endOf('month');

    const startDate = startOfMonth.startOf('week'); // Sunday
    const endDate = endOfMonth.endOf('week');       // Saturday

    const weeks = [];
    let current = startDate;
    let weekIndex = 1;

    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push({
                isActive: current.month() === monthIndex,
                date: current.toDate()
            });
            current = current.add(1, 'day');
        }

        weeks.push({
            label: `Week ${weekIndex++}`,
            days: week
        });
    }

    return weeks;
}