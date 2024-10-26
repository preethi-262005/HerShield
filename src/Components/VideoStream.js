import React, { useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import './VideoStream.css';

const locations = [
    'Banjara Hills',
    'Jubilee Hills',
    'Gachibowli',
    'Hitech City',
    'Kondapur',
    'Madhapur',
    'KPHB',
    'Sainikpuri',
    'Secunderabad',
    'LB Nagar',
    'Miyapur',
    'Dilsukhnagar',
    'Himayat Nagar',
];

const VideoStream = () => {
    const cameraData = [
        { id: '1', status: 'Non-Violence' },
        { id: '2', status: 'Violence' },
        { id: '3', status: 'Non-Violence' },
        { id: '4', status: 'Non-Violence' },
    ];

    const [isRecording, setIsRecording] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const handleRecordClick = async () => {
        if (!isRecording) {
            // Start screen recording
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { mediaSource: 'screen' }
                });
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'screen_recording.webm';
                    a.click();
                    URL.revokeObjectURL(url);
                    recordedChunksRef.current = [];
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error starting screen recording:', error);
            }
        } else {
            // Stop recording
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query) {
            const filtered = locations.filter(location => 
                location.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredLocations(filtered);
        } else {
            setFilteredLocations([]);
        }
    };

    const handleLocationSelect = (location) => {
        setSearchQuery(location);
        setFilteredLocations([]);
    };

    const contactPolice = (location) => {
        const policePhoneNumber = '100'; // Example phone number
        alert(`Contacting Police at ${location}: ${policePhoneNumber}`);
        window.open(`tel:${policePhoneNumber}`, '_self'); // Use '_self' to open in the same tab
    };

    const contactHospital = (location) => {
        const hospitalPhoneNumber = '101'; // Example phone number
        alert(`Contacting Hospital at ${location}: ${hospitalPhoneNumber}`);
        window.open(`tel:${hospitalPhoneNumber}`, '_self'); // Use '_self' to open in the same tab
    };

    return (
        <div className="d-flex flex-column "style={{ minHeight: "100vh", marginLeft:"50px"}}>
           
            <div className="flex-grow-1 " style={{ paddingTop: '30px' , paddingBottom:'0px'}}>
                <div className='d-flex justify-content-start align-items-center mb-4'>
                    <button
                        onClick={handleRecordClick}
                        className='p-2 border-2 text-white'
                        style={{
                            backgroundColor: isRecording ? 'gray' : 'red',
                            borderRadius: '4px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        {isRecording ? 'STOP' : 'RECORD'}
                    </button>
                    <div style={{ position: 'relative', marginLeft: '20px', width: '500px' }}>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder='Search Location'
                            className='p-2 w-100'
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                        {filteredLocations.length > 0 && (
                            <div className="suggestions" style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', width: '100%', zIndex: 1000 }}>
                                {filteredLocations.map((location, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleLocationSelect(location)}
                                        style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}
                                    >
                                        {location}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className='d-flex flex-row'>
                    <img
                        src="http://127.0.0.1:5000/video_feed"
                        alt="YOLO Video Stream"
                        style={{ width: '1500px', height: '400px', border: '2px solid black' }}
                    />
                    <div className='row' style={{ marginLeft: '30px', gap: '25px' }}>
                        {cameraData.map((camera, index) => (
                            <div key={index} className="col-md-5 mb-2">
                                <div
                                    className="card hover-card"
                                    style={{
                                        width: '200px',
                                        backgroundColor: camera.status === 'Violence' ? 'red' : 'white',
                                        color: camera.status === 'Violence' ? 'white' : 'black',
                                        border: '2px solid black'
                                    }}
                                >
                                    <div className="card-body align-items-center">
                                        <p className="card-text"><b>CAMERA:</b> {camera.id}</p>
                                        <p className="card-text"><b>STATUS:</b> {camera.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Buttons */}
                <div className="d-flex flex-row mt-4" style={{ gap: '25px' }}>
                    <button
                        onClick={() => contactPolice(searchQuery)}
                        className="btn btn-dark"
                        style={{ padding: '10px 20px', cursor: 'pointer' }}
                        disabled={!searchQuery}
                    >
                        Contact Police
                    </button>
                    <button
                        onClick={() => contactHospital(searchQuery)}
                        className="btn btn-dark"
                        style={{ padding: '10px 20px', cursor: 'pointer' }}
                        disabled={!searchQuery}
                    >
                        Contact Hospital
                    </button>
                </div>
            </div>
         
        </div>
    );
};

export default VideoStream;
