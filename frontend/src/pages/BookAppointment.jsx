import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Phone } from 'lucide-react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    phone: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const { user } = useAuth();

  const { addToast } = useToast();

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // If serviceId is passed via location state
  useEffect(() => {
    if (location.state?.serviceId) {
      setFormData((prev) => ({
        ...prev,
        serviceId: location.state.serviceId,
      }));
    }
  }, [location.state]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/available-slots?date=${formData.date}`
        );
        setAvailableSlots(res.data.availableSlots || []);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        addToast('Failed to load available time slots', 'error');
      }
    };

    fetchSlots();
  }, [formData.date]);

  // Load services from mock API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await axios.get('https://686fae6b91e85fac42a215f6.mockapi.io/services');
        setServices(res.data);
      } catch (error) {
        console.error('Error loading services:', error);
        addToast('Failed to load services', 'error');
      }
    };
    loadServices();
  }, []);


  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      if (!selectedService) {
        addToast('Please select a valid service', 'error');
        setLoading(false);
        return;
      }

      const appointmentData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price,
        date: formData.date,
        time: formData.time,
        phone: formData.phone,
        status: 'pending',
      };
    
      await axios.post('http://localhost:5000/api/appointments', appointmentData);
      addToast('Appointment booked successfully!', 'success');
      navigate('/dashboard');

      // Reset form
      setFormData({
        serviceId: '',
        date: '',
        time: '',
        phone: '',
      });
      setAvailableSlots([]);
    } catch (error) {
      console.error('Booking error:', error);
      addToast('Failed to book appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Book an Appointment
        </h1>
    
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service selection */}
          <div>
            <label className="block mb-1 font-medium">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date selection */}
          <div>
  <label className="block mb-1 font-medium flex items-center">
    <Calendar className="w-4 h-4 mr-2" /> Date
  </label>
  <input
  type="date"
  name="date"
  min={new Date().toISOString().split('T')[0]} // today
  max={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 2 days later
  value={formData.date}
  onChange={handleChange}
  required
/>

</div>


          {/* Time slot selection */}
          <div>
            <label className="block mb-1 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              disabled={!availableSlots.length}
            >
              <option value="">Select a time slot</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Phone number */}
<div>
  <label className="block mb-1 font-medium flex items-center">
    <Phone className="w-4 h-4 mr-2" /> Phone Number
  </label>
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={(e) => {
      const input = e.target.value;
      // Allow only digits
      if (/^\d{0,10}$/.test(input)) {
        setFormData((prev) => ({ ...prev, phone: input }));
      }
    }}
    pattern="\d{10}"
    required
    className="w-full border px-3 py-2 rounded"
    placeholder="Enter 10-digit phone number"
    title="Phone number must be exactly 10 digits"
  />
</div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;






















// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import { useAuth } from '../context/AuthContext';
// import { useToast } from '../context/ToastContext';
// import { Calendar, Clock, Phone } from 'lucide-react';
// import axios from 'axios';
// import { useLocation,useNavigate } from 'react-router-dom';



// const BookAppointment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [services, setServices] = useState([]);
//   const [formData, setFormData] = useState({
//   serviceId: '',
//   date: '',
//   time: '',
//   phone: ''
// });

// useEffect(() => {
//   if (location.state?.serviceId) {
//     setFormData(prev => ({
//       ...prev,
//       serviceId: location.state.serviceId
//     }));
//   }
// }, [location.state]);

//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { addToast } = useToast();
//   const { user, loading: authLoading } = useAuth();
 

 

//   // Minimum date (tomorrow)
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const minDate = tomorrow.toISOString().split('T')[0];

//   // Load services
//   useEffect(() => {
//     const loadServices = async () => {
//       try {
//         const res = await axios.get('https://686fae6b91e85fac42a215f6.mockapi.io/services');
//         setServices(res.data);
//       } catch (error) {
//         console.error('Error loading services:', error);
//         addToast('Failed to load services', 'error');
//       }
//     };
//     loadServices();
//   }, []);

//   // Fetch available slots
//   useEffect(() => {
//     const fetchSlots = async () => {
//       if (!formData.date) return;

//       try {
//         const res = await axios.get(`http://localhost:5000/api/appointments/available-slots?date=${formData.date}`);
//         setAvailableSlots(res.data.availableSlots || []);
//       } catch (err) {
//         console.error('Failed to fetch slots:', err);
//         addToast('Failed to load available time slots', 'error');
//       }
//     };

//     fetchSlots();
//   }, [formData.date]);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);



//     try {
//       const selectedService = services.find(s => s.id === formData.serviceId);
//       if (!selectedService) {
//         addToast('Please select a valid service', 'error');
//         return;
//       }

//       const appointmentData = {
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         serviceId: selectedService.id,
//         serviceName: selectedService.name,
//         price: selectedService.price,
//         date: formData.date,
//         time: formData.time,
//         phone: formData.phone,
//         status: 'pending'
//       };

//       if (!user || !user._id) {
//   addToast('User not loaded yet. Please try again.', 'error');
//   return;
// }


//       await axios.post('http://localhost:5000/api/appointments', appointmentData);
//       console.log(appointmentData)
//       navigate('/dashboard')
//       addToast('Appointment booked successfully!', 'success');

//       setFormData({
//         serviceId: '',
//         date: '',
//         time: '',
//         phone: ''
//       });
//       setAvailableSlots([]);
//     } catch (error) {
//       console.error('Booking error:', error);
//       addToast('Failed to book appointment', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || !user) {
//   return (
//     <div className="min-h-screen flex items-center justify-center text-gray-600">
//       Loading your profile...
//     </div>
//   );
// }


//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <Navbar />
//       <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6 text-center">Book an Appointment</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Service selection */}
//           <div>
//             <label className="block mb-1 font-medium">Service</label>
//             <select
//               name="serviceId"
//               value={formData.serviceId}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Select a service</option>
//               {services.map(service => (
//                 <option key={service.id} value={service.id}>
//                   {service.name} - ₹{service.price}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date selection */}
//           <div>
//   <label className="block mb-1 font-medium flex items-center">
//     <Calendar className="w-4 h-4 mr-2" /> Date
//   </label>
//   <input
//   type="date"
//   name="date"
//   min={new Date().toISOString().split('T')[0]} // today
//   max={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 2 days later
//   value={formData.date}
//   onChange={handleChange}
//   required
// />

// </div>


//           {/* Time slot selection */}
//           <div>
//             <label className="block mb-1 font-medium flex items-center">
//               <Clock className="w-4 h-4 mr-2" /> Time
//             </label>
//             <select
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               disabled={!availableSlots.length}
//             >
//               <option value="">Select a time slot</option>
//               {availableSlots.map(slot => (
//                 <option key={slot} value={slot}>
//                   {slot}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Phone number */}
// <div>
//   <label className="block mb-1 font-medium flex items-center">
//     <Phone className="w-4 h-4 mr-2" /> Phone Number
//   </label>
//   <input
//     type="tel"
//     name="phone"
//     value={formData.phone}
//     onChange={(e) => {
//       const input = e.target.value;
//       // Allow only digits
//       if (/^\d{0,10}$/.test(input)) {
//         setFormData((prev) => ({ ...prev, phone: input }));
//       }
//     }}
//     pattern="\d{10}"
//     required
//     className="w-full border px-3 py-2 rounded"
//     placeholder="Enter 10-digit phone number"
//     title="Phone number must be exactly 10 digits"
//   />
// </div>


//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
//           >
//             {loading ? 'Booking...' : 'Book Appointment'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;