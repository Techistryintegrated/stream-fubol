'use client';
import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, addDays, subDays } from 'date-fns';

interface DateSelectorProps {
  onDateChange?: (date: Date) => void;
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const updateDate = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    onDateChange?.(date);
    setIsCalendarOpen(false); // Close calendar after selection
  };

  return (
    <div className="flex justify-between items-center mt-8 mb-8 text-white text-sm relative">
      <ChevronLeft
        className="cursor-pointer"
        onClick={() => updateDate(subDays(selectedDate, 1))}
      />

      <div>{format(selectedDate, 'EEEE, dd MMMM')}</div>

      <div className="flex gap-2 items-center">
        <ChevronRight
          className="cursor-pointer"
          onClick={() => updateDate(addDays(selectedDate, 1))}
        />

        <div className="relative">
          <CalendarDays
            className="cursor-pointer"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
          />

          {isCalendarOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <DatePicker
                selected={selectedDate}
                onChange={updateDate}
                inline
                calendarClassName="rounded-xl bg-[#000] text-white shadow-lg p-4"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
