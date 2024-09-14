import React, { useState, useEffect } from 'react';

function AdminDashboardPage() {

  return (
    <div className='h-screen pt-5 sm:columns-2 md:columns-2'>
      <div className='container p-2 h-full bg-red-400 sm:bg-black sm:columns-1 md:bg-slate-500'>a
        <div className='m-5 bg-blue-100'>first</div>
        <div className='m-5 bg-red-100'>second</div>
      </div>
      <div className='bg-black text-white  sm:bg-black md:bg-slate-800'>b
      </div>
    </div>
  );
}

export default AdminDashboardPage;
