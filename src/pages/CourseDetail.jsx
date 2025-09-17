import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    
    useEffect(() => {
        
        const fetchCourse = async () => {
            setLoading(true);
            const courses = await axios.get("/courses.json");
            const data = courses.data;
            console.log(data)
            const coursedata  = await data.find( (c) => (c.id == id));
            setCourse(coursedata);
            setLoading(false);
        };

        fetchCourse();
    }, [id]);

    const copyCourseLink = () => {
        const courseUrl = window.location.href;
        navigator.clipboard.writeText(courseUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const enrollCourse = () => {
        // In a real application, this would redirect to payment or enrollment process
        alert(`Enrolling in ${course.title}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-2xl font-bold text-[#0B2A4A] mb-4">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
                    <Link
                        to="/course"
                        className="px-4 py-2 bg-[#D6A419] text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        Browse All Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link to="/" className="text-gray-500 hover:text-[#0B2A4A]">Home</Link>
                        </li>
                        <li className="flex items-center">
                            <span className="text-gray-400 mx-2">/</span>
                            <Link to="/course" className="text-gray-500 hover:text-[#0B2A4A]">Courses</Link>
                        </li>
                        <li className="flex items-center">
                            <span className="text-gray-400 mx-2">/</span>
                            <span className="text-[#0B2A4A] font-medium">{course.title}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex flex-wrap items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 bg-[#0B2A4A] text-white text-sm font-medium rounded-full">
                                            {course.category}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                            course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                            {course.level}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {course.duration}
                                        </span>
                                    </div>

                                    {/* Copy Link Button */}
                                    <button
                                        onClick={copyCourseLink}
                                        className="flex items-center text-sm text-gray-500 hover:text-[#0B2A4A] mt-2 sm:mt-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                        </svg>
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>

                                <h1 className="text-3xl font-bold text-[#0B2A4A] mb-4">{course.title}</h1>
                                <p className="text-gray-700 text-lg mb-6">{course.longDescription}</p>

                                <div className="flex items-center mb-6">
                                    <div className="flex items-center mr-6">
                                        <svg className="w-5 h-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-1 text-gray-700 font-medium">
                                            {course.rating}
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                            ({course.reviews} reviews)
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-1 text-gray-700">
                                            {course.students.toLocaleString()} students
                                        </span>
                                    </div>
                                </div>

                                {/* Instructor Info */}
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                                    <img
                                        src={course.instructor.image}
                                        alt={course.instructor.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-[#0B2A4A]">Instructor</h3>
                                        <p className="text-gray-700">{course.instructor.name}</p>
                                        <p className="text-sm text-gray-500">{course.instructor.bio}</p>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 mb-6">
                                    <nav className="flex -mb-px">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'overview'
                                                ? 'border-[#D6A419] text-[#0B2A4A]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Overview
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('syllabus')}
                                            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'syllabus'
                                                ? 'border-[#D6A419] text-[#0B2A4A]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Syllabus
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('instructor')}
                                            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'instructor'
                                                ? 'border-[#D6A419] text-[#0B2A4A]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Instructor
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('reviews')}
                                            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'reviews'
                                                ? 'border-[#D6A419] text-[#0B2A4A]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Reviews
                                        </button>
                                    </nav>
                                </div>

                                {/* Tab Content */}
                                {activeTab === 'overview' && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">What you'll learn</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {course.learningOutcomes.map((outcome, index) => (
                                                <div key={index} className="flex items-start">
                                                    <svg className="h-5 w-5 text-[#D6A419] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{outcome}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">Pre Requisite</h3>
                                        <ul className="list-disc list-inside space-y-2 mb-6">
                                            {course.requirements.map((requirement, index) => (
                                                <li key={index} className="text-gray-700">{requirement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'syllabus' && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">Course Content</h3>
                                        <div className="space-y-4">
                                            {course.syllabus.map((item, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <button className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100">
                                                        <span className="font-medium text-left">
                                                            Week {item.week}: {item.title}
                                                        </span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <div className="p-4 bg-white">
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {item.topics.map((topic, topicIndex) => (
                                                                <li key={topicIndex} className="text-gray-700">{topic}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'instructor' && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">About the Instructor</h3>
                                        <div className="flex items-start">
                                            <img
                                                src={course.instructor.image}
                                                alt={course.instructor.name}
                                                className="w-16 h-16 rounded-full object-cover mr-4"
                                            />
                                            <div>
                                                <h4 className="text-lg font-semibold text-[#0B2A4A]">{course.instructor.name}</h4>
                                                <p className="text-gray-600 mb-3">{course.instructor.bio}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span>4.8 Instructor Rating</span>
                                                    <span className="mx-2">•</span>
                                                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>12,450 Reviews</span>
                                                    <span className="mx-2">•</span>
                                                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>35,671 Students</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">Student Reviews</h3>
                                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                                            <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-[#0B2A4A] mb-2">${course.price}</div>
                                <div className="text-sm text-gray-500">One-time payment</div>
                            </div>

                            <button
                                onClick={enrollCourse}
                                className="w-full py-3 bg-[#D6A419] text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors mb-4"
                            >
                                Enroll Now
                            </button>

                            <button className="w-full py-3 border border-[#0B2A4A] text-[#0B2A4A] font-semibold rounded-lg hover:bg-gray-50 transition-colors mb-6">
                                Add to Wishlist
                            </button>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span>{course.duration} of content</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Full lifetime access</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Certificate of completion</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                            <h3 className="font-semibold text-[#0B2A4A] mb-4">Share this course</h3>
                            <div className="flex space-x-3">
                                <button className="flex-1 flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </button>
                                <button className="flex-1 flex items-center justify-center p-2 bg-blue-800 text-white rounded-lg">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </button>
                                <button className="flex-1 flex items-center justify-center p-2 bg-blue-400 text-white rounded-lg">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.486 2.001a1 1 0 00-.946.676l-2.55 7.706-7.705 2.55a1 1 0 00-.676.947V18a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1h-4.514z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;