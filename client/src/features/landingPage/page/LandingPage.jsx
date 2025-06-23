import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { 
  ShoppingBag, 
  MessageCircle, 
  Shield, 
  Heart, 
  Star,
  Search,
  Users,
  ShoppingCart,
  User,
  Upload,
  TrendingUp,
  Quote,
  CheckCircle,
  Lock,
  Headphones
} from 'lucide-react';

import post1 from "../../../assets/post1.jpg";
import post2 from "../../../assets/post2.jpg";
import post3 from "../../../assets/post3.jpg";
import post4 from "../../../assets/post4.jpg";
import landingImg from "../../../assets/lan.gif";


export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    setMousePosition({ x: 0.5, y: 0.5 });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Add observer to all animated sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation helper function
  const getAnimationStyle = (elementId, animationType = 'fadeInUp', delay = 0) => {
    const isVisible = visibleElements.has(elementId);
    
    const animations = {
      fadeInUp: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
        transition: `all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      },
      fadeInLeft: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0px)' : 'translateX(-50px)',
        transition: `all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      },
      fadeInRight: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0px)' : 'translateX(50px)',
        transition: `all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      },
      scaleIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: `all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      },
      slideInUp: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(100px)',
        transition: `all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      }
    };
    
    return animations[animationType] || animations.fadeInUp;
  };

  const images = [
   { src: post1, alt: "1", left: "30%", top: "10%", z: 2 },
    { src: post2, alt: "2", left: "50%", top: "15%", z: 1 },
    { src: post3 , alt: "3", left: "70%", top: "20%", z: 2 },
   
    { src: post4, alt: "4",  left: "15%", top: "30%", z: 1 },
    { src: post1, alt: "5", left: "40%", top: "28%", z: 2 },
    { src: post2, alt: "6",left: "60%", top: "32%", z: 1 },
    { src: post3, alt: "7", left: "25%", top: "45%", z: 2 },
    { src: post4, alt: "8", left: "45%", top: "48%", z: 1 },
    { src: post1, alt: "9", left: "65%", top: "50%", z: 2 },
    { src: post2, alt: "10", left:  "15%", top: "65%", z: 1 },
    { src: post1, alt: "11", left: "35%", top: "63%", z: 2 },
    { src: post2, alt: "12", left: "55%", top: "65%", z: 1 },
    { src: post3, alt: "13", left: "75%", top: "60%", z: 2 }
  ];

  const translateX = `${-30 * (mousePosition.x - 0.5)}%`;
  const translateY = `${-30 * (mousePosition.y - 0.5)}%`;

  const features = [
    {
      icon: <ShoppingBag size={48} />,
      title: "Product Listings",
      description: "Personalized storefronts with photos, videos, and product details."
    },
    {
      icon: <MessageCircle size={48} />,
      title: "Social Interaction",
      description: "Comment, message, and interact with artisans in real-time."
    },
    {
      icon: <Shield size={48} />,
      title: "Secure Payment",
      description: "Easy and secure checkout for a seamless shopping experience."
    },
    {
      icon: <Heart size={48} />,
      title: "Recommendation System",
      description: "Personalized product and artisan recommendations."
    },
    {
      icon: <Star size={48} />,
      title: "Reviews & Ratings",
      description: "Build trust with authentic reviews from real customers."
    }
  ];

  const featuredArtisans = [
    {
      name: "Sarah Chen",
      specialty: "Ceramic Artist",
      description: "Creating beautiful handmade pottery with modern aesthetic",
      icon: <User size={40} />
    },
    {
      name: "Marcus Rodriguez",
      specialty: "Chef & Food Artist",
      description: "Innovative culinary creations and artisanal cooking",
      icon: <User size={40} />
    },
    {
      name: "Emma Thompson",
      specialty: "Digital Creator",
      description: "Combining traditional crafts with modern social media",
      icon: <User size={40} />
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me reach customers worldwide and tell the story behind each piece I make.",
      name: "Maria Santos",
      role: "Textile Artist",
      icon: <User size={24} />
    },
    {
      quote: "I love being able to connect with the artisans directly and learn about their creative process.",
      name: "David Kim",
      role: "Art Collector",
      icon: <User size={24} />
    },
    {
      quote: "The community here is amazing. I've made so many connections and grown my business significantly.",
      name: "Isabella Rodriguez",
      role: "Jewelry Designer",
      icon: <User size={24} />
    }
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* Hero Section */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(135deg,rgb(243, 253, 186) 0%,rgb(193, 195, 255) 100%)",
          cursor: "none"
        }}
      >
        {/* Custom cursor */}
        <div
          style={{
            position: "absolute",
            width: "40px",
            height: "40px",
            border: "2px solid #6B73FF",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 50,
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: "translate(-50%, -50%)"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "4px",
              height: "4px",
              backgroundColor: "#6B73FF",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </div>

        {/* Background with scattered images */}
        <div
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${translateX}, ${translateY})`,
            transition: "transform 0.05s ease-out"
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: image.left,
                top: image.top,
                width: "140px",
                height: "190px",
                zIndex: image.z,
                animation: `float ${3 + (index % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(107, 115, 255, 0.2)"
                }}
              />
            </div>
          ))}
        </div>

        {/* Fixed center text + button */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            textAlign: "center",
            color: "#2D3748",
            animation: "heroFadeIn 1.5s ease-out"
          }}
        >
          <h1 style={{ 
            fontSize: "48px", 
            fontFamily: "serif", 
            fontWeight: "400", 
            marginBottom: "10px",
            background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "titleSlideIn 1s ease-out"
          }}>
            Where Craftsmanship Meets Community
          </h1>
          <h2 style={{ 
            fontSize: "24px", 
            fontFamily: "Inter, sans-serif", 
            fontWeight: "300", 
            marginBottom: "20px",
            color: "#FFF",
            animation: "subtitleSlideIn 1s ease-out 0.3s both"
          }}>
            Connect directly with artisans worldwide
          </h2>
          <p style={{ 
            fontSize: "14px", 
            letterSpacing: "2px", 
            textTransform: "uppercase", 
            marginBottom: "30px",
            color: "#A0AEC0",
            animation: "taglineSlideIn 1s ease-out 0.6s both"
          }}>
            Discover Unique Handmade Artistry
          </p>
          <button
            onClick={() => scrollToSection("introduction")}
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              letterSpacing: "1px",
              fontWeight: "500",
              boxShadow: "0 8px 32px rgba(107, 115, 255, 0.3)",
              transition: "all 0.3s ease",
              animation: "buttonSlideIn 1s ease-out 0.9s both"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 40px rgba(107, 115, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px) scale(1)";
              e.target.style.boxShadow = "0 8px 32px rgba(107, 115, 255, 0.3)";
            }}
          >
            Start Exploring
          </button>
        </div>

        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-20px) rotate(2deg); }
          }
          @keyframes heroFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes titleSlideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0px); opacity: 1; }
          }
          @keyframes subtitleSlideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0px); opacity: 1; }
          }
          @keyframes taglineSlideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0px); opacity: 1; }
          }
          @keyframes buttonSlideIn {
            0% { transform: translateY(30px) scale(0.8); opacity: 0; }
            100% { transform: translateY(0px) scale(1); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Introduction Section */}
      <div 
        id="introduction"
        data-animate
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "#dbd9d9",
          minHeight: "100vh",
          textAlign: "center",
          ...getAnimationStyle('introduction', 'fadeInUp')
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" ,padding: "100px 20px",}}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "30px",
            fontFamily: "serif",
            ...getAnimationStyle('introduction', 'fadeInUp', 0.2)
          }}>
            Bringing Artisans and Art Lovers Together
          </h2>
          <p style={{
            fontSize: "20px",
            color: "#4A5568",
            lineHeight: "1.8",
            marginBottom: "20px",
            ...getAnimationStyle('introduction', 'fadeInUp', 0.4)
          }}>
            Our platform empowers artisans to showcase and sell their products online while building meaningful connections with their customers.
          </p>
          <p style={{
            fontSize: "18px",
            color: "#718096",
            lineHeight: "1.8",
            fontStyle: "italic",
            ...getAnimationStyle('introduction', 'fadeInUp', 0.6)
          }}>
            Bringing together e-commerce and social features to create a vibrant community of artisans and enthusiasts.
          </p>
          <button
                style={{
                width:"200px",
                marginRight:'30px',
                padding: "16px 32px",
                fontSize: "16px",
                background: "white",
                color: "#6B73FF",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease"
              }}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px) scale(1.05)";
                e.target.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0px) scale(1)";
                e.target.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
              }}
            >
              Join Now
            </button>
           <button
              style={{
                 marginTop:"50px",
                width:"200px",
                padding: "16px 32px",
                fontSize: "16px",
                background: "transparent",
                color: "white",
                border: "2px solid white",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#6B73FF";
                e.target.style.transform = "translateY(-2px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(0px) scale(1)";
              }}
            >
              log in
            </button>
        </div>
        <img src={landingImg} alt="Artisan" style={{ width: "100%", height: "100vh"}}/>
      </div>

      {/* Features Section */}
      <div 
        id="features"
        data-animate
        style={{
          background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
          padding: "100px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "60px",
            fontFamily: "serif",
            ...getAnimationStyle('features', 'fadeInUp')
          }}>
            Platform Features
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            marginTop: "60px"
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg, rgba(179, 236, 255, 0.3) 0%, rgba(240, 171, 252, 0.3) 100%)",
                  padding: "40px 30px",
                  borderRadius: "20px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  ...getAnimationStyle('features', 'scaleIn', index * 0.1)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div style={{ 
                  color: "#6B73FF", 
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#2D3748",
                  marginBottom: "15px"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "16px",
                  color: "#4A5568",
                  lineHeight: "1.6"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Artisans Section */}
      <div 
        id="featured-artisans"
        data-animate
        style={{
          background: "linear-gradient(135deg, #FFE8E8 0%, #FFF0E8 100%)",
          padding: "100px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "60px",
            fontFamily: "serif",
            ...getAnimationStyle('featured-artisans', 'fadeInUp')
          }}>
            Featured Artisans
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "40px"
          }}>
            {featuredArtisans.map((artisan, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "40px 30px",
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  ...getAnimationStyle('featured-artisans', 'slideInUp', index * 0.2)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) rotate(1deg)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) rotate(0deg)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "white"
                }}>
                  {artisan.icon}
                </div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#2D3748",
                  marginBottom: "10px"
                }}>
                  {artisan.name}
                </h3>
                <p style={{
                  fontSize: "16px",
                  color: "#6B73FF",
                  fontWeight: "500",
                  marginBottom: "15px"
                }}>
                  {artisan.specialty}
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#4A5568",
                  lineHeight: "1.6"
                }}>
                  {artisan.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div 
        id="how-it-works"
        data-animate
        style={{
          background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
          padding: "100px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "60px",
            fontFamily: "serif",
            ...getAnimationStyle('how-it-works', 'fadeInUp')
          }}>
            How It Works
          </h2>
          
          {/* For Customers */}
          <div style={{ marginBottom: "80px" }}>
            <h3 style={{
              fontSize: "32px",
              fontWeight: "500",
              color: "#6B73FF",
              marginBottom: "40px",
              ...getAnimationStyle('how-it-works', 'fadeInLeft', 0.2)
            }}>
              For Customers
            </h3>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "40px"
            }}>
              {[
                { icon: <Search size={32} />, title: "Browse", desc: "Browse products or artisans" },
                { icon: <Users size={32} />, title: "Explore", desc: "Explore artisan stories and interact" },
                { icon: <ShoppingCart size={32} />, title: "Buy", desc: "Buy securely and enjoy unique creations" }
              ].map((step, index) => (
                <div key={index} style={{ 
                  textAlign: "center", 
                  maxWidth: "250px",
                  ...getAnimationStyle('how-it-works', 'scaleIn', 0.4 + index * 0.2)
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white"
                  }}>
                    {step.icon}
                  </div>
                  <h4 style={{ fontSize: "20px", fontWeight: "600", color: "#2D3748", marginBottom: "10px" }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: "14px", color: "#4A5568" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* For Artisans */}
          <div>
            <h3 style={{
              fontSize: "32px",
              fontWeight: "500",
              color: "#6B73FF",
              marginBottom: "40px",
              ...getAnimationStyle('how-it-works', 'fadeInRight', 1.2)
            }}>
              For Artisans
            </h3>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "40px"
            }}>
              {[
                { icon: <User size={32} />, title: "Create Profile", desc: "Create a profile & upload products" },
                { icon: <Upload size={32} />, title: "Tell Your Story", desc: "Tell your story and connect with your audience" },
                { icon: <TrendingUp size={32} />, title: "Grow Business", desc: "Manage orders and grow your business" }
              ].map((step, index) => (
                <div key={index} style={{ 
                  textAlign: "center", 
                  maxWidth: "250px",
                  ...getAnimationStyle('how-it-works', 'scaleIn', 1.4 + index * 0.2)
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white"
                  }}>
                    {step.icon}
                  </div>
                  <h4 style={{ fontSize: "20px", fontWeight: "600", color: "#2D3748", marginBottom: "10px" }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: "14px", color: "#4A5568" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div 
        id="testimonials"
        data-animate
        style={{
          background: "linear-gradient(135deg, #B3ECFF 0%, #F0ABFC 100%)",
          padding: "100px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "60px",
            fontFamily: "serif",
            ...getAnimationStyle('testimonials', 'fadeInUp')
          }}>
            What Our Community Says
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "40px"
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "40px 30px",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  ...getAnimationStyle('testimonials', 'fadeInUp', index * 0.2)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Quote size={24} style={{ color: "#6B73FF", marginBottom: "20px" }} />
                <p style={{
                  fontSize: "16px",
                  color: "#4A5568",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  fontStyle: "italic"
                }}>
                  "{testimonial.quote}"
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white"
                  }}>
                    {testimonial.icon}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3748",
                      margin: "0"
                    }}>
                      {testimonial.name}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#6B73FF",
                      margin: "0"
                    }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Security Section */}
      <div 
        id="trust-security"
        data-animate
        style={{
          background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
          padding: "100px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            color: "#2D3748",
            marginBottom: "60px",
            fontFamily: "serif",
            ...getAnimationStyle('trust-security', 'fadeInUp')
          }}>
            Trust & Security
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px"
          }}>
            {[
              {
                icon: <Lock size={40} />,
                title: "Secure Payments",
                description: "All transactions are protected with industry-standard encryption"
              },
              {
                icon: <CheckCircle size={40} />,
                title: "Verified Artisans",
                description: "All artisans go through our verification process"
              },
              {
                icon: <Shield size={40} />,
                title: "Buyer Protection",
                description: "Your purchases are protected with our guarantee policy"
              },
              {
                icon: <Headphones size={40} />,
                title: "24/7 Support",
                description: "Our customer support team is always here to help"
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "40px 30px",
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  ...getAnimationStyle('trust-security', 'scaleIn', index * 0.1)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div style={{ 
                  color: "#6B73FF", 
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#2D3748",
                  marginBottom: "15px"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#4A5568",
                  lineHeight: "1.6"
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div 
        id="cta"
        data-animate
        style={{
          background: "linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%)",
          padding: "100px 20px",
          textAlign: "center",
          color: "white"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "600",
            marginBottom: "30px",
            fontFamily: "serif",
            ...getAnimationStyle('cta', 'fadeInUp')
          }}>
            Ready to Join Our Community?
          </h2>
          <p style={{
            fontSize: "20px",
            marginBottom: "40px",
            opacity: "0.9",
            lineHeight: "1.6",
            ...getAnimationStyle('cta', 'fadeInUp', 0.2)
          }}>
            Whether you're an artisan looking to share your craft or a customer seeking unique creations, 
            we have the perfect space for you.
          </p>
          <div style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
            ...getAnimationStyle('cta', 'fadeInUp', 0.4)
          }}>
          
    
            <button
              style={{
                width:"200px",
                padding: "16px 32px",
                fontSize: "16px",
                background: "transparent",
                color: "white",
                border: "2px solid white",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#6B73FF";
                e.target.style.transform = "translateY(-2px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(0px) scale(1)";
              }}
            >
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: "#2D3748",
        padding: "60px 20px 40px",
        color: "white"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px"
          }}>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Artisan Marketplace
              </h3>
              <p style={{ fontSize: "14px", opacity: "0.8", lineHeight: "1.6" }}>
                Connecting artisans with art lovers worldwide. Discover unique handmade creations 
                and support independent creators.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
                For Customers
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Browse Products
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Find Artisans
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Customer Support
                </a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
                For Artisans
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Sell Products
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Resources
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Success Stories
                </a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
                Company
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  About Us
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Privacy Policy
                </a>
                <a href="#" style={{ color: "white", textDecoration: "none", opacity: "0.8", fontSize: "14px" }}>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid #4A5568",
            paddingTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            opacity: "0.6"
          }}>
            © 2025 Artisan Marketplace. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}