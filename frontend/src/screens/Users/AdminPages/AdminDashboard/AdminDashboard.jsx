import React, { useState, useEffect } from 'react';

function AdminDashboardPage() {

  return (

    
<div className="grid grid-cols-3 grid-rows-5 gap-4 pt-10 px-4">
    <div className='border'>1</div>
    <div className='border'>2</div>
    <div className='border'>3</div>
    <div className="col-span-2 row-span-4 border">4</div>
    <div className="row-span-2 col-start-3 border">7</div>
    <div className="row-span-2 col-start-3 row-start-4 border">9</div>
</div>
    

  );
}

export default AdminDashboardPage;
