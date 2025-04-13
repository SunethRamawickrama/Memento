// utils/api.ts
export async function getProfile() {
    const token = localStorage.getItem('token');
  
    const res = await fetch('http://localhost:5000/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Unauthorized');
  
    return await res.json();
  }
  