import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </MemoryRouter>
    </React.StrictMode>,
);
