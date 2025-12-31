import React, { useState } from 'react';

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "How do I enroll in a course?",
            answer: "To enroll in a course, simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll be guided through the registration and payment process. If you have any issues, our support team is available to help."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway."
        },
        {
            question: "Can I access courses on mobile devices?",
            answer: "Yes, all our courses are accessible on mobile devices. Our platform is fully responsive and works on smartphones and tablets. You can also download our mobile app from the App Store or Google Play for a better learning experience on the go."
        },
        {
            question: "Do you offer certificates upon completion?",
            answer: "Yes, we provide certificates of completion for all our courses. These certificates can be downloaded as PDFs and shared on professional networks like LinkedIn. Some courses also offer industry-recognized certifications."
        },
        {
            question: "What if I need help during my course?",
            answer: "We offer multiple support channels including email support, live chat during business hours, and dedicated course forums where you can ask questions to instructors and interact with other students. Most courses also include Q&A sessions with instructors."
        },
        {
            question: "Can I get a refund if I'm not satisfied?",
            answer: "We offer a 30-day money-back guarantee for all our courses. If you're not satisfied with your purchase, simply contact our support team within 30 days of enrollment, and we'll process your refund no questions asked."
        },
        {
            question: "How long do I have access to a course?",
            answer: "Once you enroll in a course, you have lifetime access to all its materials. This includes any future updates to the course content. You can learn at your own pace and revisit the materials whenever you need."
        },
        {
            question: "Are there any prerequisites for your courses?",
            answer: "Prerequisites vary by course. Beginner-level courses typically have no prerequisites, while advanced courses may require prior knowledge or experience. Each course listing clearly states any requirements so you can choose appropriately for your skill level."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">
                        Find answers to common questions about our courses, enrollment process, and more.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                        >
                            <button
                                className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={activeIndex === index}
                                aria-controls={`faq-content-${index}`}
                            >
                                <span className="text-lg font-medium text-[#0B2A4A]">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-[#D6A419] transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <div
                                id={`faq-content-${index}`}
                                className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                aria-hidden={activeIndex !== index}
                            >
                                <div className="px-6 pb-6">
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Support CTA */}
                <div className="mt-12 bg-[#0B2A4A] rounded-xl shadow-md p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-gray-200 mb-6">
                        Our support team is here to help you with any additional questions you might have.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-6 py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-300">
                            Live Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;