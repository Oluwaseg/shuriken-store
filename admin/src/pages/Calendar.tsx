import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface Event {
  id: number;
  title: string;
  date: Date;
}

const mockEvents: Event[] = [
  { id: 1, title: 'Team Meeting', date: new Date(2023, 6, 15, 10, 0) },
  { id: 2, title: 'Project Deadline', date: new Date(2023, 6, 20, 18, 0) },
  { id: 3, title: 'Client Call', date: new Date(2023, 6, 18, 14, 30) },
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>(mockEvents);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className='h-24 md:h-32'></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayEvents = events.filter(
        (event) =>
          event.date.getDate() === day &&
          event.date.getMonth() === currentDate.getMonth() &&
          event.date.getFullYear() === currentDate.getFullYear()
      );

      days.push(
        <div
          key={day}
          className='h-24 md:h-32 border border-border-light dark:border-border-dark p-1 overflow-hidden'
        >
          <div className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
            {day}
          </div>
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className='text-xs bg-accent-light dark:bg-accent-dark text-white p-1 mt-1 rounded truncate'
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className='flex-1 overflow-hidden bg-body-light dark:bg-body-dark p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0'>
          <h1 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
            Calendar
          </h1>
          <div className='flex items-center space-x-4'>
            <button
              onClick={prevMonth}
              className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
            >
              <FaChevronLeft />
            </button>
            <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
            >
              <FaChevronRight />
            </button>
          </div>
          <button className='bg-button-primary-light dark:bg-button-primary-dark text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200'>
            <FaPlus />
            <span>Add Event</span>
          </button>
        </div>
        <div className='grid grid-cols-7 gap-2 mb-2'>
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className='font-semibold text-center text-text-secondary-light dark:text-text-secondary-dark'
            >
              {day}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-7 gap-2'>{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
