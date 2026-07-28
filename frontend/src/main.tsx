import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { ProjectsProvider } from './context/ProjectsContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <ProjectsProvider>
            <App />
          </ProjectsProvider>
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
