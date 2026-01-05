// import React from "react";
// import { Facebook } from "./Facebook";
// import POLYCRAFTS from "./POLYCRAFTS.svg";
// import STUDIO from "./STUDIO.svg";
// import { Twitter } from "./Twitter";
// import group30 from "./group-30.png";

// const EmailVerification = () => {
//   const verificationCode = ["8", "7", "9", "0"];

//   const socialLinks = [
//     { component: Twitter, label: "Twitter" },
//     { component: Facebook, label: "Facebook" },
//     { icon: "/union.svg", label: "Instagram" },
//   ];

//   return (
//     <main
//       className="inline-flex flex-col items-center gap-8 relative bg-white"
//       role="main"
//     >
//       {/* Header */}
//       <header
//         className="relative w-[600px] h-[130px] bg-[#d73c3e]"
//         role="banner"
//       >
//         <div className="relative w-[135px] h-[100px] top-4 left-[233px] aspect-[1.35]">
//           <img
//             className="absolute w-[78px] h-[62px] top-0 left-[29px]"
//             alt="PolyCrafts Studio Logo"
//             src={group30}
//           />
//           <img
//             className="absolute w-[135px] h-[13px] top-[71px] left-0"
//             alt="Polycrafts"
//             src={POLYCRAFTS}
//           />
//           <img
//             className="absolute w-[58px] h-[9px] top-[89px] left-[41px]"
//             alt="Studio"
//             src={STUDIO}
//           />
//         </div>
//       </header>

//       {/* Welcome Message */}
//       <section
//         className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-gray-1 text-sm text-center tracking-[0] leading-[normal]"
//         aria-labelledby="welcome-message"
//       >
//         <p id="welcome-message">
//           <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-[#1a1f27] text-sm tracking-[0]">
//             Hi Jagmohan,
//             <br />
//             <br />
//             Welcome to{" "}
//           </span>
//           <span className="[font-family:'Poppins-SemiBold',Helvetica] font-semibold">
//             PolyCraftsstudio!
//           </span>
//           <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-[#1a1f27] text-sm tracking-[0]">
//             {" "}
//             Thank you for your register.
//             <br />
//           </span>
//         </p>
//       </section>

//       {/* Verification Section */}
//       <section
//         className="inline-flex flex-col items-center gap-[11px] pt-0 pb-20 px-0 relative flex-[0_0_auto]"
//         aria-labelledby="verification-section"
//       >
//         <h1
//           id="verification-section"
//           className="relative w-[480px] mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-1 text-[19px] text-center tracking-[0] leading-[normal]"
//         >
//           Your verification code is
//         </h1>

//         <div
//           className="relative w-[480px] font-h-1 font-[number:var(--h-1-font-weight)] text-gray-1 text-[length:var(--h-1-font-size)] text-center tracking-[var(--h-1-letter-spacing)] leading-[var(--h-1-line-height)] [font-style:var(--h-1-font-style)]"
//           role="text"
//           aria-label={`Verification code: ${verificationCode.join(" ")}`}
//         >
//           {verificationCode.join(" ")}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer
//         className="inline-flex flex-col items-center gap-4 px-[180px] py-[26px] relative flex-[0_0_auto] bg-grey-1"
//         role="contentinfo"
//       >
//         <nav
//           className="inline-flex items-center gap-8 relative flex-[0_0_auto]"
//           aria-label="Social media links"
//         >
//           {socialLinks.map((link, index) => (
//             <div key={index}>
//               {link.component ? (
//                 <link.component
//                   className="!relative !w-[18px] !h-[18px]"
//                   aria-label={link.label}
//                 />
//               ) : (
//                 <div
//                   className="relative w-[18px] h-[18px] bg-[url(/union.svg)] bg-[100%_100%]"
//                   role="img"
//                   aria-label={link.label}
//                 />
//               )}
//             </div>
//           ))}
//         </nav>

//         <div className="inline-flex flex-col items-center gap-2 relative flex-[0_0_auto]">
//           <div className="relative w-60 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-grey-4 text-sm text-center tracking-[0] leading-[normal]">
//             polycraftsstudio.com
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// };

// export default EmailVerification;
