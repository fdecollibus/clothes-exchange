import axios from 'axios';

const createAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/create-admin', {
      email: 'admin@admin.ch',
      password: '123456789'
    });
    
    console.log('Admin user created:', response.data);
  } catch (error) {
    console.error('Error creating admin user:', error.response?.data || error.message);
  }
};

createAdmin(); 