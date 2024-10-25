import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [markedDates, setMarkedDates] = useState([]);
  const [showSetup, setShowSetup] = useState(true);

  // Get calendar data for current month
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay();
    
    // Add padding for start of month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Calculate predicted period dates
  const getPredictedDates = (startDate) => {
    const predictions = [];
    let currentDate = new Date(startDate);
    
    // Calculate next 3 cycles
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < periodLength; j++) {
        predictions.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // Move to next cycle start
      currentDate.setDate(currentDate.getDate() + (cycleLength - periodLength));
    }
    
    return predictions;
  };

  const toggleDate = (date) => {
    if (!date) return;
    
    const dateStr = date.toDateString();
    if (markedDates.some(d => d.toDateString() === dateStr)) {
      setMarkedDates(markedDates.filter(d => d.toDateString() !== dateStr));
    } else {
      setMarkedDates([...markedDates, date]);
    }
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const isDateMarked = (date) => {
    return date && markedDates.some(d => d.toDateString() === date.toDateString());
  };

  const isPredicted = (date) => {
    if (!date || markedDates.length === 0) return false;
    const predictions = getPredictedDates(markedDates[markedDates.length - 1]);
    return predictions.some(d => d.toDateString() === date.toDateString());
  };

  if (showSetup) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Setup Your Cycle</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Period Length (days)</label>
            <input
              type="number"
              value={periodLength}
              onChange={(e) => setPeriodLength(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cycle Length (days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="21"
              max="35"
            />
          </div>
          <button
            onClick={() => setShowSetup(false)}
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Start Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        
        {getCalendarDays().map((date, index) => (
          <button
            key={index}
            onClick={() => toggleDate(date)}
            className={`
              aspect-square p-2 rounded-lg flex items-center justify-center
              ${date ? 'hover:bg-gray-100' : ''}
              ${isDateMarked(date) ? 'bg-pink-500 text-white hover:bg-pink-600' : ''}
              ${isPredicted(date) ? 'bg-pink-200 hover:bg-pink-300' : ''}
            `}
            disabled={!date}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
          <span className="text-sm">Period Days</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-pink-200 rounded mr-2"></div>
          <span className="text-sm">Predicted Days</span>
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;