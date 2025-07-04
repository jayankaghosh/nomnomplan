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
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Dialog, IconButton, TextField, Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, {useEffect, useState} from "react";
import {getWeeksInMonth} from "util/date";
import dayjs from 'dayjs';
import {fetchData} from "util/api";
import {getRecipeScheduleQuery, getSetRecipeScheduleMutation} from "query/user";
import Loader from "components/loader";
import {toast} from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import {ucwords} from "util/stdlib";
import {search} from "util/algolia";
import {extractFormData} from "util/form";
import DeleteIcon from "@mui/icons-material/Delete";
import AsyncSelect from "components/async-select";
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {prepareData} from "../util/planner-document";


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
    const [selectedSlot, setSelectedSlot] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSchedulePopupOpen, setIsSchedulePopupOpen] = useState(false);
    const [canShare, setCanShare] = useState(false);

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

    useEffect(() => {
        if (navigator.share && navigator.canShare) {
            // Optional: simulate with a dummy file to check file support
            const dummyFile = new File(['dummy'], 'dummy.pdf', { type: 'application/pdf' });
            if (navigator.canShare({ files: [dummyFile] })) {
                setCanShare(true);
            }
        }
    }, []);

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
        setIsSchedulePopupOpen(true);
        const selectedDay = schedule.find(item => item.date === dayjs(day).format('YYYY-MM-DD'));
        const selectedSlotData = {
            slot,
            day,
            recipes: []
        }
        if (selectedDay) {
            const selectedSlots = selectedDay.slots.find(({slot: selectedDaySlot}) => selectedDaySlot === slot);
            console.log(selectedSlots, selectedDay.slots, slot)
            if (selectedSlots) {
                selectedSlotData.recipes = selectedSlots.recipes;
            }
        }
        setSelectedSlot(selectedSlotData);
    }

    const onSchedulePopupClose = (e, reason) => {
        if (reason === 'backdropClick') return;
        setIsSchedulePopupOpen(false);
    }

    const onScheduleFormSubmit = async e => {
        e.preventDefault();
        const data = extractFormData(e.target);
        const recipes = [];
        Object.keys(data.id).forEach(id => {
            const item = {
                number_of_people: data['number_of_people'][id] ? parseInt(data['number_of_people'][id]) : 1,
                recipe_id: data['recipe_id'][id] ? parseInt(data['recipe_id'][id]) : null,
            }
            if (!id.startsWith('tmp_')) {
                item.id = parseInt(id);
            }
            recipes.push(item);
        });
        try {
            const { slot, day } = selectedSlot;
            setIsLoading(true);
            const { year, month } = selectedYearAndMonth;
            const from = dayjs(new Date(year, month, 1)).format('YYYY-MM-DD');
            const to = dayjs(new Date(year, month + 1, 0)).format('YYYY-MM-DD');
            const {setRecipeSchedule: {response: {schedule}}} = await fetchData(
                getSetRecipeScheduleMutation(),
                {
                    date: dayjs(day).format('YYYY-MM-DD'),
                    slot,
                    from,
                    to,
                    recipe_schedule: recipes
                });
            setSchedule(schedule);
            onSchedulePopupClose();
        } catch ({ category, message }) {
            if (category === 'aborted') return;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    const onRecipeAdd = () => {
        setSelectedSlot({
            ...selectedSlot,
            recipes: [
                ...selectedSlot.recipes,
                {
                    id: `tmp_${new Date().getTime()}`,
                    number_of_people: 1
                }
            ]
        });
    }

    const onRecipeEdit = (id, { model }) => {
        const index = selectedSlot.recipes.map(item => item.id).indexOf(id);
        const recipes = [...selectedSlot.recipes];
        if (index !== -1) {
            recipes[index] = {
                ...recipes[index],
                recipe: model
            };
        } else {
            recipes.push({
                id,
                number_of_people: 1,
                recipe: model
            });
        }
        setSelectedSlot({
            ...selectedSlot,
            recipes
        })
    }

    const onRecipeDelete = id => {
        const index = selectedSlot.recipes.map(item => item.id).indexOf(id);
        const recipes = [...selectedSlot.recipes];
        if (index !== -1) {
            recipes.splice(index, 1);
        }
        setSelectedSlot({
            ...selectedSlot,
            recipes
        })
    }

    const onRecipeSearch = async query => {
        const hits = await search('recipe', query);
        return hits.map(hit => ({
            value: hit.id,
            label: ucwords(hit.name),
            model: hit
        }))
    }

    const prepareDocument = () => {
        return prepareData(schedule);
    }


    const onDownload = () => {
        const document = prepareDocument();
        document.save(`Grocery-List-${dayjs().format('YYYY-MM-DD')}.pdf`);
    }

    const onShare = () => {
        const document = prepareDocument();
        const blob = document.output('blob');
        const file = new File([blob], 'Grocery-List.pdf', { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: 'Weekly Grocery List',
                text: 'Here is the grocery list for the week.',
                files: [file]
            });
        }
    }

    return (
        <UserLayout>
            <Loader isLoading={isLoading} />
            <Dialog open={isSchedulePopupOpen}
                    onClose={onSchedulePopupClose}
                    fullWidth
                    maxWidth="sm"
                    disableEscapeKeyDown={true}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {`${ucwords(selectedSlot.slot || '')} of ${dayjs(selectedSlot.day).format('dddd, MMMM D, YYYY')}`}
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={onSchedulePopupClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box component="form" onSubmit={onScheduleFormSubmit}>
                    <DialogContent dividers>
                        {
                            selectedSlot.recipes?.map(recipe => {
                                const id = recipe.id.toString();
                                return (
                                    <Box noValidate autoComplete="off" key={id}>
                                        <input type="hidden" name={`id[${id}]`} value={recipe.id} />
                                        <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
                                            <Box flex={1}>
                                                {
                                                    recipe?.recipe ? (
                                                        <>
                                                            <input type="hidden" name={`recipe_id[${id}]`} value={recipe?.recipe?.id} />
                                                            <TextField
                                                                label="Recipe"
                                                                name={`name[${id}]`}
                                                                type="text"
                                                                value={ucwords(recipe?.recipe?.name || '')}
                                                                fullWidth
                                                                disabled={true}
                                                                margin="normal"
                                                            />
                                                        </>
                                                    ) : (
                                                        <AsyncSelect
                                                            label={'Recipe'}
                                                            value={ucwords(recipe?.recipe?.name || '')}
                                                            name={`name[${id}]`}
                                                            onChange={(val) => onRecipeEdit(id, val)}
                                                            fetchOptions={onRecipeSearch}
                                                            initialOptions={[]}
                                                            fullWidth
                                                            margin="normal"
                                                            autocomplete='off'
                                                        />
                                                    )
                                                }
                                            </Box>
                                            <Box flex={1}>
                                                <TextField
                                                    label="People"
                                                    name={`number_of_people[${id}]`}
                                                    type="number"
                                                    defaultValue={recipe?.number_of_people}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                            </Box>
                                            <Box flex={1}>
                                                <IconButton
                                                    onClick={() => {onRecipeDelete(id)}}
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                        <Button variant="outlined" onClick={onRecipeAdd}>
                            Add Recipe
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSchedulePopupClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>
                </Box>
            </Dialog>
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
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={onDownload}
                >
                    Download
                </Button>
                {
                    canShare && (
                        <Button
                            variant="contained"
                            startIcon={<ShareIcon />}
                            onClick={onShare}
                        >
                            Share
                        </Button>
                    )
                }
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
        </UserLayout>
    );
}

export default Schedule;