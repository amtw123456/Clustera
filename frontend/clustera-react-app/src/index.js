import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UploadPage from './upload_page/UploadPage.js';
import DocPage from './documents_page/DocPage.js'
import LDApage from './cluster_page_lda/LDApage.js';
import LSApage from './cluster_page_lsa/LSApage.js'

import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadPage />,
  },
  {
    path: "/documentsPage",
    element: <DocPage />,
  },
  {
    path: "/cluster_page_lda",
    element: <LDApage />,
  },
  {
    path: "/cluster_page_lsa",
    element: <LSApage />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/documentsPage" element={<DocPage />} />
    </Routes>
  </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals