import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Save } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AdminSlots = () => {
  const [slotData, setSlotData] = useState([]);
  const [slotInterval, setSlotInterval] = useState(60); // in minutes
  const { addToast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/slots`);
      const enriched = res.data.map(slot => {
        const times = Array.isArray(slot.timeSlots) ? slot.timeSlots.flat() : [];
        const start = times[0] || '09:00';
        const last = times[times.length - 1] || '17:00';

        let [lh, lm] = last.split(':').map(Number);
        lm += slotInterval;
        if (lm >= 60) {
          lh += Math.floor(lm / 60);
          lm = lm % 60;
        }
        const end = `${lh.toString().padStart(2, '0')}:${lm.toString().padStart(2, '0')}`;

        return {
          ...slot,
          start,
          end: times.length ? end : '18:00'
        };
      });

      setSlotData(enriched);
    } catch (err) {
      console.error('Error loading slots:', err);
      addToast('Error loading slots', 'error');
    }
  };

  const generateTimeSlots = (start, end, interval) => {
    const slots = [];
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let current = new Date(0, 0, 0, sh, sm);
    const endTime = new Date(0, 0, 0, eh, em);

    while (current < endTime) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

 const handleTimeChange = (index, field, value) => {
  const updated = [...slotData];
  updated[index][field] = value;

  const { start, end } = updated[index];
  updated[index].timeSlots = generateTimeSlots(start, end, slotInterval);

  setSlotData(updated);
};


  const updateTimeSlots = (index) => {
    const updated = [...slotData];
    const { start, end } = updated[index];
    updated[index].timeSlots = generateTimeSlots(start, end, slotInterval);
    setSlotData(updated);
  };

  const saveSlotChanges = async () => {
    try {
      const payload = slotData.map(({ date, timeSlots }) => ({
        date,
        timeSlots
      }));

      await axios.put(`${backendUrl}/api/slots`, payload);
      addToast('Slot data updated successfully', 'success');
      fetchSlots();
    } catch (err) {
      console.error('Save error:', err);
      addToast('Failed to save slots', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Slot Management</h1>
          <button
            onClick={saveSlotChanges}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>

        <div className="space-y-6">
          {slotData.map((slot, index) => (
            <div key={slot.date} className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{slot.date}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => updateTimeSlots(index)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Time Slots</h3>
                <div className="flex flex-wrap gap-2">
                  {slot.timeSlots?.length > 0 ? (
                    slot.timeSlots.map((time, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                      >
                        {time}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No slots generated</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSlots;