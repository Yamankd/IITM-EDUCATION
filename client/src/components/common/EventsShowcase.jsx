import React from 'react';

const EventsShowcase = () => {
    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Campus Events & Functions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Experience the vibrant campus life at IITM through our events and activities
                    </p>
                </div>

                {/* Centered Video Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                    <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube-nocookie.com/embed/kBKVevrZmJk?si=Q9vLg5cUX-c8LMIW&autoplay=0&mute=0&controls=1&modestbranding=1"
                            title="IITM Campus Events"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-t-xl"
                        />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default EventsShowcase;