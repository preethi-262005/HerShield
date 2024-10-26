import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import VideoStream from './Components/VideoStream';
import Header from './Components/Header';
import Footer from './Components/Footer';

const App = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div style={{ flex: '1' }}> {/* Flex-grow to occupy remaining space */}
                <VideoStream />
            </div>
            <Footer />
        </div>
    );
};

export default App;
