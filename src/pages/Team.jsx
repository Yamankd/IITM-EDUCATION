import React, { useState } from 'react';

const Team = () => {
    const [activeDepartment, setActiveDepartment] = useState('all');

    // Team data organized by department
    const teamData = {
        management: [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                role: "Director & Head of Education",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "PhD in Computer Science with over 15 years of teaching experience. Specialized in AI and Machine Learning.",
                department: "management"
            }
        ],
        product: [
            {
                id: 2,
                name: "Michael Chen",
                role: "Senior Instructor",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Industry expert in Full Stack Development with 10+ years of experience. Previously worked at Google and Amazon.",
                department: "product"
            },
            {
                id: 3,
                name: "Emily Donnavan",
                role: "Product Lead",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Expert in product development and curriculum design with a passion for creating impactful learning experiences.",
                department: "product"
            }
        ],
        design: [
            {
                id: 4,
                name: "James Wilson",
                role: "Web Development Instructor",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Full-stack developer specializing in React, Node.js, and modern JavaScript frameworks.",
                department: "design"
            },
            {
                id: 5,
                name: "Drew Cano",
                role: "Head of UX",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "UX expert with a focus on creating intuitive and engaging learning platforms.",
                department: "design"
            }
        ],
        marketing: [
            {
                id: 6,
                name: "Priya Sharma",
                role: "Data Science Instructor",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Data scientist with expertise in Python, R, and statistical modeling.",
                department: "marketing"
            },
            {
                id: 7,
                name: "Sabia Kindred",
                role: "VP of Marketing",
                image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Marketing strategist with a talent for building educational brands and communities.",
                department: "marketing"
            }
        ],
        sales: [
            {
                id: 8,
                name: "Sophie Chamberlain",
                role: "Head of Sales",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Sales professional dedicated to connecting students with the right educational paths.",
                department: "sales"
            }
        ],
        customerSuccess: [
            {
                id: 9,
                name: "Lana Steiner",
                role: "VP of Customer Success",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Committed to ensuring student satisfaction and successful learning outcomes.",
                department: "customerSuccess"
            }
        ],
        operations: [
            {
                id: 10,
                name: "Emily Rodriguez",
                role: "Student Coordinator",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                bio: "Dedicated to student success and ensuring smooth learning experiences.",
                department: "operations"
            }
        ]
    };

    // Combine all team members
    const allTeamMembers = Object.values(teamData).flat();

    // Departments for filtering
    const departments = [
        { id: 'all', name: 'View all' },
        { id: 'management', name: 'Management' },
        { id: 'product', name: 'Product' },
        { id: 'design', name: 'Design' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'sales', name: 'Sales' },
        { id: 'customerSuccess', name: 'Customer Success' },
        { id: 'operations', name: 'Operations' }
    ];

    // Filter team members based on active department
    const filteredTeamMembers = activeDepartment === 'all'
        ? allTeamMembers
        : allTeamMembers.filter(member => member.department === activeDepartment);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header Section */}
            <div className="bg-[#0B2A4A] text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the team that makes the magic happen</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        Meet our diverse team of world-class creators, designers, and problem solvers.
                    </p>
                </div>
            </div>

            {/* Department Filter */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {departments.map(dept => (
                        <button
                            key={dept.id}
                            onClick={() => setActiveDepartment(dept.id)}
                            className={`px-4 py-2 rounded-full transition-colors ${activeDepartment === dept.id
                                ? 'bg-[#D6A419] text-[#0B2A4A] font-bold'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {dept.name}
                        </button>
                    ))}
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTeamMembers.map(member => (
                        <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 group">
                            {/* Team Member Image */}
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm">{member.bio}</p>
                                </div>
                            </div>

                            {/* Team Member Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#0B2A4A]">{member.name}</h3>
                                <p className="text-[#D6A419] font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTeamMembers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No team members found in this department.</p>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-[#0B2A4A] py-12 mt-8">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Team</h2>
                    <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                        We're always looking for talented instructors and staff passionate about technology education.
                    </p>
                    <button className="px-6 py-3 bg-[#D6A419] text-[#0B2A4A] rounded-md font-bold text-lg hover:bg-yellow-500 transition-colors">
                        View Open Positions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Team;