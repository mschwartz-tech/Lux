// Function to fetch and render trainer availability
async function fetchTrainerAvailability() {
  try {
    const response = await fetch('/api/scheduling/availability');
    const availabilities = await response.json();
    renderTrainerSchedule(availabilities);
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
}

// Function to fetch and render member bookings
async function fetchMemberBookings() {
  try {
    const response = await fetch('/api/scheduling/bookings');
    const bookings = await response.json();
    renderMemberBookings(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
}

// Function to delete trainer availability
async function deleteAvailability(availabilityId) {
  try {
    const response = await fetch(`/api/scheduling/availability/${availabilityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok && data.message === 'Availability deleted successfully') {
      const availabilityElement = document.getElementById(`availability-${availabilityId}`);
      if (availabilityElement) {
        availabilityElement.remove();
      }
    } else {
      alert(data.message || 'Failed to delete availability');
    }
  } catch (error) {
    console.error('Error deleting availability:', error);
    alert('An error occurred while deleting the availability');
  }
}

// Function to delete a booking
async function deleteBooking(bookingId) {
  try {
    const response = await fetch(`/api/scheduling/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok && data.message === 'Booking deleted successfully') {
      const bookingElement = document.getElementById(`booking-${bookingId}`);
      if (bookingElement) {
        bookingElement.remove();
      }
    } else {
      alert(data.message || 'Failed to delete booking');
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('An error occurred while deleting the booking');
  }
}

// Render trainer schedule with delete buttons
function renderTrainerSchedule(availabilities) {
  const scheduleDiv = document.getElementById('trainer-schedule');
  if (!scheduleDiv) return;
  scheduleDiv.innerHTML = '';
  availabilities.forEach(avail => {
    const availElement = document.createElement('div');
    availElement.id = `availability-${avail._id}`;
    availElement.innerHTML = `
      <p>${avail.day} ${avail.startTime} - ${avail.endTime}</p>
      <button onclick="deleteAvailability('${avail._id}')">Delete</button>
    `;
    scheduleDiv.appendChild(availElement);
  });
}

// Render member bookings with delete buttons
function renderMemberBookings(bookings) {
  const bookingsDiv = document.getElementById('member-bookings');
  if (!bookingsDiv) return;
  bookingsDiv.innerHTML = '';
  bookings.forEach(booking => {
    const bookingElement = document.createElement('div');
    bookingElement.id = `booking-${booking._id}`;
    bookingElement.innerHTML = `
      <p>Session with ${booking.trainer.name} on ${booking.date} at ${booking.time}</p>
      <button onclick="deleteBooking('${booking._id}')">Cancel Booking</button>
    `;
    bookingsDiv.appendChild(bookingElement);
  });
}

// Fetch and display user profile
async function fetchProfile() {
  try {
    const response = await fetch('/api/users/me', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const user = await response.json();
    if (response.ok) {
      const profileDetails = document.getElementById('profile-details');
      profileDetails.innerHTML = `
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
      `;
      document.getElementById('profile-name').value = user.name;
      document.getElementById('profile-email').value = user.email;
    } else {
      alert(user.message || 'Failed to load profile');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    alert('An error occurred while fetching your profile');
  }
}

// Update user profile
async function updateProfile(event) {
  event.preventDefault();
  const name = document.getElementById('profile-name').value;
  const email = document.getElementById('profile-email').value;
  const password = document.getElementById('profile-password').value;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;

  try {
    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (response.ok) {
      alert('Profile updated successfully');
      fetchProfile(); // Refresh profile display
    } else {
      alert(data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating your profile');
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchTrainerAvailability();
  fetchMemberBookings();

  // Handle profile form submission
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', updateProfile);
  }

  // Fetch profile when settings section is loaded
  const settingsLink = document.querySelector('a[data-section="settings"]');
  if (settingsLink) {
    settingsLink.addEventListener('click', () => {
      fetchProfile();
    });
  }
});