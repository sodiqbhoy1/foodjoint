"use client";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import CountUpStats from "./CountUpStats";
import { FiArrowRight, FiClock, FiStar, FiTruck, FiShield, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Homepage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Delicious food background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Delicious Food
              <span className="block text-[var(--brand)]">Delivered Fresh</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Experience the finest cuisine delivered straight to your doorstep. 
              Fresh ingredients, authentic flavors, and lightning-fast delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/menu"
                className="group bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Order Now
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/track-order"
                className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Track Order
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <CountUpStats end={1000} suffix="+" />
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <CountUpStats end={50} suffix="+" />
                <div className="text-sm text-gray-300">Menu Items</div>
              </div>
              <div className="text-center">
                <CountUpStats end={15} suffix="min" />
                <div className="text-sm text-gray-300">Avg Delivery</div>
              </div>
              <div className="text-center">
                <CountUpStats end={4.8} suffix="★" />
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FoodJoint?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to delivering not just food, but an exceptional experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-[var(--brand)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--brand)] transition-colors">
                  <FiClock className="w-8 h-8 text-[var(--brand)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Lightning-fast delivery in 15-30 minutes. Your food arrives hot and fresh.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-[var(--brand)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--brand)] transition-colors">
                  <FiStar className="w-8 h-8 text-[var(--brand)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Food</h3>
                <p className="text-gray-600">
                  Premium ingredients and expert chefs ensure every meal is perfection.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-[var(--brand)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--brand)] transition-colors">
                  <FiTruck className="w-8 h-8 text-[var(--brand)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Track your order from kitchen to doorstep with live updates.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-[var(--brand)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--brand)] transition-colors">
                  <FiShield className="w-8 h-8 text-[var(--brand)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
                <p className="text-gray-600">
                  Contactless delivery and secure payments for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Menu Items
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most loved dishes that keep customers coming back for more
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Sample Menu Items */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Signature Pizza"
                  width={1000}
                  height={256}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Signature Pizza</h3>
                <p className="text-gray-600 mb-4">Fresh dough, premium toppings, and melted cheese perfection</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--brand)]">₦2,500</span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Gourmet Burger"
                  width={1000}
                  height={256}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gourmet Burger</h3>
                <p className="text-gray-600 mb-4">Juicy beef patty with fresh vegetables and special sauce</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--brand)]">₦1,800</span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-gray-600">4.9</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Spicy Ramen"
                  width={1000}
                  height={256}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Spicy Ramen</h3>
                <p className="text-gray-600 mb-4">Rich broth with tender noodles and fresh toppings</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--brand)]">₦2,200</span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-gray-600">4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/menu"
              className="inline-flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              View Full Menu
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--brand)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Order?
            </h2>
            <p className="text-xl mb-8 text-red-100">
              Join thousands of satisfied customers and experience the best food delivery in town
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/menu"
                className="group bg-white text-[var(--brand)] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Start Ordering
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/track-order"
                className="group border-2 border-white text-white hover:bg-white hover:text-[var(--brand)] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Track Your Order
              </Link>
            </div>
            
            <div className="text-center text-red-100">
              <p className="text-lg">🚚 Free delivery on orders above ₦5,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-[var(--brand)] mb-4">FoodJoint</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted partner for delicious meals delivered fresh and fast. 
                Experience the taste of quality with every order.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons can be added here */}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menu</Link></li>
                <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <FiPhone className="w-4 h-4" />
                  <span>+234 800 000 0000</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FiMail className="w-4 h-4" />
                  <span>hello@foodjoint.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FiMapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FoodJoint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}