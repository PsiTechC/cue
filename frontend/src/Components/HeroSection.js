// import React, { useState, useEffect }  from 'react';
// import { useNavigate } from 'react-router-dom';

// const HeroSection = () => {
//   const navigate = useNavigate();  

//   const handleGetStartedClick = () => {
//     navigate('/signup');  
//   };



//   const paragraphs = [
//     "Empower your workflows with advanced tools designed to save time and maximize efficiency in every project.",
//     "Streamline processes with intuitive interfaces and AI-driven automation tailored to meet your unique requirements.",
//     "Collaborate with your team using tools that enhance creativity and deliver precision for all tasks.",
//     "Experience unmatched reliability with enterprise-grade infrastructure ensuring smooth and dependable workflows.",
//     "Join professionals who achieve faster results and greater efficiency by leveraging our innovative platform.",
//   ];

//   const [currentText, setCurrentText] = useState("");
//   const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [typingPosition, setTypingPosition] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false); 

//   useEffect(() => {
//     if (isTransitioning) {
//       setCurrentText(""); 
//       setTimeout(() => {
//         setIsTransitioning(false); 
//         setTypingPosition(0); 
//       }, 100); 
//       return; 
//     }

//     const currentParagraph = paragraphs[currentParagraphIndex];
//     const isTypingCompleted = !isDeleting && typingPosition === currentParagraph.length;
//     const isBackspacingCompleted = isDeleting && typingPosition === 0;

//     let typingSpeed = isDeleting ? 25 : 20;

//     const handleTyping = () => {
//       if (!isDeleting) {
//         // Typing
//         setCurrentText(currentParagraph.slice(0, typingPosition + 1));
//         setTypingPosition((prev) => prev + 1);

//         if (isTypingCompleted) {
//           setTimeout(() => setIsDeleting(true), 2000); // Pause before backspacing
//         }
//       } else {
//         // Backspacing
//         setCurrentText(currentParagraph.slice(0, typingPosition - 1));
//         setTypingPosition((prev) => prev - 1);

//         if (isBackspacingCompleted) {
//           setIsDeleting(false);
//           setIsTransitioning(true); // Start transitioning to the next paragraph
//           setCurrentParagraphIndex((prev) => (prev + 1) % paragraphs.length); // Move to the next paragraph
//         }
//       }
//     };

//     const timer = setTimeout(handleTyping, typingSpeed);
//     return () => clearTimeout(timer);
//   }, [typingPosition, isDeleting, currentParagraphIndex, isTransitioning, paragraphs]);


//   return (
//     <>
//       {/* main section */}
//     <section className="bg-white py-16 px-8">
//   <div className="max-w-screen-lg mx-auto">
//     {/* Header Section */}
//     <div className="text-left" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       <h1 className="text-7xl font-light mb-8 leading-tight">
//         Explore,<br />limitless possibilities. <br /> Smash deadlines.
//       </h1>
//       <p
//         className="text-2xl font-light mb-12 text-gray-700 font-inter"
//         style={{ whiteSpace: "nowrap" }}
//       >
//         {currentText}
//         <span className="border-r-2 border-gray-700 animate-blink"></span>
//       </p>
//     </div>

//     {/* Button */}
//     <div className="mt-12">
//       <button
//         className="relative flex items-center justify-between bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 group"
//         style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '1.25rem' }}
//         onClick={handleGetStartedClick}
//       >
//         Start creating
//         <div
//           className="ml-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-transparent group-hover:text-blue-600 transition-all duration-300"
//         >
//           →
//         </div>
//         <div
//           className="absolute inset-0 bg-blue-600 z-0 transition-all duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"
//         ></div>
//         <span
//           className="absolute inset-0 z-10 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out"
//         >
//           Start creating
//         </span>
//       </button>
//     </div>
//   </div>
// </section>





//       <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 px-8">
//   <div className="max-w-screen-lg mx-auto">
//     {/* Header Section */}
//     <div className="text-left" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       <h1 className="text-5xl font-light mb-8 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
//         AI Voice Over,<br />Your Creative Partner
//       </h1>
//       <p className="text-xl font-light mb-12 text-gray-700">
//         Harness the power of AI to convert text into expressive, high-quality voiceovers for your projects.
//       </p>
//     </div>

//     {/* Features Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       {/* Feature 1 */}
//       <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2M8 16h8M4 20h16M4 8h16M4 12h16" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Realistic Voice Generation</h2>
//         </div>
//         <p className="text-gray-600">
//           Create natural-sounding voiceovers in multiple languages and styles with advanced AI models.
//         </p>
//       </div>

//       {/* Feature 2 */}
//       <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553 4.553A9 9 0 0114.49 20h0a8.96 8.96 0 01-6.493-2.707M9 10h3.586a1 1 0 00.707-1.707L8.5 2.5A1.5 1.5 0 006 4v3" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Customizable Voice Profiles</h2>
//         </div>
//         <p className="text-gray-600">
//           Personalize pitch, tone, and style to match your brand or project needs with ease.
//         </p>
//       </div>

//       {/* Feature 3 */}
//       <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10l-6 6m0 0l-6-6m6 6V4" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Seamless Integration</h2>
//         </div>
//         <p className="text-gray-600">
//           Effortlessly integrate AI-generated voiceovers into your workflows and streamline audio production.
//         </p>
//       </div>
//     </div>
//   </div>
// </section>





//       <section className="w-full bg-[#F2EFE6] py-12 mt-0.49">
//   <div className="max-w-screen-lg mx-auto px-8 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

//     <div className="text-left">
//       <h2 className="text-5xl font-light leading-tight text-black mb-6">
//         Why the *PROJECT NAME*<br /> is the best choice for you
//       </h2>
//     </div>

//     <div className="text-left space-y-6">
//     <p className="text-lg text-gray-700 leading-relaxed">
//   Choosing our platform means empowering your workflow with cutting-edge technology designed to save time and maximize efficiency.
//   We provide enterprise-grade infrastructure, ensuring reliability, speed, and continuous backups for your peace of mind.
// </p>
// <p className="text-lg text-gray-700 leading-relaxed">
//   Our advanced AI-driven tools, customizable templates, and detailed metadata management help you create professional-grade outputs effortlessly.
//   Focus on your creativity while we handle the heavy lifting.
// </p>
// <p className="text-lg text-gray-700 leading-relaxed">
//   Collaborate seamlessly with a range of team tools, improve your visibility with SEO optimizations, and scale your projects with eCommerce-ready solutions.
//   Our secure platform ensures your data remains safe at all times.
// </p>

//       <div className="flex justify-start mt-8">
//         <button
//           className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800"
//           onClick={handleGetStartedClick}
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
//   </div>
// </section>


//     </>
//   );
// };

// export default HeroSection;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ParallaxProvider, Parallax } from "react-scroll-parallax";

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const handleGetStartedClick = () => {
//     navigate("/signup");
//   };

//   const paragraphs = [
//     "Empower your workflows with advanced tools designed to save time and maximize efficiency in every project.",
//     "Streamline processes with intuitive interfaces and AI-driven automation tailored to meet your unique requirements.",
//     "Collaborate with your team using tools that enhance creativity and deliver precision for all tasks.",
//     "Experience unmatched reliability with enterprise-grade infrastructure ensuring smooth and dependable workflows.",
//     "Join professionals who achieve faster results and greater efficiency by leveraging our innovative platform.",
//   ];

//   const [currentText, setCurrentText] = useState("");
//   const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [typingPosition, setTypingPosition] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   useEffect(() => {
//     if (isTransitioning) {
//       setCurrentText("");
//       setTimeout(() => {
//         setIsTransitioning(false);
//         setTypingPosition(0);
//       }, 100);
//       return;
//     }

//     const currentParagraph = paragraphs[currentParagraphIndex];
//     const isTypingCompleted =
//       !isDeleting && typingPosition === currentParagraph.length;
//     const isBackspacingCompleted = isDeleting && typingPosition === 0;

//     let typingSpeed = isDeleting ? 20 : 25;

//     const handleTyping = () => {
//       if (!isDeleting) {
//         setCurrentText(currentParagraph.slice(0, typingPosition + 1));
//         setTypingPosition((prev) => prev + 1);

//         if (isTypingCompleted) {
//           setTimeout(() => setIsDeleting(true), 2000); // Pause before backspacing
//         }
//       } else {
//         setCurrentText(currentParagraph.slice(0, typingPosition - 1));
//         setTypingPosition((prev) => prev - 1);

//         if (isBackspacingCompleted) {
//           setIsDeleting(false);
//           setIsTransitioning(true); // Start transitioning to the next paragraph
//           setCurrentParagraphIndex(
//             (prev) => (prev + 1) % paragraphs.length
//           ); // Move to the next paragraph
//         }
//       }
//     };

//     const timer = setTimeout(handleTyping, typingSpeed);
//     return () => clearTimeout(timer);
//   }, [typingPosition, isDeleting, currentParagraphIndex, isTransitioning, paragraphs]);


//   return (
//     <ParallaxProvider>
//       <div className="relative">
//         {/* Main Section */}
//         <section className="bg-white py-16 px-8 sticky top-0 z-10">
//           <div className="max-w-screen-lg mx-auto">
//             <div
//               className="text-left"
//               style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
//             >
//               <h1 className="text-8xl font-light mb-8 leading-tight">
//                 Explore,<br />
//                 Limitless possibilities. <br /> Smash deadlines.
//               </h1>
//               <p
//                 className="text-2xl font-light mb-12 text-gray-700 font-inter"
//                 style={{ whiteSpace: "nowrap" }}
//               >
//                 {currentText}
//                 <span className="border-r-2 border-gray-700 animate-blink"></span>
//               </p>
//             </div>

//             <div className="mt-12">
//               <button
//                 className="relative flex items-center justify-between bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 group"
//                 style={{
//                   fontFamily: "Helvetica Neue, Arial, sans-serif",
//                   fontSize: "1.25rem",
//                 }}
//                 onClick={handleGetStartedClick}
//               >
//                 Start Creating
//                 <div
//                   className="ml-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-transparent group-hover:text-blue-600 transition-all duration-300"
//                   style={{
//                     fontSize: "1rem", // Adjust font size if needed
//                     lineHeight: "5",
//                   }}
//                 >
//                   →
//                 </div>

//                 <div
//                   className="absolute inset-0 bg-blue-600 z-0 transition-all duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"
//                 ></div>
//                 <span
//                   className="absolute inset-0 z-10 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out"
//                 >
//                   Start Creating
//                 </span>
//               </button>
//               <p className="text-[10px] ml-9 text-gray mt-1">Start for free. No credit card required.</p>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
//           <div className="max-w-screen-lg mx-auto">
//             {/* Header Section */}
//             <div className="flex items-center justify-between space-x-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//               {/* Left Side (Text) */}
//               <div className="w-1/2 text-left">
//                 <h1 className="text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
//                   AI Voice Over,<br />Your Creative Partner
//                 </h1>
//                 <p className="text-xl font-light mb-12 text-gray-700">
//                   Harness the power of AI to convert text into expressive, high-quality voiceovers for your projects.
//                 </p>
//               </div>

//               {/* Right Side (Cards) */}
//               <div className="w-1/2">
//                 <div className="space-y-8 FEATURESDIV">
//                   {/* Feature 1 */}
//                   <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2M8 16h8M4 20h16M4 8h16M4 12h16" />
//                         </svg>
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Realistic Voice Generation</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Create natural-sounding voiceovers in multiple languages and styles with advanced AI models.
//                     </p>
//                   </div>

//                   {/* Feature 2 */}
//                   <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553 4.553A9 9 0 0114.49 20h0a8.96 8.96 0 01-6.493-2.707M9 10h3.586a1 1 0 00.707-1.707L8.5 2.5A1.5 1.5 0 006 4v3" />
//                         </svg>
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Customizable Voice Profiles</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Personalize pitch, tone, and style to match your brand or project needs with ease.
//                     </p>
//                   </div>

//                   {/* Feature 3 */}
//                   <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10l-6 6m0 0l-6-6m6 6V4" />
//                         </svg>
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Seamless Integration</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Effortlessly integrate AI-generated voiceovers into your workflows and streamline audio production.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </section>





//         {/* Additional Sections */}
//         <section className="w-full bg-[#F2EFE6] py-12 mt-0.49 relative z-20">
//           <div className="max-w-screen-lg mx-auto px-8 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

//             <div className="text-left">
//               <h2 className="text-5xl font-light leading-tight text-black mb-6">
//                 Why the *PROJECT NAME*<br /> is the best choice for you
//               </h2>
//             </div>

//             <div className="text-left space-y-6">
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Choosing our platform means empowering your workflow with cutting-edge technology designed to save time and maximize efficiency.
//                 We provide enterprise-grade infrastructure, ensuring reliability, speed, and continuous backups for your peace of mind.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Our advanced AI-driven tools, customizable templates, and detailed metadata management help you create professional-grade outputs effortlessly.
//                 Focus on your creativity while we handle the heavy lifting.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Collaborate seamlessly with a range of team tools, improve your visibility with SEO optimizations, and scale your projects with eCommerce-ready solutions.
//                 Our secure platform ensures your data remains safe at all times.
//               </p>

//               <div className="flex justify-start mt-8">
//                 <button
//                   className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800"
//                   onClick={handleGetStartedClick}
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </ParallaxProvider>
//   );
// };

// export default HeroSection;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ParallaxProvider, Parallax } from "react-scroll-parallax";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMusic, faClock, faFileAlt, faHeadphonesAlt, faSlidersH, faPlug  } from '@fortawesome/free-solid-svg-icons';

// // Initialize AOS
// AOS.init({
//   duration: 1000,  // Animation duration
//   once: true,      // Trigger animation only once
// });

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const handleGetStartedClick = () => {
//     navigate("/signup");
//   };

//   const paragraphs = [
//     "Empower your workflows with advanced tools designed to save time and maximize efficiency in every project.",
//     "Streamline processes with intuitive interfaces and AI-driven automation tailored to meet your unique requirements.",
//     "Collaborate with your team using tools that enhance creativity and deliver precision for all tasks.",
//     "Experience unmatched reliability with enterprise-grade infrastructure ensuring smooth and dependable workflows.",
//     "Join professionals who achieve faster results and greater efficiency by leveraging our innovative platform.",
//   ];

//   const [currentText, setCurrentText] = useState("");
//   const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [typingPosition, setTypingPosition] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     if (isTransitioning) {
//       setCurrentText("");
//       setTimeout(() => {
//         setIsTransitioning(false);
//         setTypingPosition(0);
//       }, 100);
//       return;
//     }

//     const currentParagraph = paragraphs[currentParagraphIndex];
//     const isTypingCompleted =
//       !isDeleting && typingPosition === currentParagraph.length;
//     const isBackspacingCompleted = isDeleting && typingPosition === 0;

//     let typingSpeed = isDeleting ? 20 : 25;

//     const handleTyping = () => {
//       if (!isDeleting) {
//         setCurrentText(currentParagraph.slice(0, typingPosition + 1));
//         setTypingPosition((prev) => prev + 1);

//         if (isTypingCompleted) {
//           setTimeout(() => setIsDeleting(true), 2000); // Pause before backspacing
//         }
//       } else {
//         setCurrentText(currentParagraph.slice(0, typingPosition - 1));
//         setTypingPosition((prev) => prev - 1);

//         if (isBackspacingCompleted) {
//           setIsDeleting(false);
//           setIsTransitioning(true); // Start transitioning to the next paragraph
//           setCurrentParagraphIndex(
//             (prev) => (prev + 1) % paragraphs.length
//           ); // Move to the next paragraph
//         }
//       }
//     };

//     const timer = setTimeout(handleTyping, typingSpeed);
//     return () => clearTimeout(timer);
//   }, [typingPosition, isDeleting, currentParagraphIndex, isTransitioning, paragraphs]);

//   return (
//     <ParallaxProvider>
//       <div className="relative">
//         {/* Main Section */}
//         <section className="bg-white py-16 px-8 sticky top-0 z-10">
//           <div className="max-w-screen-lg mx-auto">
//             <div
//               className="text-left"
//               style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
//             >
//               <h1 className="text-8xl font-light mb-8 leading-tight">
//                 Explore,<br />
//                 Limitless possibilities. <br /> Smash deadlines.
//               </h1>
//               <p
//                 className="text-2xl font-light mb-12 text-gray-700 font-inter"
//                 style={{ whiteSpace: "nowrap" }}
//               >
//                 {currentText}
//                 <span className="border-r-2 border-gray-700 animate-blink"></span>
//               </p>
//             </div>

//             <div className="mt-12">
//               <button
//                 className="relative flex items-center justify-between bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 group"
//                 style={{
//                   fontFamily: "Helvetica Neue, Arial, sans-serif",
//                   fontSize: "1.25rem",
//                 }}
//                 onClick={handleGetStartedClick}
//               >
//                 Start Creating
//                 <div
//                   className="ml-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-transparent group-hover:text-blue-600 transition-all duration-300"
//                   style={{
//                     fontSize: "1rem", // Adjust font size if needed
//                     lineHeight: "5",
//                   }}
//                 >
//                   →
//                 </div>

//                 <div
//                   className="absolute inset-0 bg-blue-600 z-0 transition-all duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"
//                 ></div>
//                 <span
//                   className="absolute inset-0 z-10 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out"
//                 >
//                   Start Creating
//                 </span>
//               </button>
//               <p className="text-[10px] ml-9 text-gray mt-1">Start for free. No credit card required.</p>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
//           <div className="max-w-screen-lg mx-auto">
//             {/* Header Section */}
//             <div className="flex items-center justify-between space-x-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//               {/* Left Side (Text) */}
//               <div className="w-1/2 text-left">
//                 <h1 className="text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-orange-500"
//                   data-aos="fade-up">
//                   AI Voice Over,<br />Your Creative Partner
//                 </h1>
//                 <p className="text-xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
//                   Harness the power of AI to convert text into expressive, high-quality voiceovers for your projects.
//                 </p>
//               </div>

//               {/* Right Side (Cards with Parallax) */}
//               <div className="w-1/2">
//                 <div className="space-y-8">
//                   {/* Feature 1 */}
//                   <div className="space-y-4">
//       {/* Feature 1 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="300"
//       >
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             {/* Headphones Icon for "Realistic Voice Generation" */}
//             <FontAwesomeIcon icon={faHeadphonesAlt} className="h-4 w-4" />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Realistic Voice Generation</h2>
//         </div>
//         <p className="text-gray-600">
//           Create natural-sounding voiceovers in multiple languages and styles with advanced AI models.
//         </p>
//       </div>

//       {/* Feature 2 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="400"
//       >
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             {/* Sliders Icon for "Customizable Voice Profiles" */}
//             <FontAwesomeIcon icon={faSlidersH} className="h-4 w-4" />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Customizable Voice Profiles</h2>
//         </div>
//         <p className="text-gray-600">
//           Personalize pitch, tone, and style to match your brand or project needs with ease.
//         </p>
//       </div>

//       {/* Feature 3 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="500"
//       >
//         <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//           <div className="text-indigo-500">
//             {/* Plug Icon for "Seamless Integration" */}
//             <FontAwesomeIcon icon={faPlug} className="h-4 w-4" />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Seamless Integration</h2>
//         </div>
//         <p className="text-gray-600">
//           Effortlessly integrate AI-generated voiceovers into your workflows and streamline audio production.
//         </p>
//       </div>
//     </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
//           <div className="max-w-screen-lg mx-auto">
//             {/* Header Section */}
//             <div className="flex items-center justify-between space-x-16" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

//               {/* Left Side (Feature Cards with Parallax) */}
//               <div className="w-1/2">
//                 <div className="space-y-8">

//                 <div className="space-y-4">
//       {/* Feature 1 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="300"
//       >
//         <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//           <div className="text-orange-400">
//             {/* Music Note Icon for "Comprehensive Music Metadata" */}
//             <FontAwesomeIcon icon={faMusic} className="h-4 w-4" />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Comprehensive Music Metadata</h2>
//         </div>
//         <p className="text-gray-600">
//           Generate detailed music cue sheets that include metadata such as track names, composers, and album information for each piece of music.
//         </p>
//       </div>

//       {/* Feature 2 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="400"
//       >
//         <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//           <div className="text-orange-400">
//             {/* Clock Icon for "Precise Timing Information" */}
//             <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Precise Timing Information</h2>
//         </div>
//         <p className="text-gray-600">
//           Accurately record the start and end points for each piece of music to ensure proper synchronization with your content.
//         </p>
//       </div>

//       {/* Feature 3 */}
//       <div
//         className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//         data-aos="fade-up"
//         data-aos-delay="500"
//       >
//         <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//           <div className="text-orange-400">
//             {/* Document Icon for "Effortless Cue Sheet Generation" */}
//             <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 " />
//           </div>
//           <h2 className="text-lg font-bold text-gray-800">Effortless Cue Sheet Generation</h2>
//         </div>
//         <p className="text-gray-600">
//           Seamlessly create and export professional music cue sheets that fit the needs of your broadcast or film project.
//         </p>
//       </div>
//     </div>


//                 </div>
//               </div>

//               {/* Right Side (Heading and Text) */}
//               <div className="w-1/2 text-left">
//                 <h1 className="text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-indigo-500" data-aos="fade-up">
//                   Cue Sheet Generation,<br />Streamline Your Music Metadata
//                 </h1>
//                 <p className="text-xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
//                   Automate the creation of music cue sheets with detailed metadata and precise start/end point data for every track in your program.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>



//         {/* Additional Sections */}
//         <section className="w-full bg-[#F2EFE6] py-12 mt-0.49 relative z-20">
//           <div className="max-w-screen-lg mx-auto px-8 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

//             <div className="text-left">
//               <h2 className="text-5xl font-light leading-tight text-black mb-6">
//                 Why the *PROJECT NAME*<br /> is the best choice for you
//               </h2>
//             </div>

//             <div className="text-left space-y-6">
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Choosing our platform means empowering your workflow with cutting-edge technology designed to save time and maximize efficiency.
//                 We provide enterprise-grade infrastructure, ensuring reliability, speed, and continuous backups for your peace of mind.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Our advanced AI-driven tools, customizable templates, and detailed metadata management help you create professional-grade outputs effortlessly.
//                 Focus on your creativity while we handle the heavy lifting.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Collaborate seamlessly with a range of team tools, improve your visibility with SEO optimizations, and scale your projects with eCommerce-ready solutions.
//                 Our secure platform ensures your data remains safe at all times.
//               </p>

//               <div className="flex justify-start mt-8">
//                 <button
//                   className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800"
//                   onClick={handleGetStartedClick}
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>


//       </div>
//     </ParallaxProvider>
//   );
// };

// export default HeroSection;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ParallaxProvider, Parallax } from "react-scroll-parallax";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMusic, faClock, faFileAlt, faHeadphonesAlt, faSlidersH, faPlug  } from '@fortawesome/free-solid-svg-icons';

// // Initialize AOS
// AOS.init({
//   duration: 1000,  // Animation duration
//   once: true,      // Trigger animation only once
// });

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const handleGetStartedClick = () => {
//     navigate("/signup");
//   };

//   const paragraphs = [
//     "Empower your workflows with advanced tools designed to save time and maximize efficiency in every project.",
//     "Streamline processes with intuitive interfaces and AI-driven automation tailored to meet your unique requirements.",
//     "Collaborate with your team using tools that enhance creativity and deliver precision for all tasks.",
//     "Experience unmatched reliability with enterprise-grade infrastructure ensuring smooth and dependable workflows.",
//     "Join professionals who achieve faster results and greater efficiency by leveraging our innovative platform.",
//   ];

//   const [currentText, setCurrentText] = useState("");
//   const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [typingPosition, setTypingPosition] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     if (isTransitioning) {
//       setCurrentText("");
//       setTimeout(() => {
//         setIsTransitioning(false);
//         setTypingPosition(0);
//       }, 100);
//       return;
//     }

//     const currentParagraph = paragraphs[currentParagraphIndex];
//     const isTypingCompleted =
//       !isDeleting && typingPosition === currentParagraph.length;
//     const isBackspacingCompleted = isDeleting && typingPosition === 0;

//     let typingSpeed = isDeleting ? 20 : 25;

//     const handleTyping = () => {
//       if (!isDeleting) {
//         setCurrentText(currentParagraph.slice(0, typingPosition + 1));
//         setTypingPosition((prev) => prev + 1);

//         if (isTypingCompleted) {
//           setTimeout(() => setIsDeleting(true), 2000); // Pause before backspacing
//         }
//       } else {
//         setCurrentText(currentParagraph.slice(0, typingPosition - 1));
//         setTypingPosition((prev) => prev - 1);

//         if (isBackspacingCompleted) {
//           setIsDeleting(false);
//           setIsTransitioning(true); // Start transitioning to the next paragraph
//           setCurrentParagraphIndex(
//             (prev) => (prev + 1) % paragraphs.length
//           ); // Move to the next paragraph
//         }
//       }
//     };

//     const timer = setTimeout(handleTyping, typingSpeed);
//     return () => clearTimeout(timer);
//   }, [typingPosition, isDeleting, currentParagraphIndex, isTransitioning, paragraphs]);

//   return (
//     <ParallaxProvider>
//       <div className="relative">
//         {/* Main Section */}
//         <section className="bg-white py-16 px-8 sticky top-0 z-10">
//           <div className="max-w-screen-lg mx-auto">
//             <div
//               className="text-left"
//               style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
//             >
//               <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light mb-8 leading-tight">
//                 Explore,<br />
//                 Limitless possibilities. <br /> Smash deadlines.
//               </h1>
//               <p
//                 className="text-xl sm:text-2xl font-light mb-12 text-gray-700 font-inter"
//                 style={{ whiteSpace: "nowrap" }}
//               >
//                 {currentText}
//                 <span className="border-r-2 border-gray-700 animate-blink"></span>
//               </p>
//             </div>

//             <div className="mt-12">
//               <button
//                 className="relative flex items-center justify-between bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 group"
//                 style={{
//                   fontFamily: "Helvetica Neue, Arial, sans-serif",
//                   fontSize: "1.25rem",
//                 }}
//                 onClick={handleGetStartedClick}
//               >
//                 Start Creating
//                 <div
//                   className="ml-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-transparent group-hover:text-blue-600 transition-all duration-300"
//                   style={{
//                     fontSize: "1rem", // Adjust font size if needed
//                     lineHeight: "5",
//                   }}
//                 >
//                   →
//                 </div>

//                 <div
//                   className="absolute inset-0 bg-blue-600 z-0 transition-all duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"
//                 ></div>
//                 <span
//                   className="absolute inset-0 z-10 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out"
//                 >
//                   Start Creating
//                 </span>
//               </button>
//               <p className="text-[10px] ml-9 text-gray mt-1">Start for free. No credit card required.</p>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
//           <div className="max-w-screen-lg mx-auto">
//             {/* Header Section */}
//             <div className="flex flex-col sm:flex-row sm:space-x-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//               {/* Left Side (Text) */}
//               <div className="w-full sm:w-1/2 text-left mb-8 sm:mb-0">
//                 <h1 className="text-3xl sm:text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-orange-500"
//                   data-aos="fade-up">
//                   AI Voice Over,<br />Your Creative Partner
//                 </h1>
//                 <p className="text-xl sm:text-2xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
//                   Harness the power of AI to convert text into expressive, high-quality voiceovers for your projects.
//                 </p>
//               </div>

//               {/* Right Side (Cards with Parallax) */}
//               <div className="w-full sm:w-1/2">
//                 <div className="space-y-8">
//                   {/* Feature 1 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="300"
//                   >
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <FontAwesomeIcon icon={faHeadphonesAlt} className="h-4 w-4" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Realistic Voice Generation</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Create natural-sounding voiceovers in multiple languages and styles with advanced AI models.
//                     </p>
//                   </div>

//                   {/* Feature 2 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="400"
//                   >
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <FontAwesomeIcon icon={faSlidersH} className="h-4 w-4" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Customizable Voice Profiles</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Personalize pitch, tone, and style to match your brand or project needs with ease.
//                     </p>
//                   </div>

//                   {/* Feature 3 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="500"
//                   >
//                     <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
//                       <div className="text-indigo-500">
//                         <FontAwesomeIcon icon={faPlug} className="h-4 w-4" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Seamless Integration</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Effortlessly integrate AI-generated voiceovers into your workflows and streamline audio production.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
//           <div className="max-w-screen-lg mx-auto">
//             {/* Header Section */}
//             <div className="flex flex-col sm:flex-row sm:space-x-16" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//               {/* Left Side (Feature Cards with Parallax) */}
//               <div className="w-full sm:w-1/2">
//                 <div className="space-y-8">
//                   {/* Feature 1 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="300"
//                   >
//                     <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//                       <div className="text-orange-400">
//                         <FontAwesomeIcon icon={faMusic} className="h-4 w-4" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Comprehensive Music Metadata</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Generate detailed music cue sheets that include metadata such as track names, composers, and album information for each piece of music.
//                     </p>
//                   </div>

//                   {/* Feature 2 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="400"
//                   >
//                     <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//                       <div className="text-orange-400">
//                         <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Precise Timing Information</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Accurately record the start and end points for each piece of music to ensure proper synchronization with your content.
//                     </p>
//                   </div>

//                   {/* Feature 3 */}
//                   <div
//                     className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
//                     data-aos="fade-up"
//                     data-aos-delay="500"
//                   >
//                     <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
//                       <div className="text-orange-400">
//                         <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 " />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">Effortless Cue Sheet Generation</h2>
//                     </div>
//                     <p className="text-gray-600">
//                       Seamlessly create and export professional music cue sheets that fit the needs of your broadcast or film project.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side (Heading and Text) */}
//               <div className="w-full sm:w-1/2 text-left">
//                 <h1 className="text-3xl sm:text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-indigo-500" data-aos="fade-up">
//                   Cue Sheet Generation,<br />Streamline Your Music Metadata
//                 </h1>
//                 <p className="text-xl sm:text-2xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
//                   Automate the creation of music cue sheets with detailed metadata and precise start/end point data for every track in your program.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Additional Sections */}
//         <section className="w-full bg-[#F2EFE6] py-12 mt-0.49 relative z-20">
//           <div className="max-w-screen-lg mx-auto px-8 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

//             <div className="text-left">
//               <h2 className="text-4xl sm:text-5xl font-light leading-tight text-black mb-6">
//                 Why the *PROJECT NAME*<br /> is the best choice for you
//               </h2>
//             </div>

//             <div className="text-left space-y-6">
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Choosing our platform means empowering your workflow with cutting-edge technology designed to save time and maximize efficiency.
//                 We provide enterprise-grade infrastructure, ensuring reliability, speed, and continuous backups for your peace of mind.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Our advanced AI-driven tools, customizable templates, and detailed metadata management help you create professional-grade outputs effortlessly.
//                 Focus on your creativity while we handle the heavy lifting.
//               </p>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 Collaborate seamlessly with a range of team tools, improve your visibility with SEO optimizations, and scale your projects with eCommerce-ready solutions.
//                 Our secure platform ensures your data remains safe at all times.
//               </p>

//               <div className="flex justify-start mt-8">
//                 <button
//                   className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800"
//                   onClick={handleGetStartedClick}
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </ParallaxProvider>
//   );
// };

// export default HeroSection;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faClock, faFileAlt, faHeadphonesAlt, faSlidersH, faPlug  } from '@fortawesome/free-solid-svg-icons';

// Initialize AOS
AOS.init({
  duration: 1000,  // Animation duration
  once: true,      // Trigger animation only once
});

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/signup");
  };

  const paragraphs = [
    "Empower workflows with advanced tools designed to save time and maximize efficiency.",
    "Streamline processes with intuitive interfaces and AI-driven automation tailored to your needs.",
    "Collaborate with your team using tools that enhance creativity and deliver precision for all tasks.",
    "Experience unmatched reliability with enterprise-grade infrastructure ensuring smooth workflows.",
    "Join professionals who achieve faster results and greater efficiency using our platform.",
  ];
  

  const [currentText, setCurrentText] = useState("");
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingPosition, setTypingPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    if (isTransitioning) {
      setCurrentText("");
      setTimeout(() => {
        setIsTransitioning(false);
        setTypingPosition(0);
      }, 100);
      return;
    }

    const currentParagraph = paragraphs[currentParagraphIndex];
    const isTypingCompleted =
      !isDeleting && typingPosition === currentParagraph.length;
    const isBackspacingCompleted = isDeleting && typingPosition === 0;

    let typingSpeed = isDeleting ? 20 : 25;

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(currentParagraph.slice(0, typingPosition + 1));
        setTypingPosition((prev) => prev + 1);

        if (isTypingCompleted) {
          setTimeout(() => setIsDeleting(true), 2000); // Pause before backspacing
        }
      } else {
        setCurrentText(currentParagraph.slice(0, typingPosition - 1));
        setTypingPosition((prev) => prev - 1);

        if (isBackspacingCompleted) {
          setIsDeleting(false);
          setIsTransitioning(true); // Start transitioning to the next paragraph
          setCurrentParagraphIndex(
            (prev) => (prev + 1) % paragraphs.length
          ); // Move to the next paragraph
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typingPosition, isDeleting, currentParagraphIndex, isTransitioning, paragraphs]);

  return (
    <ParallaxProvider>
      <div className="relative">
        {/* Main Section */}
        <section className="bg-white py-16 px-8 sticky top-0 z-10">
          <div className="max-w-screen-lg mx-auto">
            <div
              className="text-left"
              style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light mb-8 leading-tight">
                Explore,<br />
                Limitless possibilities. <br /> Smash deadlines. <br /> <p className="gradient-text">With MEDai.</p> 
              </h1>
              {/* Typing text only on large screens */}
              <p
                className="text-xl sm:text-2xl font-light mb-12 text-gray-700 font-inter hidden lg:block"
                style={{ whiteSpace: "nowrap" }}
              >
                {currentText}
                <span className="border-r-2 border-gray-700 animate-blink"></span>
              </p>
            </div>

            <div className="mt-12">
              <button
                className="relative flex items-center justify-between bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 group"
                style={{
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  fontSize: "1.25rem",
                }}
                onClick={handleGetStartedClick}
              >
                Start Creating
                <div
                  className="ml-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-transparent group-hover:text-blue-600 transition-all duration-300"
                  style={{
                    fontSize: "1rem", // Adjust font size if needed
                    lineHeight: "5",
                  }}
                >
                  →
                </div>

                <div
                  className="absolute inset-0 bg-blue-600 z-0 transition-all duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"
                ></div>
                <span
                  className="absolute inset-0 z-10 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out"
                >
                  Start Creating
                </span>
              </button>
              <p className="text-[10px] ml-9 text-gray mt-1">Start for free. No credit card required.</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
          <div className="max-w-screen-lg mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:space-x-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              {/* Left Side (Text) */}
              <div className="w-full sm:w-1/2 text-left mb-8 sm:mb-0">
                <h1 className="text-3xl sm:text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-orange-500"
                  data-aos="fade-up">
                  AI Voice Over,<br />Your Creative Partner
                </h1>
                <p className="text-xl sm:text-2xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
                  Harness the power of AI to convert text into expressive, high-quality voiceovers for your projects.
                </p>
              </div>

              {/* Right Side (Cards with Parallax) */}
              <div className="w-full sm:w-1/2">
                <div className="space-y-8">
                  {/* Feature 1 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
                      <div className="text-indigo-500">
                        <FontAwesomeIcon icon={faHeadphonesAlt} className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Realistic Voice Generation</h2>
                    </div>
                    <p className="text-gray-600">
                      Create natural-sounding voiceovers in multiple languages and styles with advanced AI models.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
                      <div className="text-indigo-500">
                        <FontAwesomeIcon icon={faSlidersH} className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Customizable Voice Profiles</h2>
                    </div>
                    <p className="text-gray-600">
                      Personalize pitch, tone, and style to match your brand or project needs with ease.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="border-l-4 border-indigo-500 pl-4 flex items-center space-x-3">
                      <div className="text-indigo-500">
                        <FontAwesomeIcon icon={faPlug} className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Seamless Integration</h2>
                    </div>
                    <p className="text-gray-600">
                      Effortlessly integrate AI-generated voiceovers into your workflows and streamline audio production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-8 relative z-20">
          <div className="max-w-screen-lg mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:space-x-16" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              {/* Left Side (Feature Cards with Parallax) */}
              <div className="w-full sm:w-1/2 order-last sm:order-first">
                <div className="space-y-8">
                  {/* Feature 1 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
                      <div className="text-orange-400">
                        <FontAwesomeIcon icon={faMusic} className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Comprehensive Music Metadata</h2>
                    </div>
                    <p className="text-gray-600">
                      Generate detailed music cue sheets that include metadata such as track names, composers, and album information for each piece of music.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
                      <div className="text-orange-400">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Precise Timing Information</h2>
                    </div>
                    <p className="text-gray-600">
                      Accurately record the start and end points for each piece of music to ensure proper synchronization with your content.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="border-l-4 border-orange-400 pl-4 flex items-center space-x-3">
                      <div className="text-orange-400">
                        <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 " />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Effortless Cue Sheet Generation</h2>
                    </div>
                    <p className="text-gray-600">
                      Seamlessly create and export professional music cue sheets that fit the needs of your broadcast or film project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side (Heading and Text) */}
              <div className="w-full sm:w-1/2 text-left">
                <h1 className="text-3xl sm:text-5xl font-light mb-10 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-indigo-500" data-aos="fade-up">
                  Cue Sheet Generation,<br />Streamline Your Music Metadata
                </h1>
                <p className="text-xl sm:text-2xl font-light mb-12 text-gray-700" data-aos="fade-up" data-aos-delay="200">
                  Automate the creation of music cue sheets with detailed metadata and precise start/end point data for every track in your program.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Sections */}
        <section className="w-full bg-[#F2EFE6] py-12 mt-0.49 relative z-20">
          <div className="max-w-screen-lg mx-auto px-8 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>

            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl font-light leading-tight text-black mb-6 ml-6">
                Why the MEDai<br /> is the best choice for you
              </h2>
            </div>

            <div className="text-left space-y-6 mr-7">
              <p className="text-lg text-gray-700 leading-relaxed">
                Choosing our platform means empowering your workflow with cutting-edge technology designed to save time and maximize efficiency.
                We provide enterprise-grade infrastructure, ensuring reliability, speed, and continuous backups for your peace of mind.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our advanced AI-driven tools, customizable templates, and detailed metadata management help you create professional-grade outputs effortlessly.
                Focus on your creativity while we handle the heavy lifting.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Collaborate seamlessly with a range of team tools, improve your visibility with SEO optimizations, and scale your projects with eCommerce-ready solutions.
                Our secure platform ensures your data remains safe at all times.
              </p>

              <div className="flex justify-start mt-8">
                <button
                  className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800"
                  onClick={handleGetStartedClick}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default HeroSection;
