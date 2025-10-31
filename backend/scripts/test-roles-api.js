// Simple test script to check roles API
const API_BASE_URL = 'http://localhost:5001/api';

async function testRolesAPI() {
  try {
    console.log('Testing roles API...');
    
    // Test basic roles endpoint
    console.log('\n1. Testing GET /api/roles');
    const rolesResponse = await fetch(`${API_BASE_URL}/roles`);
    console.log('Status:', rolesResponse.status);
    
    if (rolesResponse.ok) {
      const rolesData = await rolesResponse.json();
      console.log('Roles count:', rolesData.roles?.length || 0);
      console.log('Sample role:', rolesData.roles?.[0]?.roleName || 'No roles');
    } else {
      const error = await rolesResponse.text();
      console.log('Error:', error);
    }
    
    // Test stats endpoint
    console.log('\n2. Testing GET /api/roles/stats/overview');
    const statsResponse = await fetch(`${API_BASE_URL}/roles/stats/overview`);
    console.log('Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('Stats:', statsData);
    } else {
      const error = await statsResponse.text();
      console.log('Error:', error);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRolesAPI();