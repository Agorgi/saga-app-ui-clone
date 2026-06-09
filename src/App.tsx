import { ErrorBoundary, ThemeProvider, Toast } from '@saga/global-web';
import { AvatarProvider } from '@saga/global-web';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { placeholderAvatars } from '@/data/placeholderAvatars';
import { GlobalOverlay } from '@components/GlobalOverlay/GlobalOverlay';
import { AuthProvider } from '@domains/auth';
import { LoginPage } from '@domains/auth/LoginPage/LoginPage';
import { CommunitiesPage } from '@domains/communities/Communities/CommunitiesPage';
import CommunityPage from '@domains/communities/Community/CommunityPage';
import { CrowdCommissionCreatePage } from '@domains/crowd-commissions/pages/CrowdCommissionCreatePage/CrowdCommissionCreatePage';
import { CrowdCommissionEditPage } from '@domains/crowd-commissions/pages/CrowdCommissionEditPage/CrowdCommissionEditPage';
import CreateEventPage from '@domains/events/CreateEventPage/CreateEventPage';
import { CreateEventForm } from '@domains/events/CreateEventPage/CreateEventForm';
import { InterestCheckForm } from '@domains/events/CreateEventPage/InterestCheckForm';
import InterestCheckDetailPage from '@domains/events/interestCheck/InterestCheckDetailPage';
import { EventPage } from '@domains/events/EventPage/EventPage';
import { EventsListPage } from '@domains/events/EventsListPage/EventsListPage';
import { MyCrewPage } from '@domains/events/openRoles/MyCrewPage';
import { NotificationsPage } from '@domains/notifications';
import CreatePostPage from '@domains/post-creation/CreatePost';
import FollowingFeedPage from '@domains/posts/FollowingFeed';
import MainFeedPage from '@domains/posts/MainFeed';
import { ProfilePage } from '@domains/profile/Profile';
import { NotFound } from '@pages/NotFound/NotFound';

// Standalone wireframe clone of the Saga web app.
// Placeholder content throughout, no backend, no real data. A demo AuthProvider
// fakes sign-in so authenticated surfaces (feed actions, post modal) can render.
// Route map mirrors apps/app-web for the in-scope pages.
export default function App() {
  return (
    <ErrorBoundary>
      <AvatarProvider defaultAvatars={placeholderAvatars}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <GlobalOverlay>
                <Routes>
                  <Route path="/" element={<MainFeedPage />} />
                  <Route path="/feed" element={<MainFeedPage />} />
                  <Route path="/following-feed" element={<FollowingFeedPage />} />
                  <Route path="/communities" element={<CommunitiesPage />} />
                  <Route path="/communities/:communityId" element={<CommunityPage />} />
                  <Route path="/events" element={<EventsListPage />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/create/paid" element={<CreateEventForm mode="paid" />} />
                  <Route path="/events/create/free" element={<CreateEventForm mode="free" />} />
                  <Route path="/events/create/interest-check" element={<InterestCheckForm />} />
                  <Route path="/events/interest-check/:id" element={<InterestCheckDetailPage />} />
                  <Route path="/events/:eventId" element={<EventPage />} />
                  <Route path="/crew" element={<MyCrewPage />} />
                  <Route path="/create-post" element={<CreatePostPage />} />
                  <Route path="/crowd-commissions/new" element={<CrowdCommissionCreatePage />} />
                  <Route path="/crowd-commissions/:id/edit" element={<CrowdCommissionEditPage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </GlobalOverlay>
              <Toast />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </AvatarProvider>
    </ErrorBoundary>
  );
}
