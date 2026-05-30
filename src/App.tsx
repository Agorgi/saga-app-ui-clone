import { ErrorBoundary, ThemeProvider } from '@saga/global-web';
import { AvatarProvider } from '@saga/global-web';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { placeholderAvatars } from '@/data/placeholderAvatars';
import { GlobalOverlay } from '@components/GlobalOverlay/GlobalOverlay';
import { LoginPage } from '@domains/auth/LoginPage/LoginPage';
import { CommunitiesPage } from '@domains/communities/Communities/CommunitiesPage';
import CommunityPage from '@domains/communities/Community/CommunityPage';
import { EventPage } from '@domains/events/EventPage/EventPage';
import { EventsListPage } from '@domains/events/EventsListPage/EventsListPage';
import MainFeedPage from '@domains/posts/MainFeed';
import { ProfilePage } from '@domains/profile/Profile';
import { NotFound } from '@pages/NotFound/NotFound';

// Standalone wireframe clone of the Saga web app.
// Public, logged-out shell only. Placeholder content throughout — no backend,
// no real data. Route map mirrors apps/app-web for the in-scope public pages.
export default function App() {
  return (
    <ErrorBoundary>
      <AvatarProvider defaultAvatars={placeholderAvatars}>
        <ThemeProvider>
          <BrowserRouter>
            <GlobalOverlay>
              <Routes>
                <Route path="/" element={<MainFeedPage />} />
                <Route path="/feed" element={<MainFeedPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/communities/:communityId" element={<CommunityPage />} />
                <Route path="/events" element={<EventsListPage />} />
                <Route path="/events/:eventId" element={<EventPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GlobalOverlay>
          </BrowserRouter>
        </ThemeProvider>
      </AvatarProvider>
    </ErrorBoundary>
  );
}
