import React from 'react';

function Header() {
    return (
        <div style={{
            width: '100%', // Full width
            minHeight: '10vh', // Minimum height
            backgroundColor: 'black',
            display: 'flex', // Use flexbox for alignment
            justifyContent: 'center', // Center items horizontally
            alignItems: 'center', // Center items vertically
            padding: '0 20px', // Optional: Add some padding
            boxSizing: 'border-box' // Include padding in width calculations
        }}>
            <img
                src="https://i.pinimg.com/474x/2f/25/86/2f2586ce5414c9156ce271cd1da17b93.jpg"
                alt="Logo"
                style={{ width: '50px', height: '50px', marginRight: '10px' }} // Adjust size and margin
            />
            <h1 className='text-danger' style={{ margin: 0 }}>HER SHIELD</h1>
        </div>
    );
}

export default Header;
