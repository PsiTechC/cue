import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Project from './Project';
import MySheet from './MySheet';
import CueSheetGenerator from './CueSheetGenerator';
import Account from './Account';
import Folder from './Folder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import SubFolder from './SubFolder';
import MetadataCreation from './MetadataCreation';
import AutoSubtitling from './AutoSubtitling'
import AIVoiceover from './AIVoiceover'
import Metamorphosis from './Metamorphosis'
import GenreIdentification from './GenreIdentification'
import AutoDubbing from './AutoDubbing'

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Conditionally render the toggle button */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 text-white z-50 fixed top-2 left-1"
        >
          <FontAwesomeIcon icon={faBars} size="1x" />
        </button>
      )}

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64 bg-[#171717] h-full fixed z-40`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex-grow md:ml-64 bg-[#171717] overflow-y-auto">
        <Routes>
          <Route index element={<Project />} /> 
          <Route path="project" element={<Project />} />
          <Route path="project/:workspaceName" element={<Folder />} />
          <Route path="project/:workspaceName/:folderName" element={<SubFolder />} />
          <Route path="mysheet" element={<MySheet />} />
          <Route path="CueSheetGenerator" element={<CueSheetGenerator />} />
          <Route path="metadatacreation" element={<MetadataCreation/>} />
          <Route path="autosubtitling" element={<AutoSubtitling/>} />
          <Route path="aivoiceover" element={<AIVoiceover/>} />
          <Route path="metamorphosis" element={<Metamorphosis/>} />
          <Route path="genreidentification" element={<GenreIdentification/>} />
          <Route path="autodubbing" element={<AutoDubbing/>} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
