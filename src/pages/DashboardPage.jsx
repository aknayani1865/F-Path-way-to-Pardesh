// src/components/TravelPage.jsx
import React, { useState } from 'react';
import './DashboardPages.css'; // Import your CSS files here
import './DashboardPage.css';
import NavbarUser from '../components/NavbarUser';
const DashboardPage = () => {
  return (
    <main className="w-full">
      <section className="w-full h-[100vh] bg-header bg-cover bg-no-repeat bg-center bg-color1 bg-blend-multiply bg-opacity-60">
        <section className="w-full">
          <NavbarUser />
        </section>

        {/* Main Content */}
        <section className="w-full flex justify-center mt-[180px]">
          <div className="w-[700px] md:w-[900px] container h-auto">
            <p className="w-full text-center uppercase text-white tracking-widest [word-spacing:8px] mb-4">
              Let's travel the India with us
            </p>
            <h1 className="w-full text-center text-white text-5xl md:text-7xl font-secondary uppercase tracking-widest">
              Your next trip is just a click away <span className="travol"></span>
            </h1>
          </div>
        </section>

        {/* Search Section */}
        <section className="w-full justify-center mt-[80px] hidden lg:flex relative">
          <div className="bg-white bg-opacity-40 container absolute w-[1000px] xl:w-[1200px] h-[0px] flex justify-center items-center backdrop-blur-lg">
            <div className="w-[950px] xl:w-[1100px] container h-auto absolute m-[10px]">
              <form action="" className="flex font-primary">
                <input type="text" placeholder="where to?" className="py-[15px] ps-5 w-[100%] outline-none focus:outline-none" />
              </form>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardPage;
