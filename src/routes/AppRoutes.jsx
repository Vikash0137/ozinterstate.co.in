import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import QuotesPage from '../pages/quotes/QuotesPage'
import QuoteDetailsPage from '../pages/quotes/QuoteDetailsPage'
import BannerListPage from '../pages/banners/BannerListPage'
import BannerFormPage from '../pages/banners/BannerFormPage'
import FormBuilderPage from '../pages/inquiries/FormBuilderPage'
import InquiryListPage from '../pages/inquiries/InquiryListPage'
import InquirySettingsPage from '../pages/inquiries/InquirySettingsPage'
import CustomersPage from '../pages/customers/CustomersPage'
import CustomerFormPage from '../pages/customers/CustomerFormPage'
import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage'
import CustomerEditPage from '../pages/customers/CustomerEditPage'
import AdminsPage from '../pages/admins/AdminsPage'
import AdminFormPage from '../pages/admins/AdminFormPage'
import AdminDetailsPage from '../pages/admins/AdminDetailsPage'
import AdminEditPage from '../pages/admins/AdminEditPage'
import ActivityLogsPage from '../pages/activity/ActivityLogsPage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import BookingsPage from '../pages/bookings/BookingsPage'
import BookingDetailsPage from '../pages/bookings/BookingDetailsPage'
import BookingFormPage from '../pages/bookings/BookingFormPage'
import BookingEditPage from '../pages/bookings/BookingEditPage'
import LocationsPage from '../pages/locations/LocationsPage'
import LocationFormPage from '../pages/locations/LocationFormPage'
import RedirectsPage from '../pages/locations/RedirectsPage'
import LocationAnalyticsPage from '../pages/locations/LocationAnalyticsPage'
import SiteSettingsPage from '../pages/cms/SiteSettingsPage'
import ServicesPage from '../pages/cms/ServicesPage'
import ServiceFormPage from '../pages/cms/ServiceFormPage'
import BlogsPage from '../pages/cms/BlogsPage'
import BlogFormPage from '../pages/cms/BlogFormPage'
import ReviewsPage from '../pages/cms/ReviewsPage'
import ReviewFormPage from '../pages/cms/ReviewFormPage'
import PagesPage from '../pages/cms/PagesPage'
import FaqsPage from '../pages/cms/FaqsPage'
import FaqFormPage from '../pages/cms/FaqFormPage'
import GalleryPage from '../pages/cms/GalleryPage'
import GalleryFormPage from '../pages/cms/GalleryFormPage'
import TeamPage from '../pages/cms/TeamPage'
import TeamFormPage from '../pages/cms/TeamFormPage'
import StatsPage from '../pages/cms/StatsPage'
import StatFormPage from '../pages/cms/StatFormPage'
import ProcessStepsPage from '../pages/cms/ProcessStepsPage'
import ProcessStepFormPage from '../pages/cms/ProcessStepFormPage'
import TrustBadgesPage from '../pages/cms/TrustBadgesPage'
import TrustBadgeFormPage from '../pages/cms/TrustBadgeFormPage'
import WhyChoosePage from '../pages/cms/WhyChoosePage'
import WhyChooseFormPage from '../pages/cms/WhyChooseFormPage'
import SeoSettingsPage from '../pages/cms/SeoSettingsPage'
import AnalyticsPage from '../pages/analytics/AnalyticsPage'
import UsersRolesPage from '../pages/users/UsersRolesPage'
import SettingsPage from '../pages/settings/SettingsPage'
import ContactMessagesPage from '../pages/contacts/ContactMessagesPage'
import ProtectedRoute from './ProtectedRoute'

const TemporaryPage = ({ title }) => {
  return (
    <div
      style={{
        padding: '30px',
        border: '1px solid #e2e8ef',
        borderRadius: '15px',
        background: '#ffffff',
      }}
    >
      <h2 style={{ marginTop: 0, color: '#183149' }}>{title}</h2>

      <p style={{ marginBottom: 0, color: '#7b8b9b' }}>
        This module will be created in the next development steps.
      </p>
    </div>
  )
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/banners">
            <Route index element={<BannerListPage />} />
            <Route path="create" element={<BannerFormPage />} />
            <Route path="edit/:id" element={<BannerFormPage />} />
          </Route>

          <Route path="/inquiries">
            <Route index element={<InquiryListPage />} />
            <Route path="builder" element={<FormBuilderPage />} />
            <Route path="settings" element={<InquirySettingsPage />} />
          </Route>

          <Route path="/quotes">
            <Route index element={<QuotesPage />} />

            <Route path="new" element={<QuotesPage />} />

            <Route path="pending" element={<QuotesPage />} />

            <Route path="converted" element={<QuotesPage />} />

            <Route path=":quoteId" element={<QuoteDetailsPage />} />
          </Route>

          <Route path="/customers">
            <Route index element={<CustomersPage />} />
            <Route path="new" element={<CustomerFormPage />} />
            <Route path=":id" element={<CustomerDetailsPage />} />
            <Route path=":id/edit" element={<CustomerEditPage />} />
          </Route>

          <Route path="/admins">
            <Route index element={<AdminsPage />} />
            <Route path="new" element={<AdminFormPage />} />
            <Route path=":id" element={<AdminDetailsPage />} />
            <Route path=":id/edit" element={<AdminEditPage />} />
          </Route>

          <Route path="/activity-logs" element={<ActivityLogsPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/admin/locations">
            <Route index element={<LocationsPage />} />
            <Route path="new" element={<LocationFormPage />} />
            <Route path="edit/:id" element={<LocationFormPage />} />
            <Route path="redirects" element={<RedirectsPage />} />
            <Route path="analytics" element={<LocationAnalyticsPage />} />
          </Route>

          <Route path="/admin/services">
            <Route index element={<ServicesPage />} />
            <Route path="new" element={<ServiceFormPage />} />
            <Route path="edit/:id" element={<ServiceFormPage />} />
          </Route>

          <Route path="/seo/locations">
            <Route index element={<LocationsPage />} />
            <Route path="new" element={<LocationFormPage />} />
            <Route path="edit/:id" element={<LocationFormPage />} />
            <Route path="redirects" element={<RedirectsPage />} />
            <Route path="analytics" element={<LocationAnalyticsPage />} />
          </Route>

          <Route path="/bookings">
            <Route index element={<BookingsPage />} />
            <Route path="new" element={<BookingFormPage />} />
            <Route path="upcoming" element={<BookingsPage />} />
            <Route path="completed" element={<BookingsPage />} />
            <Route path=":id" element={<BookingDetailsPage />} />
            <Route path=":id/edit" element={<BookingEditPage />} />
          </Route>

          <Route path="/contacts" element={<ContactMessagesPage />} />

          <Route path="/cms">
            <Route path="banners">
              <Route index element={<BannerListPage />} />
              <Route path="create" element={<BannerFormPage />} />
              <Route path="edit/:id" element={<BannerFormPage />} />
            </Route>
            <Route path="site-settings" element={<SiteSettingsPage />} />
            <Route path="seo-settings" element={<SeoSettingsPage />} />
            <Route path="pages" element={<PagesPage />} />
            <Route path="services">
              <Route index element={<ServicesPage />} />
              <Route path="create" element={<ServiceFormPage />} />
              <Route path="edit/:id" element={<ServiceFormPage />} />
            </Route>
            <Route path="blogs">
              <Route index element={<BlogsPage />} />
              <Route path="create" element={<BlogFormPage />} />
              <Route path="edit/:id" element={<BlogFormPage />} />
            </Route>
            <Route path="reviews">
              <Route index element={<ReviewsPage />} />
              <Route path="create" element={<ReviewFormPage />} />
              <Route path="edit/:id" element={<ReviewFormPage />} />
            </Route>
            <Route path="faqs">
              <Route index element={<FaqsPage />} />
              <Route path="create" element={<FaqFormPage />} />
              <Route path="edit/:id" element={<FaqFormPage />} />
            </Route>
            <Route path="gallery">
              <Route index element={<GalleryPage />} />
              <Route path="create" element={<GalleryFormPage />} />
              <Route path="edit/:id" element={<GalleryFormPage />} />
            </Route>
            <Route path="team">
              <Route index element={<TeamPage />} />
              <Route path="create" element={<TeamFormPage />} />
              <Route path="edit/:id" element={<TeamFormPage />} />
            </Route>
            <Route path="trust-badges">
              <Route index element={<TrustBadgesPage />} />
              <Route path="create" element={<TrustBadgeFormPage />} />
              <Route path="edit/:id" element={<TrustBadgeFormPage />} />
            </Route>
            <Route path="stats">
              <Route index element={<StatsPage />} />
              <Route path="create" element={<StatFormPage />} />
              <Route path="edit/:id" element={<StatFormPage />} />
            </Route>
            <Route path="process-steps">
              <Route index element={<ProcessStepsPage />} />
              <Route path="create" element={<ProcessStepFormPage />} />
              <Route path="edit/:id" element={<ProcessStepFormPage />} />
            </Route>
            <Route path="why-choose">
              <Route index element={<WhyChoosePage />} />
              <Route path="create" element={<WhyChooseFormPage />} />
              <Route path="edit/:id" element={<WhyChooseFormPage />} />
            </Route>
          </Route>

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/users" element={<UsersRolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes