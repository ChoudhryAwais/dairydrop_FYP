import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import home1 from '../../assets/home1.png';
import { MdLocalDrink, MdOutlineIcecream, MdLock, MdAcUnit } from 'react-icons/md';
import { GiCheeseWedge, GiButter, GiMilkCarton } from 'react-icons/gi';
import { FaJar, FaLeaf } from 'react-icons/fa';


const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45 }}
      className="space-y-16"
    >
      {/* Hero Section */}
      {/* Hero Section */}
      <div
        className="relative rounded-b-3xl shadow-lg overflow-hidden border border-white"
        style={{
          backgroundImage: `url(${home1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 md:px-12 py-12 md:py-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="text-green-300 font-bold text-sm tracking-wider uppercase mb-4">
              100% Pure & Organic
            </p>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Farm Fresh Goodness, Delivered to Your{' '}
              <span className="text-green-400">Doorstep</span>
            </h1>

            <p className="text-gray-100 text-lg mb-8 leading-relaxed">
              Experience the taste of purity with our 100% organic, hormone-free dairy products.
              Freshly sourced every morning from our trusted local farms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-green-600 transition-all duration-200 text-center"
              >
                View Catalog
              </Link>
            </div>

            <div className="flex gap-12 mt-10 text-white">
              <div>
                <p className="text-2xl font-bold">15k+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm">Organic Certified</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Browse by Category Section */}
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-green-600 font-bold text-sm tracking-wider uppercase mb-2">Our Collection</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse by Category</h2>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 w-full max-w-7xl">
            <Link
              to="/products?category=Milk"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/milk.jpg" alt="Milk" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Milk</h3>
            </Link>

            <Link
              to="/products?category=Yogurt"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/yoghurt.webp" alt="Yogurt" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Yogurt</h3>
            </Link>

            <Link
              to="/products?category=Cheese"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/cheese.avif" alt="Cheese" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Cheese</h3>
            </Link>

            <Link
              to="/products?category=Butter"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/butter.webp" alt="Butter" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Butter</h3>
            </Link>

            <Link
              to="/products?category=Cream"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/cream.jpg" alt="Cream" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Cream</h3>
            </Link>

            <Link
              to="/products?category=Ghee"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/ghee.jpg" alt="Ghee" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Ghee</h3>
            </Link>

            <Link
              to="/products?category=Ice Cream"
              className="group flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-4xl md:text-5xl shadow-md group-hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-gray-200 group-hover:border-green-400">
                <img src="/icecream.jpeg" alt="Ice Cream" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-125" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 group-hover:text-green-600 transition-colors">Ice Cream</h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <FaLeaf className="text-2xl text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">100% Organic Feed</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Our cattle graze on pesticide-free, natural pastures ensuring pure milk.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <MdLock className="text-2xl text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Touch-free Packaging</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Automated milking and bottling process with zero human contact.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <MdAcUnit className="text-2xl text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cold Chain Delivery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Maintained at 4°C from farm to your doorstep to preserve freshness.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to experience fresh goodness?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">Browse our selection of premium dairy products and place your order today!</p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          View All Products
        </Link>
      </div>
    </motion.div>
  );
};

export default Home;
