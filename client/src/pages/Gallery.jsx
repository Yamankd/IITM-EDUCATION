import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Masonry from "react-masonry-css";
import "./Gallery.css";
import SEO from "../components/common/SEO";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchImages(1, activeTab, true);
  }, [activeTab]);

  const fetchImages = async (pageNum = 1, section = "all", reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const query = section !== "all" ? `&section=${section}` : "";
      const { data } = await api.get(
        `/gallery?page=${pageNum}&limit=12${query}`,
      );

      if (reset) {
        setImages(data.images);
      } else {
        setImages((prev) => [...prev, ...data.images]);
      }
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchImages(page + 1, activeTab, false);
    }
  };

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  };

  const tabs = [
    { id: "all", label: "All Photos" },
    { id: "campus", label: "Campus Life" },
    { id: "events", label: "Events" },
    { id: "classroom", label: "Classroom" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="bg-[#0B2A4A] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Gallery"
        description="View photos of campus life, events, and classroom sessions at IITM Computer Education."
        keywords="iitm gallery, campus photos, student life, mathura education events"
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Gallery</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore life at Digital IITM. From classroom sessions to vibrant
            campus events, get a glimpse of our journey.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#D6A419] text-white shadow-lg scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
          </div>
        ) : (
          <>
            <Masonry
              breakpointCols={{
                default: 4,
                1100: 3,
                700: 2,
                500: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((img, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  key={`${img._id}-${index}`}
                  className="group relative rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-xl cursor-pointer mb-6"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <LazyLoadImage
                    src={img.imageUrl}
                    alt={img.title || "Gallery Image"}
                    effect="blur"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    wrapperClassName="w-full !block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {img.eventName && (
                      <span className="text-[#D6A419] text-xs font-bold uppercase tracking-wider mb-1">
                        {img.eventName}
                      </span>
                    )}
                    {img.title && (
                      <p className="text-white font-medium text-sm line-clamp-2">
                        {img.title}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </Masonry>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#D6A419] text-white rounded-lg font-bold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Photos"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && images.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No images found in this section.
          </div>
        )}

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((img) => ({
            src: img.imageUrl,
            title: img.title,
            description: img.eventName,
          }))}
        />
      </div>
    </div>
  );
};

export default Gallery;
