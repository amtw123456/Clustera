import React from 'react';
import ReactDOM from 'react-dom';
import UploadPage from './pages/upload_page/UploadPage.js';
import DocPage from './pages/documents_page/DocPage.js';
import LDApage from './pages/cluster_page_lda/LDApage.js';
import LSApage from './pages/cluster_page_lsa/LSApage.js';
import AboutPage from './pages/about_page/about.js';
import DocumentationPage from './pages/documentation_page/documentations.js';
import { AppStateProvider } from './providers/AppState.js';
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

ReactDOM.render(<App />, document.getElementById('root'));

export default App;