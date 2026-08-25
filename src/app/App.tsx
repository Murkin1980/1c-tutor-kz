import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../features/auth/auth";
import { ProgressProvider } from "../features/progress/progress";
import { AdminPage } from "../routes/AdminPage";
import { CoursePage } from "../routes/CoursePage";
import { CustomerCardLessonPage } from "../routes/CustomerCardLessonPage";
import { DashboardPage } from "../routes/DashboardPage";
import { LandingPage } from "../routes/LandingPage";
import { LoginPage } from "../routes/LoginPage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { ProfilePage } from "../routes/ProfilePage";
import { Layout } from "../shared/Layout";
import { AdminRoute, PrivateRoute } from "../shared/RouteGuards";

export function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="courses/:courseSlug" element={<CoursePage />} />
                <Route
                  path="learn/customer-card"
                  element={<CustomerCardLessonPage />}
                />
                <Route path="profile" element={<ProfilePage />} />
                <Route element={<AdminRoute />}>
                  <Route path="admin" element={<AdminPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}
