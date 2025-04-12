import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { ModeToggle } from './mode-toggle';
import FuelupLogo from './FuelupLogo';
import FuelupLogo2 from './FuelupLogo2';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeNavBar = () => {
    setIsOpen(false);
  };

  const login = () => {
    navigate('/signin');
    closeNavBar();
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-lg shadow-lg py-3' 
          : 'bg-transparent dark:bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                {/* <img src="Logo.png" className='h-12 lg:h-14' alt="logo" /> */}
                <FuelupLogo2 />
                {/* <FuelupLogo2 /> */}
              </div>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center gap-10">
                <motion.div 
                  className='flex items-center gap-10'
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  <motion.div variants={navItemVariants}>
                    <NavLink 
                      to="/" 
                      className={({ isActive }) => `
                        ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white dark:text-gray-200'} 
                        hover:text-emerald-500 dark:hover:text-emerald-400 px-2 py-1 text-sm font-medium transition-all duration-300 relative
                        ${isActive ? 'font-semibold' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          Home
                          {isActive && (
                            <motion.span 
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 dark:bg-emerald-400"
                              layoutId="navHighlight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <NavLink 
                      to="/services" 
                      className={({ isActive }) => `
                        ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white dark:text-gray-200'} 
                        hover:text-emerald-500 dark:hover:text-emerald-400 px-2 py-1 text-sm font-medium transition-all duration-300 relative
                        ${isActive ? 'font-semibold' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          Services
                          {isActive && (
                            <motion.span 
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 dark:bg-emerald-400"
                              layoutId="navHighlight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                </motion.div>
                
                <div className={`w-[1px] h-8 ${scrolled ? 'bg-gray-300 dark:bg-gray-700' : 'bg-white/30 dark:bg-gray-600/30'} transition-colors duration-300`} />
                
                <motion.div 
                  className='flex items-center gap-6'
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                  }}
                >
                  <motion.div variants={navItemVariants}>
                    <NavLink 
                      to="/signup" 
                      className={({ isActive }) => `
                        ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white dark:text-gray-200'} 
                        hover:text-emerald-500 dark:hover:text-emerald-400 px-2 py-1 text-sm font-medium transition-all duration-300 relative
                        ${isActive ? 'font-semibold' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          Sign Up
                          {isActive && (
                            <motion.span 
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 dark:bg-emerald-400"
                              layoutId="navHighlight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <button
                      onClick={login}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all duration-300 transform hover:scale-105"
                    >
                      Login
                    </button>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <ModeToggle />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-6">
            <ModeToggle />
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-full ${
                scrolled ? 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800' : 'text-white dark:text-gray-200 bg-white/10 dark:bg-gray-800/10'
              } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:outline-none transition-all duration-300`}
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={mobileMenuRef}
            className="md:hidden overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-3 pt-3 pb-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl rounded-b-xl border-t border-gray-100 dark:border-gray-800">
              <motion.div
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.1
                    }
                  }
                }}
                initial="closed"
                animate="open"
              >
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -10 }
                  }}
                >
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-emerald-500 dark:hover:text-emerald-400'
                      }`
                    }
                    onClick={closeNavBar}
                  >
                    Home
                  </NavLink>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -10 }
                  }}
                >
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-emerald-500 dark:hover:text-emerald-400'
                      }`
                    }
                    onClick={closeNavBar}
                  >
                    Services
                  </NavLink>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -10 }
                  }}
                >
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-emerald-500 dark:hover:text-emerald-400'
                      }`
                    }
                    onClick={closeNavBar}
                  >
                    Sign Up
                  </NavLink>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -10 }
                  }}
                >
                  <button
                    onClick={login}
                    className="w-full mt-2 text-center block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md transition-all duration-300"
                  >
                    Login
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;