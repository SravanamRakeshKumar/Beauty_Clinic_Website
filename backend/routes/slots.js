const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET next 3-days slots
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    const dates = [0, 1, 2].map(i => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const existing = await Slot.find({ date: { $in: dates } }).lean();
    const missing = dates.filter(d => !existing.find(e => e.date === d));
    const defaults = missing.map(date => ({ date, timeSlots: [] }));

    if (defaults.length > 0) {
      await Slot.insertMany(defaults);
    }

    const fullData = [...existing, ...defaults].sort((a, b) => a.date.localeCompare(b.date));
    res.json(fullData);
  } catch (err) {
    console.error('Slot fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update slots
router.put('/', async (req, res) => {
  try {
    const updates = req.body; // [{ date, timeSlots }]
    for (const item of updates) {
      if (!item.date || !Array.isArray(item.timeSlots)) continue;
      await Slot.findOneAndUpdate(
        { date: item.date },
        { $set: { timeSlots: item.timeSlots } },
        { upsert: true }
      );
    }

    res.json({ message: 'Slots updated successfully' });
  } catch (err) {
    console.error('Slot update error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;








// // backend/routes/slots.js

// const express = require('express');
// const router = express.Router();
// const Slot = require('../models/Slot');
// const { adminAuth } = require('../middleware/auth');

// // GET next 3-days slots
// router.get('/', adminAuth, async (req, res) => {
//   try {
//     const today = new Date();
//     const dates = [0, 1, 2].map(i => {
//       const d = new Date(today);
//       d.setDate(today.getDate() + i);
//       return d.toISOString().split('T')[0];
//     });

//     const slots = await Slot.find({ date: { $in: dates } }).lean();
//     res.json(slots);
//   } catch (err) {
//     console.error('Error loading slots:', err);
//     res.status(500).json({ message: 'Failed to load slots' });
//   }
// });

// // PUT update slots for each day
// router.put('/', adminAuth, async (req, res) => {
//   try {
//     const updates = req.body; // array of { date, timeSlots }

//     for (const { date, timeSlots } of updates) {
//       if (!date || !Array.isArray(timeSlots)) continue;
//       await Slot.findOneAndUpdate(
//         { date },
//         { date, timeSlots },
//         { upsert: true }
//       );
//     }

//     res.json({ message: 'Updated' });
//   } catch (err) {
//     console.error('Error updating slots:', err);
//     res.status(500).json({ message: 'Failed to update slots' });
//   }
// });

// module.exports = router;










// const express = require('express');
// const router = express.Router();
// const Slot = require('../models/Slot');
// const { adminAuth } = require('../middleware/auth');

// // GET next 3-days slots
// router.get('/', adminAuth, async (req, res) => {
//   const today = new Date();
//   const dates = [0,1,2].map(i => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     return d.toISOString().split('T')[0];
//   });
//   const slots = await Slot.find({ date: { $in: dates } }).lean();
//   const missing = dates.filter(d => !slots.find(s => s.date === d));
//   // initialize defaults for missing
//   const defaults = missing.map(d => ({
//     date: d,
//     start: '09:00',
//     end: '18:00',
//     timeSlots: []
//   }));
//   await Slot.insertMany(defaults);
//   res.json([...slots, ...defaults]);
// });

// // PUT update all slots
// router.put('/', adminAuth, async (req, res) => {
//   const updates = req.body; // array
//   for (const s of updates) {
//     const { date, start, end, timeSlots } = s;
//     if (!date || !timeSlots?.length) continue;
//     await Slot.findOneAndUpdate({ date }, { start, end, timeSlots }, { upsert: true });
//   }
//   res.json({ message: 'Updated' });
// });

// module.exports = router;




















// const express = require('express');
// const router = express.Router();
// const Slot = require('../models/Slot');
// const { adminAuth } = require('../middleware/auth');

// // Get all slot data for next 3 days
// router.get('/', async (req, res) => {
//   try {
//     const today = new Date();
//     const dates = [];

//     for (let i = 0; i < 3; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       dates.push(date.toISOString().split('T')[0]);
//     }

//     const slots = await Slot.find({ date: { $in: dates } });

//     res.json(slots);
//   } catch (error) {
//     console.error('Error fetching slots:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update slot time list for a specific date
// router.put('/:date', adminAuth, async (req, res) => {
//   try {
//     const { date } = req.params;
//     const { timeSlots } = req.body;

//     if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
//       return res.status(400).json({ message: 'Invalid or empty timeSlots array' });
//     }

//     const updated = await Slot.findOneAndUpdate(
//       { date },
//       { date, timeSlots },
//       { upsert: true, new: true }
//     );

//     res.json({ message: 'Slot list updated successfully', slot: updated });
//   } catch (error) {
//     console.error('Error updating slot:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get available slots for a specific date
// router.get('/available/:date', async (req, res) => {
//   try {
//     const { date } = req.params;
//     const slot = await Slot.findOne({ date });

//     res.json({ availableSlots: slot?.timeSlots || [] });
//   } catch (error) {
//     console.error('Error fetching available slots:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;









// const express = require('express');
// const Slot = require('../models/Slot');
// const { adminAuth } = require('../middleware/auth');

// const router = express.Router();

// // Get working hours and slot configuration (admin only)
// router.get('/config', adminAuth, async (req, res) => {
//   try {
//     // Mock configuration - in real app, this would be stored in database
//     const config = {
//       workingHours: {
//         monday: { start: '09:00', end: '18:00', isOpen: true },
//         tuesday: { start: '09:00', end: '18:00', isOpen: true },
//         wednesday: { start: '09:00', end: '18:00', isOpen: true },
//         thursday: { start: '09:00', end: '18:00', isOpen: true },
//         friday: { start: '09:00', end: '18:00', isOpen: true },
//         saturday: { start: '10:00', end: '16:00', isOpen: true },
//         sunday: { start: '10:00', end: '16:00', isOpen: false }
//       },
//       slotInterval: 30,
//       breakTimes: [
//         { id: 1, start: '12:00', end: '13:00', title: 'Lunch Break' }
//       ],
//       blockedDates: []
//     };

//     res.json(config);
//   } catch (error) {
//     console.error('Get slot config error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update working hours and slot configuration (admin only)
// router.put('/config', adminAuth, async (req, res) => {
//   try {
//     const { workingHours, slotInterval, breakTimes, blockedDates } = req.body;

//     // In a real app, you would save this configuration to database
//     // For now, we'll just return success
    
//     res.json({
//       message: 'Slot configuration updated successfully',
//       config: {
//         workingHours,
//         slotInterval,
//         breakTimes,
//         blockedDates
//       }
//     });
//   } catch (error) {
//     console.error('Update slot config error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get available slots for a specific date
// router.get('/available/:date', async (req, res) => {
//   try {
//     const { date } = req.params;
//     const queryDate = new Date(date);

//     // Get all slots for the date
//     const slots = await Slot.find({ date: queryDate });
    
//     // Generate time slots based on working hours
//     const timeSlots = [
//       '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
//       '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
//       '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
//     ];

//     // Filter out booked or blocked slots
//     const bookedTimes = slots
//       .filter(slot => !slot.isAvailable || slot.isBlocked)
//       .map(slot => slot.time);

//     const availableSlots = timeSlots.filter(time => !bookedTimes.includes(time));

//     res.json({ availableSlots });
//   } catch (error) {
//     console.error('Get available slots error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Block specific time slots (admin only)
// router.post('/block', adminAuth, async (req, res) => {
//   try {
//     const { date, time, reason } = req.body;

//     const slot = await Slot.findOneAndUpdate(
//       { date: new Date(date), time },
//       {
//         isBlocked: true,
//         blockReason: reason || 'Blocked by admin',
//         isAvailable: false
//       },
//       { upsert: true, new: true }
//     );

//     res.json({
//       message: 'Slot blocked successfully',
//       slot
//     });
//   } catch (error) {
//     console.error('Block slot error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Unblock specific time slots (admin only)
// router.post('/unblock', adminAuth, async (req, res) => {
//   try {
//     const { date, time } = req.body;

//     const slot = await Slot.findOneAndUpdate(
//       { date: new Date(date), time },
//       {
//         isBlocked: false,
//         blockReason: '',
//         isAvailable: true,
//         appointmentId: null
//       },
//       { new: true }
//     );

//     if (!slot) {
//       return res.status(404).json({ message: 'Slot not found' });
//     }

//     res.json({
//       message: 'Slot unblocked successfully',
//       slot
//     });
//   } catch (error) {
//     console.error('Unblock slot error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;