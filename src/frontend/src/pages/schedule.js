import {useUserGuard} from "util/hooks";
import UserLayout from "layout/user";
import Calendar from "components/calendar";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useEffect, useState} from "react";
import {getWeeksInMonth} from "util/date";
import dayjs from 'dayjs';
import {fetchData} from "util/api";
import {getRecipeScheduleQuery} from "query/user";
import Loader from "../components/loader";
import {toast} from "react-toastify";

const Schedule = props => {
    useUserGuard();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedYearAndMonth, setSelectedYearAndMonth] = useState({
        year: currentYear,
        month: currentMonth
    });
    const [weeks, setWeeks] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const years = Array.from({ length: 22 }, (_, i) => currentYear - 20 + i);
    const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

    useEffect(() => {
        const { year, month } = selectedYearAndMonth;
        const currentWeeks = getWeeksInMonth(year, month);
        const from = dayjs(new Date(year, month, 1)).format('YYYY-MM-DD');
        const to = dayjs(new Date(year, month + 1, 0)).format('YYYY-MM-DD');
        const fetchRecipeSchedule = async () => {
            try {
                setIsLoading(true);
                const {getRecipeSchedule: {schedule}} = await fetchData(getRecipeScheduleQuery(), {from, to});
                setSchedule(schedule);
            } catch ({ category, message }) {
                if (category === 'aborted') return;
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRecipeSchedule();
        setWeeks(currentWeeks);
    }, [
        selectedYearAndMonth
    ]);

    const onYearSelect = value => {
        setSelectedYearAndMonth({
            year: value,
            month: 0
        });
    }

    const onMonthSelect = value => {
        setSelectedYearAndMonth({
            year: selectedYearAndMonth.year,
            month: value
        });
    }

    const processSlot = (slot, day) => {
        day = dayjs(day).format('YYYY-MM-DD');
        const { slots = [] } = schedule.find(({ date }) => date === day) || {};
        const currentSlot = slots.find(item => item.slot === slot);
        let slotLabel;
        if (currentSlot) {
            const { slot, recipes } = currentSlot;
            let highestNumberOfPeople = Math.max(...recipes.map(recipe => recipe.number_of_people));
            slotLabel = (
                <Box
                    elevation={3}
                    sx={{
                        p: 2,
                        textAlign: 'center',
                        minHeight: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h6">{slot}</Typography>
                    <Typography variant="body2">
                        {`${recipes.length} recipes for ${highestNumberOfPeople} people`.toUpperCase()}
                    </Typography>
                </Box>
            );
        } else {
            slotLabel = <span>{slot}</span>;
        }
        return {
            isSelected: !!currentSlot,
            label: slotLabel
        }
    }

    const onSlotClick = (slot, day) => {
        console.log(slot, dayjs(day));
    }


    return (
        <UserLayout>
            <Loader isLoading={isLoading} />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    alignItems: 'flex-end'
                }}
            >
                {/* Year Selector */}
                <FormControl
                    sx={{
                        width: {
                            xs: '100%',
                            sm: 'fit-content',
                        }
                    }}
                >
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                        labelId="year-select-label"
                        value={selectedYearAndMonth.year}
                        label="Year"
                        onChange={(e) => onYearSelect(e.target.value)}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Month Selector */}
                <FormControl
                    sx={{
                        width: {
                            xs: '100%',
                            sm: 'fit-content',
                        }
                    }}
                >
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <Select
                        labelId="month-select-label"
                        value={selectedYearAndMonth.month}
                        label="Month"
                        onChange={(e) => onMonthSelect(e.target.value)}
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={index}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {
                weeks.map(({ label, days }) => {
                    return (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{ label }</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Calendar
                                    days={days}
                                    timeSlots={['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']}
                                    processSlot={processSlot}
                                    onSlotClick={onSlotClick}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }

            <Calendar />
        </UserLayout>
    );
}

export default Schedule;