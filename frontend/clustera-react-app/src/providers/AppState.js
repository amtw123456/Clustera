import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppStateProvider = ({ children }) => {
    const [checkedIds, setCheckedIds] = useState([]);
    const [articles, setArticles] = useState([]);

    return (
        <AppContext.Provider value={{ checkedIds, setCheckedIds, articles, setArticles }}>
            {children}
        </AppContext.Provider>
    );
};