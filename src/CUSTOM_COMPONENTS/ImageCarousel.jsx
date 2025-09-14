import React from 'react';
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

const ImageCarousel = () => {
    // Replace these with your actual images
    const images = [
        {
            src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Students studying together",
            title: "Collaborative Learning",
            description: "Join our vibrant community of learners"
        },
        {
            src: "https://images.unsplash.com/photo-1522881193457-37ae97c905bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Online education",
            title: "Flexible Online Courses",
            description: "Learn from anywhere at your own pace"
        },
        {
            src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Graduation ceremony",
            title: "Recognized Certifications",
            description: "Earn credentials valued by employers"
        },
        {
            src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Expert instructor",
            title: "Expert Instructors",
            description: "Learn from industry professionals"
        },
        {
            src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Hands-on learning",
            title: "Practical Experience",
            description: "Gain real-world skills through projects"
        },
        {
            src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            alt: "Career success",
            title: "Career Advancement",
            description: "Unlock new opportunities with your skills"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-[#0B2A4A] to-[#14385F]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-4">Discover IITM</h2>
                <p className="text-center text-gray-200 mb-12 max-w-2xl mx-auto">
                    Explore our learning environment, community, and success stories
                </p>

                <motion.div
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: 0.5,
                    }}
                    className="relative"
                >
                    <style>
                        {`
              .Carousal_001 {
                padding-bottom: 50px !important;
              }
              .swiper-button-next, .swiper-button-prev {
                background: rgba(214, 164, 25, 0.8);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .swiper-button-next:after, .swiper-button-prev:after {
                content: none;
              }
              .swiper-pagination-bullet {
                background: #D6A419;
                opacity: 0.5;
                width: 12px;
                height: 12px;
              }
              .swiper-pagination-bullet-active {
                opacity: 1;
                width: 24px;
                border-radius: 6px;
              }
            `}
                    </style>

                    <Swiper
                        spaceBetween={40}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={2.43}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 2.43,
                            },
                        }}
                        coverflowEffect={{
                            rotate: 0,
                            slideShadows: false,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        className="Carousal_001"
                        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} className="!h-[400px] w-full rounded-xl overflow-hidden">
                                <div className="relative h-full w-full group">
                                    <img
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={image.src}
                                        alt={image.alt}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                                        <p className="text-gray-200">{image.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                        <div className="swiper-button-next after:hidden">
                            <ChevronRightIcon className="h-6 w-6 text-[#0B2A4A]" />
                        </div>
                        <div className="swiper-button-prev after:hidden">
                            <ChevronLeftIcon className="h-6 w-6 text-[#0B2A4A]" />
                        </div>
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default ImageCarousel;