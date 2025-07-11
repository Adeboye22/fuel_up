"use client"

import AboutUs from "@/components/AboutUs"
import Hero from "@/components/Hero"
import OurService from "@/components/OurService"
import Packages from "@/components/Packages"
import { Truck } from "lucide-react"
import { useEffect } from "react"
import Marquee from "react-fast-marquee"
import { FaChevronDown } from "react-icons/fa"
import { motion } from "framer-motion"
import Locations from "@/components/Locations"
import ContactSection from "@/components/ContactSection"

// Animation variants
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const Home = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="text-gray-100 font-sans">
      {/* Hero Section with fullscreen height */}
      <section className="relative flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/assets/Nozzle.jpg')] bg-cover bg-center bg-fixed"></div>
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-32 lg:py-28 px-4 relative z-10">
          <Hero />

          {/* Scroll indicator */}
          <div className="absolute bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 text-white">
            <a href="#services" className="flex flex-col items-center">
              <span className="text-sm font-light mb-2">Scroll Down</span>
              <FaChevronDown className="text-green-500" />
            </a>
          </div>
        </div>
      </section>

      {/* Announcement Bar */}
      <div className="bg-yellow-600/80 shadow-lg">
        <div className="container mx-auto py-3">
          <Marquee speed={40} pauseOnHover={true} gradient={false} className="text-white">
            <p className="text-lg font-medium mx-4">
              You don't have to compromise your comfort just to get fuel. You order from the nearest filling station, we
              deliver!
            </p>
            <span className="text-2xl mx-4 inline-block scale-x-[-1] text-emerald-600 rounded-full bg-emerald-800/10 p-4">
              <Truck />
            </span>
            <p className="text-lg font-medium mx-4">
              Petrol (PMS) at N00.00, Diesel (AGO) at N00.00, Kerosene (DPK) at N00.00.
            </p>
            <span className="text-2xl mx-4 inline-block scale-x-[-1] text-emerald-600 rounded-full bg-emerald-800/10 p-4">
              <Truck />
            </span>
          </Marquee>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Services Section */}
        <motion.section
          id="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="py-24"
        >
          <OurService />
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className=""
        >
          <AboutUs />
        </motion.section>

        {/* Packages Section with custom background */}
        <motion.section
          id="packages"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="py-24 relative"
        >
          {/* Background pattern */}
          <div className="relative z-10">
            <Packages />
          </div>
        </motion.section>
      </div>

      <div className="py-24 bg-gray-200/60 dark:bg-gray-900/80">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-green-500 mb-12 text-center">What Our Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "FuelUp has transformed our business operations. No more fuel shortages or productivity losses!",
                name: "Sarah Johnson",
                title: "Operations Manager, Lagos Tech Hub"
              },
              {
                quote: "The convenience of having fuel delivered to my doorstep has been a game-changer. Highly recommended!",
                name: "Michael Adebayo",
                title: "Business Owner"
              },
              {
                quote: "Reliable, professional, and always on time. FuelUp has become an essential service for our company.",
                name: "Chioma Okafor",
                title: "Hotel Manager"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-green-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-300 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-24">
        {/* Background with overlay */}
        <div className='absolute top-0 left-0 w-full h-full bg-green-700/50'>
          <img src="/assets/Nozzle.jpg" className='absolute top-0 left-0 w-full h-full object-cover' alt="cta nozzle" />
          <div className='absolute top-0 left-0 w-full h-full bg-green-700/65' />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Hassle-Free Fuel Delivery?</h2>
          <p className="text-xl text-white opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to FuelUp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mx-auto max-w-md">
            <a href="/signup" className="px-8 py-4 w-full bg-white text-green-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
              Sign Up Now
            </a>
            <a href="#about" className="w-full px-8 py-4 bg-transparent text-white border-2 border-white font-bold rounded-full hover:bg-white/10 transition-colors duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border-t border-gray-800">
        <div id="locations" className="container mx-auto px-4 py-16">
          <Locations />
        </div>
      </div>

      <ContactSection />
    </div>
  )
}

export default Home
