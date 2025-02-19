document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const appointmentForm = document.getElementById('appointmentForm');

  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(userForm);
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create user: ' + error.message);
      }
    });
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(appointmentForm);
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create appointment: ' + error.message);
      }
    });
  }
});