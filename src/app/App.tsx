import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../features/auth/auth";
import { ProgressProvider } from "../features/progress/progress";
import { AdminPage } from "../routes/AdminPage";
import { CoursePage } from "../routes/CoursePage";
import { DashboardPage } from "../routes/DashboardPage";
import { LandingPage } from "../routes/LandingPage";
import { LessonPage } from "../routes/LessonPage";
import { LoginPage } from "../routes/LoginPage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { ProfilePage } from "../routes/ProfilePage";
import { SimulatorsPage } from "../routes/SimulatorsPage";
import { SimulatorShellPage } from "../routes/SimulatorShellPage";
import { Layout } from "../shared/Layout";
import { AdminRoute, PrivateRoute } from "../shared/RouteGuards";

const queryClient = new QueryClient();
export function App() {
  return <QueryClientProvider client={queryClient}><AuthProvider><ProgressProvider><BrowserRouter><Routes>
    <Route element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses/:courseSlug" element={<CoursePage />} />
        <Route path="learn/:lessonId" element={<LessonPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="simulators" element={<SimulatorsPage />} />
        <Route path="simulators/fno" element={<SimulatorShellPage type="fno" />} />
        <Route path="simulators/esf" element={<SimulatorShellPage type="esf" />} />
        <Route path="simulators/:type/scenarios/:scenarioId" element={<SimulatorShellPage />} />
        <Route element={<AdminRoute />}><Route path="admin" element={<AdminPage />} /></Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></BrowserRouter></ProgressProvider></AuthProvider></QueryClientProvider>;
}
