import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment); // required for the calendar

function CalendarPage() {

    const [events, setEvents] = useState([]);

    const fetchTrainings = () => {
        const getTrainingsAPIEndpoint = process.env.REACT_APP_API_GETTRAININGS_URL;
        fetch(getTrainingsAPIEndpoint)
            .then(response => response.json())
            .then(data => {
                const events = data.map(training => {
                    const startDate = new Date(training.date);
                    const endDate = new Date(startDate.getTime() + training.duration * 60 * 1000);
                    return {
                        id: training.id,
                        title: `${training.activity} (${training.customer.firstname} ${training.customer.lastname})`,
                        start: startDate,
                        end: endDate
                    }
                });
                setEvents(events);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => fetchTrainings(), []);

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{height:600}}
            step={60}
            timeslots={1}
            dayLayoutAlgorithm="no-overlap"
        />
    );
}

export default CalendarPage;
