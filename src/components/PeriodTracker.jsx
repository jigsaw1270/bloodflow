import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Settings, Droplets, RefreshCcw } from 'lucide-react';
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

  if (showSetup) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg font-clash">
        <h2 className="text-2xl font-bold mb-6">Setup Your Cycle</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xl font-medium mb-2 flex items-center justify-center gap-2"><Droplets/>Period Length (days)</label>
            <input
              type="number"
              value={periodLength}
              onChange={(e) => setPeriodLength(parseInt(e.target.value))}
              className="w-full p-2 border rounded-xl focus:outline-deep-purple"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="text-xl font-medium mb-2 flex items-center justify-center gap-2"><RefreshCcw/>Cycle Length (days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="w-full p-2 border rounded-xl focus:outline-deep-purple"
              min="21"
              max="35"
            />
          </div>
          <SpaceButton
            onClick={() => {
              setShowSetup(false);
              saveToFirebase();
            }}
            text='Start Tracking'
            // className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors"
          >
          </SpaceButton>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-3xl mx-auto p-6 bg-pale-yellow rounded-lg shadow-lg">
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
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        
        {getCalendarDays().map((date, index) => (
          <button
            key={index}
            onClick={() => toggleDate(date)}
            className={`
              aspect-square p-2 rounded-lg flex items-center justify-center relative
              ${date ? 'hover:bg-gray-100' : ''}
              ${isDateMarked(date) ? 'bg-pink-500 text-white hover:bg-pink-600' : ''}
              ${isDateLocked(date) ? 'bg-purple-500 text-white' : ''}
              ${isPredicted(date) ? 'bg-red-600 hover:bg-red-200' : ''}
              ${!isEditing ? 'cursor-default' : ''}
            `}
            disabled={!date || !isEditing}
          >
            {date ? date.getDate() : ''}
            {isDateLocked(date) && (
              <Lock className="w-3 h-3 absolute bottom-1 right-1" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
            <span className="text-sm">Current Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm">Locked Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span className="text-sm">Predicted (±3 days)</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {isEditing ? (
            <button
              onClick={lockPeriod}
              disabled={markedDates.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              Lock Period
            </button>
          ) : (
            <button
              onClick={startNewPeriod}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              <Unlock className="w-4 h-4" />
              Track New Period
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;