
export const getWeeksInMonth = (year, month) => {
    const weeks = [];
    const date = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    let weekIndex = 1;
    let currentWeek = [];

    for (let day = 1; day <= lastDate; day++) {
        const currentDate = new Date(year, month, day);
        currentWeek.push(currentDate);

        // If Saturday or last day of month, close the current week
        if (currentDate.getDay() === 6 || day === lastDate) {
            weeks.push({
                label: `Week ${weekIndex++}`,
                days: currentWeek
            });
            currentWeek = [];
        }
    }

    return weeks;
};
