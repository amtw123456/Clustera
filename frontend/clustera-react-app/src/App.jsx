import React from 'react';
import UploadPage from './pages/upload_page/UploadPage.jsx';
import DocPage from './pages/documents_page/DocPage.jsx';
import LDApage from './pages/cluster_page_lda/LDApage.jsx';
import LSApage from './pages/cluster_page_lsa/LSApage.jsx';
import AboutPage from './pages/about_page/about.jsx';
import DocumentationPage from './pages/documentation_page/documentations.jsx';
import { AppStateProvider } from './providers/AppState.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <BrowserRouter>
            <AppStateProvider>
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/documentsPage" element={<DocPage />} />
                    <Route path="/documentationPage" element={<DocumentationPage />} />
                    <Route path="/aboutPage" element={<AboutPage />} />
                    <Route path="/cluster_page_lda" element={<LDApage />} />
                    <Route path="/cluster_page_lsa" element={<LSApage />} />
                </Routes>
            </AppStateProvider >
        </BrowserRouter>
    );
}

export default App;