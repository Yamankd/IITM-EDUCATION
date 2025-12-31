import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Mail, Linkedin, Twitter, ChevronLeft, ChevronRight } from "lucide-react";

const Team = () => {
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // NOTE: This data is hardcoded for demonstration. In a real app, it would likely come from an API.
  const teamData = {
    management: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        role: "Director & Head of Education",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "PhD in Computer Science with 15+ years of teaching experience. Specialized in AI and Machine Learning.",
        department: "management",
        skills: ["Leadership", "AI/ML", "Education Strategy", "Team Building"],
        email: "sarah.johnson@company.com",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        yearsOfExperience: 15,
        education: "PhD Computer Science, Stanford University"
      },
    ],
    product: [
      {
        id: 2,
        name: "Michael Chen",
        role: "Senior Instructor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Industry expert in Full Stack Development with 10+ years of experience. Previously worked at Google and Amazon.",
        department: "product",
        skills: ["React", "Node.js", "Python", "System Design"],
        email: "michael.chen@company.com",
        linkedin: "https://linkedin.com/in/michaelchen",
        twitter: "https://twitter.com/michaelchen",
        yearsOfExperience: 10,
        education: "MS Software Engineering, MIT"
      },
      {
        id: 3,
        name: "Emily Donnavan",
        role: "Product Lead",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Expert in product development and curriculum design with a passion for impactful learning experiences.",
        department: "product",
        skills: ["Product Strategy", "UX Research", "Agile", "Data Analytics"],
        email: "emily.donnavan@company.com",
        linkedin: "https://linkedin.com/in/emilydonnavan",
        twitter: "https://twitter.com/emilydonnavan",
        yearsOfExperience: 8,
        education: "MBA Product Management, Wharton"
      },
    ],
    design: [
      {
        id: 4,
        name: "James Wilson",
        role: "Web Development Instructor",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Full-stack developer specializing in React, Node.js, and modern JavaScript frameworks.",
        department: "design",
        skills: ["JavaScript", "React", "CSS", "Web Design"],
        email: "james.wilson@company.com",
        linkedin: "https://linkedin.com/in/jameswilson",
        twitter: "https://twitter.com/jameswilson",
        yearsOfExperience: 7,
        education: "BS Computer Science, UC Berkeley"
      },
      {
        id: 5,
        name: "Drew Cano",
        role: "Head of UX",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "UX expert with a focus on creating intuitive and engaging learning platforms.",
        department: "design",
        skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
        email: "drew.cano@company.com",
        linkedin: "https://linkedin.com/in/drewcano",
        twitter: "https://twitter.com/drewcano",
        yearsOfExperience: 9,
        education: "MFA Design, RISD"
      },
    ],
    marketing: [
      {
        id: 6,
        name: "Priya Sharma",
        role: "Data Science Instructor",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Data scientist with expertise in Python, R, and statistical modeling.",
        department: "marketing",
        skills: ["Python", "R", "Machine Learning", "Statistics"],
        email: "priya.sharma@company.com",
        linkedin: "https://linkedin.com/in/priyasharma",
        twitter: "https://twitter.com/priyasharma",
        yearsOfExperience: 6,
        education: "PhD Statistics, Harvard University"
      },
      {
        id: 7,
        name: "Sabia Kindred",
        role: "VP of Marketing",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Marketing strategist with a talent for building educational brands and communities.",
        department: "marketing",
        skills: ["Digital Marketing", "Brand Strategy", "SEO", "Content Marketing"],
        email: "sabia.kindred@company.com",
        linkedin: "https://linkedin.com/in/sabiakindred",
        twitter: "https://twitter.com/sabiakindred",
        yearsOfExperience: 12,
        education: "MBA Marketing, Northwestern Kellogg"
      },
    ],
    sales: [
      {
        id: 8,
        name: "Sophie Chamberlain",
        role: "Head of Sales",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Sales professional dedicated to connecting students with the right educational paths.",
        department: "sales",
        skills: ["Sales Strategy", "CRM", "Relationship Building", "Negotiation"],
        email: "sophie.chamberlain@company.com",
        linkedin: "https://linkedin.com/in/sophiechamberlain",
        twitter: "https://twitter.com/sophiechamberlain",
        yearsOfExperience: 8,
        education: "BA Business Administration, NYU"
      },
    ],
    customerSuccess: [
      {
        id: 9,
        name: "Lana Steiner",
        role: "VP of Customer Success",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Committed to ensuring student satisfaction and successful learning outcomes.",
        department: "customerSuccess",
        skills: ["Customer Success", "Account Management", "Training", "Support"],
        email: "lana.steiner@company.com",
        linkedin: "https://linkedin.com/in/lanasteiner",
        twitter: "https://twitter.com/lanasteiner",
        yearsOfExperience: 7,
        education: "MS Psychology, Columbia University"
      },
    ],
    operations: [
      {
        id: 10,
        name: "Emily Rodriguez",
        role: "Student Coordinator",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        bio: "Dedicated to student success and ensuring smooth learning experiences.",
        department: "operations",
        skills: ["Operations", "Student Support", "Process Optimization", "Communication"],
        email: "emily.rodriguez@company.com",
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        twitter: "https://twitter.com/emilyrodriguez",
        yearsOfExperience: 5,
        education: "BA Education, UCLA"
      },
    ],
  };

  const allTeamMembers = Object.values(teamData).flat();

  const departments = [
    { id: "all", name: "View all", icon: "👥" },
    { id: "management", name: "Management", icon: "👔" },
    { id: "product", name: "Product", icon: "💡" },
    { id: "design", name: "Design", icon: "🎨" },
    { id: "marketing", name: "Marketing", icon: "📢" },
    { id: "sales", name: "Sales", icon: "💼" },
    { id: "customerSuccess", name: "Customer Success", icon: "🤝" },
    { id: "operations", name: "Operations", icon: "⚙️" },
  ];

  const filteredTeamMembers = allTeamMembers.filter(member => {
    const matchesDepartment = activeDepartment === "all" || member.department === activeDepartment;
    const matchesSearch = searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDepartment && matchesSearch;
  });

  useEffect(() => {
    if (activeDepartment !== "all" || !isAutoPlaying || searchTerm) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === allTeamMembers.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [activeDepartment, allTeamMembers.length, isAutoPlaying, searchTerm]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === allTeamMembers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? allTeamMembers.length - 1 : prev - 1));
  };

  const handleDepartmentChange = (deptId) => {
    setActiveDepartment(deptId);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 font-sans">
      <motion.div
        className="bg-[#0B2A4A] text-white py-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Meet the team that makes the magic happen
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-8 opacity-90"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Meet our diverse team of world-class creators, designers, and problem solvers.
          </motion.p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members by name, role, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D6A419] focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <motion.p
              className="text-sm text-gray-600 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {filteredTeamMembers.length} result{filteredTeamMembers.length !== 1 ? 's' : ''} for "{searchTerm}"
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {departments.map((dept) => (
            <motion.button
              key={dept.id}
              onClick={() => handleDepartmentChange(dept.id)}
              className={`px-5 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg ${activeDepartment === dept.id
                ? "bg-[#D6A419] text-[#0B2A4A] font-bold scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -2, scale: activeDepartment === dept.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{dept.icon}</span>
              {dept.name}
            </motion.button>
          ))}
        </motion.div>

        {activeDepartment === "all" && !searchTerm ? (
          <div className="relative w-full max-w-4xl mx-auto h-[600px] overflow-hidden">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`p-2 rounded-full ${isAutoPlaying ? 'bg-[#D6A419]' : 'bg-gray-300'} text-white transition-colors`}
                aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
              >
                {isAutoPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous member"
            >
              <ChevronLeft className="w-6 h-6 text-[#0B2A4A]" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next member"
            >
              <ChevronRight className="w-6 h-6 text-[#0B2A4A]" />
            </button>

            <AnimatePresence initial={false} mode="wait">
              {allTeamMembers.length > 0 && (
                <motion.div
                  key={allTeamMembers[currentIndex].id}
                  initial={{ x: 300, opacity: 0, rotateY: 45 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  exit={{ x: -300, opacity: 0, rotateY: -45 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 25 }}
                  className="absolute w-full flex flex-col items-center text-center cursor-pointer"
                  onClick={() => setSelectedMember(allTeamMembers[currentIndex])}
                >
                  <motion.div
                    className="w-80 h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6 relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={allTeamMembers[currentIndex].image}
                      alt={allTeamMembers[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="text-white font-semibold">Click for details</span>
                    </div>
                  </motion.div>
                  <motion.h3
                    className="text-4xl font-bold text-[#0B2A4A] mb-2"
                  >
                    {allTeamMembers[currentIndex].name}
                  </motion.h3>
                  <motion.p
                    className="text-[#D6A419] font-medium text-2xl mb-4"
                  >
                    {allTeamMembers[currentIndex].role}
                  </motion.p>
                  <motion.p
                    className="text-gray-700 max-w-2xl text-lg leading-relaxed"
                  >
                    {allTeamMembers[currentIndex].bio}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {allTeamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-[#D6A419] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          // FIX: Wrapped grid items in <AnimatePresence> for smooth filtering animations.
          // The `layout` prop on the container will animate the grid resizing.
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
            layout
          >
            <AnimatePresence>
              {filteredTeamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 cursor-pointer w-full max-w-xs relative overflow-hidden group"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A4A]/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 z-10">
                    <span className="text-white font-semibold">View Profile</span>
                  </div>
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-100 mb-4 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B2A4A] mb-2 text-center">
                    {member.name}
                  </h3>
                  <p className="text-[#D6A419] font-medium text-center mb-3">
                    {member.role}
                  </p>
                  {/* NOTE: The `line-clamp-3` class requires the @tailwindcss/line-clamp plugin. */}
                  <p className="text-gray-600 text-sm text-center mb-4 h-16 line-clamp-3">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {member.skills?.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredTeamMembers.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl mb-2">No team members found</p>
            <p className="text-gray-400">Try searching for a different name, role, or skill.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Close profile"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="bg-gradient-to-br from-[#0B2A4A] to-blue-900 text-white p-8 rounded-t-3xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
                    <p className="text-[#D6A419] text-xl font-medium mb-2">{selectedMember.role}</p>
                    <p className="opacity-90">{selectedMember.yearsOfExperience} years of experience</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#0B2A4A] mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#0B2A4A] mb-3">Education</h3>
                  <p className="text-gray-700">{selectedMember.education}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#0B2A4A] mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills?.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-full font-medium text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">Connect</h3>
                  <div className="flex flex-wrap gap-4">
                    {/* FIX: Added target="_blank" and rel attributes for security and UX. */}
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5 text-gray-600" />
                      Email
                    </a>
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      LinkedIn
                    </a>
                    <a
                      href={selectedMember.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-sky-600" />
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-[#0B2A4A] py-12 mt-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto opacity-90">
            We're always looking for talented instructors and staff passionate about technology education.
          </p>
          <motion.button
            className="px-8 py-4 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Open Positions
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Team;

