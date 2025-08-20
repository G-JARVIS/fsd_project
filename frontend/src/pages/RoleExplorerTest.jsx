import React from "react";

export default function RoleExplorerTest() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Role Explorer Test</h1>
      <p>If you can see this, the basic component is working.</p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <p>Next steps:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>Check browser console for errors</li>
          <li>Verify backend is running on port 5001</li>
          <li>Run: <code>cd backend && npm run seed-roles</code></li>
          <li>Test API: <code>curl http://localhost:5001/api/roles</code></li>
        </ol>
      </div>
    </div>
  );
}