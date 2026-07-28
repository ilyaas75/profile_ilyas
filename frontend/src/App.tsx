import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminGate } from './components/AdminGate'
import { Layout } from './components/Layout'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminProjectsPage } from './pages/AdminProjectsPage'
import { AdminProfilePage } from './pages/AdminProfilePage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ServicesPage } from './pages/ServicesPage'
import { SkillsPage } from './pages/SkillsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminGate>
            <AdminDashboardPage />
          </AdminGate>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <AdminGate>
            <AdminProjectsPage />
          </AdminGate>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <AdminGate>
            <AdminProfilePage />
          </AdminGate>
        }
      />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
