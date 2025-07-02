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
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useEffect, useState} from "react";
import {getWeeksInMonth} from "util/date";
import dayjs from 'dayjs';

const Schedule = props => {
    useUserGuard();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedYearAndMonth, setSelectedYearAndMonth] = useState({
        year: currentYear,
        month: currentMonth
    });
    const [weeks, setWeeks] = useState([]);

    const years = Array.from({ length: 22 }, (_, i) => currentYear - 20 + i);
    const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

    useEffect(() => {
        const { year, month } = selectedYearAndMonth;
        const currentWeeks = getWeeksInMonth(year, month);
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
        return {
            isActive: false,
            label: slot
        }
    }

    const onSlotClick = (slot, day) => {
        console.log(slot, dayjs(day));
    }


    return (
        <UserLayout>
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
                                <Typography>
                                    <Calendar
                                        days={days}
                                        timeSlots={['Morning', 'Afternoon', 'Evening', 'Night']}
                                        processSlot={processSlot}
                                        onSlotClick={onSlotClick}
                                    />
                                </Typography>
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