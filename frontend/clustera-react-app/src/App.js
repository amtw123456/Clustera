import React from 'react';
import ReactDOM from 'react-dom';
import UploadPage from './pages/upload_page/UploadPage.js';
import DocPage from './pages/documents_page/DocPage.js';
import LDApage from './pages/cluster_page_lda/LDApage.js';
import LSApage from './pages/cluster_page_lsa/LSApage.js';
import { AppStateProvider } from './providers/AppState.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <AppStateProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/documentsPage" element={<DocPage />} />
                    <Route path="/cluster_page_lda" element={<LDApage />} />
                    <Route path="/cluster_page_lsa" element={<LSApage />} />
                </Routes>
            </BrowserRouter>
        </AppStateProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;