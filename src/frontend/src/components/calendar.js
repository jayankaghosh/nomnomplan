import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

const Calendar = ({
    days = [],
    timeSlots = [],
    onSlotClick = (slot, day) => {},
    processSlot = (slot, day) => ({ isActive: false, label: slot }),
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columnWidth = isMobile ? '40%' : '1fr';

    return (
        <Box sx={{ width: 'calc(100vw - (2*40px))', overflowX: 'auto' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${days.length}, ${columnWidth})`,
                    gap: 1,
                    minWidth: columnWidth,
                }}
            >
                {days.map(({ isActive, date: day }) => (
                    <Box
                        key={day}
                        sx={{
                            pointerEvents: isActive ? 'auto' : 'none',
                            opacity: isActive ? 'inherit' : '0.3',
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase' }}
                        >
                            { dayjs(day).format('Do (ddd)') }
                        </Typography>
                        {
                            timeSlots.map((slot) => {
                                const {
                                    isSelected = false,
                                    label = slot
                                } = processSlot(slot, day);

                                return (
                                    <Paper
                                        key={slot}
                                        elevation={2}
                                        sx={{
                                            p: 1,
                                            mb: 1,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? 'primary.main' : 'background.paper',
                                            color: isSelected ? 'primary.contrastText' : 'text.primary',
                                            border: '1px solid',
                                            borderColor: isSelected ? 'primary.dark' : 'divider',
                                        }}
                                        onClick={() => onSlotClick(slot, day)}
                                    >
                                        {label}
                                    </Paper>
                                );
                            })
                        }
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Calendar;
