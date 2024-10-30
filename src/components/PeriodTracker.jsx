import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Settings, Droplets, RefreshCcw, Waves, Space, Apple, AudioLines } from 'lucide-react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import SpaceButton from './Button/SpaceButton';

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [markedDates, setMarkedDates] = useState([]);
  const [lockedDates, setLockedDates] = useState([]);
  const [showSetup, setShowSetup] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const today = new Date();

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) return;

      const userDoc = doc(db, 'periodData', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCycleLength(data.cycleLength || 28);
        setPeriodLength(data.periodLength || 5);
        setLockedDates(data.lockedDates?.map(d => new Date(d)) || []);
        setShowSetup(!data.hasSetup);
      }
    };

    loadUserData();
  }, [auth.currentUser]);

  // Save to Firebase
  const saveToFirebase = async (newLockedDates = lockedDates) => {
    if (!auth.currentUser) return;

    const userDoc = doc(db, 'periodData', auth.currentUser.uid);
    await setDoc(userDoc, {
      cycleLength,
      periodLength,
      lockedDates: newLockedDates.map(d => d.toISOString()),
      hasSetup: true,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    setShowSetup(false);
  };

  // Get calendar data for current month
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay();

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Calculate predicted period dates (±3 days)
  const getPredictedDates = () => {
    if (lockedDates.length === 0) return [];

    const lastPeriod = new Date(Math.max(...lockedDates.map(d => d.getTime())));
    const predictions = [];

    // Calculate next expected period start
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    // Add dates 3 days before and after predicted start
    for (let i = -1; i <= 1; i++) {
      const predictedDate = new Date(nextPeriod);
      predictedDate.setDate(predictedDate.getDate() + i);
      predictions.push(predictedDate);
    }

    return predictions;
  };

  const toggleDate = (date) => {
    if (!date || !isEditing) return;

    const dateStr = date.toDateString();
    if (markedDates.some(d => d.toDateString() === dateStr)) {
      setMarkedDates(markedDates.filter(d => d.toDateString() !== dateStr));
    } else {
      setMarkedDates([...markedDates, date]);
    }
  };

  const lockPeriod = async () => {
    const newLockedDates = [...lockedDates, ...markedDates];
    setLockedDates(newLockedDates);
    setMarkedDates([]);
    setIsEditing(false);
    await saveToFirebase(newLockedDates);
  };

  const startNewPeriod = () => {
    setIsEditing(true);
    setMarkedDates([]);
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

  const isDateLocked = (date) => {
    return date && lockedDates.some(d => d.toDateString() === date.toDateString());
  };

  const isPredicted = (date) => {
    return date && getPredictedDates().some(d => d.toDateString() === date.toDateString());
  };

  const isOngoingPeriod = (date) => {
    if (lockedDates.length === 0 || !date) return false;

    const lastLockedDate = new Date(Math.max(...lockedDates.map(d => d.getTime())));
    const endOngoingPeriod = new Date(lastLockedDate);
    endOngoingPeriod.setDate(lastLockedDate.getDate() + periodLength - 1);

    return date >= lastLockedDate && date <= endOngoingPeriod;
  };

  const getOvulationDays = () => {
    if (lockedDates.length === 0) return []; // No locked dates yet
    
    const lastPeriodDate = new Date(Math.max(...lockedDates.map(d => d.getTime())));
    const midCycleDay = Math.floor(cycleLength / 2);
    
    return [
      new Date(lastPeriodDate.setDate(lastPeriodDate.getDate() + midCycleDay - 1)), // 13th day
      new Date(lastPeriodDate.setDate(lastPeriodDate.getDate() + 1)), // 14th day
      new Date(lastPeriodDate.setDate(lastPeriodDate.getDate() + 1)), // 15th day
    ];
  };
  
  // Add `isOvulation` to check if a date falls within ovulation days
  const isOvulation = (date) => {
    return date && getOvulationDays().some(d => d.toDateString() === date.toDateString());
  };

  return (
    <div className="md:max-w-3xl mx-auto p-6 bg-pale-yellow rounded-lg shadow-lg">
    {/* Show DaisyUI Modal when showSetup is true */}
    {showSetup && (
        <div className="modal modal-open shadow-xl">
          <div className="modal-box relative bg-white-skyblue font-clash">
            <button
              onClick={() => setShowSetup(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2 font-bold"
            >✕</button>
            <h3 className="font-bold text-2xl flex items-center justify-center gap-2"><AudioLines/>Setup Your Cycle<AudioLines/></h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-lg flex items-center justify-center gap-2  text-white font-semibold"><Droplets/>Period Length (days)</label>
                <input
                  type="number"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                  className="input input-bordered w-full focus:ring-2 focus:ring-white text-white font-bold text-2xl font-mono"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="text-lg flex items-center justify-center gap-2 text-white font-semibold"><RefreshCcw/>Cycle Length (days)</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="input input-bordered w-full focus:ring-2 focus:ring-white text-white font-bold text-2xl font-mono"
                  min="21"
                  max="35"
                />
              </div>
              <SpaceButton
                onClick={() => {
                  setShowSetup(false);
                  saveToFirebase();
                }}
                text="Start Tracking"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl text-lg font-bold">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="md:flex md:space-x-4 items-center">
          <button
            onClick={() => setShowSetup(true)}
            className="p-2 hover:bg-gray-100 rounded flex items-center gap-2"
          >
            <Settings className="md:w-5 md:h-5 w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 font-clash">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium md:text-xl py-2 md:font-semibold">
            {day}
          </div>
        ))}

        {getCalendarDays().map((date, index) => {
          const isToday = date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

      return (
          <button
            key={index}
            onClick={() => toggleDate(date)}
            className={`
              aspect-square p-2 rounded-lg flex items-center justify-center relative md:font-semibold md:text-xl inset-shadow max-sm:rounded-lg
              ${date ? 'hover:bg-lavender-purple' : ''}
              ${isDateMarked(date) ? 'bg-green-500 text-white' : ''}
              ${isToday ? 'border-4 border-lavender-purple' : ''} 
              ${isDateLocked(date) ? 'bg-purple-500 text-white' : ''}
              ${isPredicted(date) ? 'bg-red-dark text-white' : ''}
              ${isOngoingPeriod(date) ? 'bg-red-semidark text-white' : ''} 
              ${isOvulation(date) ? 'bg-skyblue text-white' : ''}
              ${!isEditing ? 'cursor-default' : ''}
            `}
            disabled={!date || !isEditing}
          >
            {date ? date.getDate() : ''}
            {isDateLocked(date) && (
              <Lock className="md:size-5 size-2 absolute md:bottom-3 bottom-2 right-3" />
            )}
            {isOngoingPeriod(date) && (
              <Waves className="md:size-5 size-2 absolute md:bottom-3 bottom-2 right-3 text-white" />
            )}
            {isPredicted(date) && (
              <Droplets className="md:size-5 size-2 absolute md:bottom-3 bottom-2 right-3 text-white" />
            )}
            {isOvulation(date) && (
              <Apple className="md:size-5 size-2 absolute md:bottom-3 bottom-2 right-3 text-white" />
            )}
          </button>
      );
        })}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-semidark rounded-xl mr-2"></div>
            <span className="text-sm">Current Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-skyblue rounded-xl mr-2"></div>
            <span className="text-sm">Ovulation</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-dark rounded-xl mr-2"></div>
            <span className="text-sm">Predicted (±3 days)</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {isEditing ? (
            <SpaceButton
            text='Lock period'
              onClick={lockPeriod}
              disabled={markedDates.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            </SpaceButton>
          ) : (
            <SpaceButton
            text='Track New Period'
              onClick={startNewPeriod}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
            </SpaceButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;