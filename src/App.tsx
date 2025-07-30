/**
 * SmartX Solution - ERP + CRM + HR + IT Asset Portal - Complete Indian Business Solution
 * Fully responsive application with GST compliance and multi-user support
 */

import { HashRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import AppLayout from './components/Layout/AppLayout';
import LoginForm from './components/Auth/LoginForm';
import ModularLoginRouter from './components/Auth/ModularLoginRouter';
import { routes } from './config/routes';
import { ThemeProvider } from './components/Customization/ThemeProvider';
import { ModuleProvider } from './components/Customization/ModuleProvider';

// Import all components for routing
import Dashboard from './pages/Dashboard';

// CRM Modules
import CRMOverview from './pages/CRM/CRMOverview';
import LeadsManagement from './pages/CRM/LeadsManagement';
import AdvancedAnalytics from './pages/CRM/AdvancedAnalytics';
import EmailIntegration from './pages/CRM/EmailIntegration';
import AdvancedLeadScoring from './pages/CRM/AdvancedLeadScoring';
import RealTimeNotifications from './pages/CRM/RealTimeNotifications';
import IndianCustomers from './pages/CRM/IndianCustomers';

// ERP Modules
import ERPOverview from './pages/ERP/ERPOverview';
import ProductsManagement from './pages/ERP/ProductsManagement';
import OrdersManagement from './pages/ERP/OrdersManagement';
import InvoiceManagement from './pages/ERP/InvoiceManagement';
import VendorManagement from './pages/ERP/VendorManagement';
import InventoryManagement from './pages/ERP/InventoryManagement';
import ManufacturingManagement from './pages/ERP/ManufacturingManagement';
import ProcurementManagement from './pages/ERP/ProcurementManagement';
import CustomerManagement from './pages/ERP/CustomerManagement';
import FinancialManagement from './pages/ERP/FinancialManagement';
import LogisticsManagement from './pages/ERP/LogisticsManagement';
import QualityManagement from './pages/ERP/QualityManagement';
import ERPAdvancedAnalytics from './pages/ERP/AdvancedAnalytics';

// HR Modules
import HRDashboard from './pages/HR/HRDashboard';
import EmployeeManagement from './pages/HR/EmployeeManagement';
import AttendanceManagement from './pages/HR/AttendanceManagement';
import LeaveManagement from './pages/HR/LeaveManagement';
import PayrollManagement from './pages/HR/PayrollManagement';
import PerformanceManagement from './pages/HR/PerformanceManagement';
import RecruitmentManagement from './pages/HR/RecruitmentManagement';
import HRReports from './pages/HR/HRReports';
import TrainingManagement from './pages/HR/TrainingManagement';
import EmployeeSelfService from './pages/HR/EmployeeSelfService';
import OnboardingManagement from './pages/HR/OnboardingManagement';
import OffboardingManagement from './pages/HR/OffboardingManagement';
import BenefitsAdministration from './pages/HR/BenefitsAdministration';
import WorkflowAutomation from './pages/HR/WorkflowAutomation';
import SecurityManagement from './pages/HR/SecurityManagement';

// Advanced Analytics Components
import PredictiveAnalytics from './components/Analytics/PredictiveAnalytics';
import AdvancedBusinessIntelligence from './components/Analytics/AdvancedBusinessIntelligence';
import EnhancedMobileFeatures from './components/Mobile/EnhancedMobileFeatures';
import AdvancedReporting from './components/Reports/AdvancedReporting';
import AdditionalThirdPartyIntegrations from './components/Integrations/AdditionalThirdPartyIntegrations';

// Low Priority Features - Future Enhancements
import BlockchainIntegration from './components/Blockchain/BlockchainIntegration';
import IoTConnectivity from './components/IoT/IoTConnectivity';
import MultiLanguageSupport from './components/Internationalization/MultiLanguageSupport';
import CloudDeployment from './components/Cloud/CloudDeployment';
import AdvancedSecurity from './components/Security/AdvancedSecurity';

// IT Asset Portal Modules
import ITAssetDashboard from './pages/ITAsset/ITAssetDashboard';
import AssetManagement from './pages/ITAsset/AssetManagement';
import AssetTracking from './pages/ITAsset/AssetTracking';
import MaintenanceManagement from './pages/ITAsset/MaintenanceManagement';
import SoftwareLicenses from './pages/ITAsset/SoftwareLicenses';
import ITInventory from './pages/ITAsset/ITInventory';
import AssetReports from './pages/ITAsset/AssetReports';
import SystemManagement from './pages/ITAsset/SystemManagement';
import AccessManagement from './pages/ITAsset/AccessManagement';
import SupportTickets from './pages/ITAsset/SupportTickets';

// GST & Indian Compliance
import GSTInvoice from './pages/GST/GSTInvoice';

// Common Modules
import Reports from './pages/Reports';
import BusinessIntelligence from './pages/BusinessIntelligence';
import AutomationHub from './pages/AutomationHub';
import FileManagement from './pages/FileManagement';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import UserProfile from './pages/UserProfile';
import Pricing from './pages/Pricing';
import Home from './pages/Home';
import Customization from './pages/Customization';

function AppContent() {
  return (
    <AppLayout>
      <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />

          {/* CRM Routes */}
          <Route path="/crm" element={<CRMOverview />} />
          <Route path="/crm/overview" element={<CRMOverview />} />
          <Route path="/crm/leads" element={<LeadsManagement />} />
          <Route path="/crm/customers" element={<IndianCustomers />} />
          <Route path="/crm/analytics" element={<AdvancedAnalytics />} />
          <Route path="/crm/email" element={<EmailIntegration />} />
          <Route path="/crm/scoring" element={<AdvancedLeadScoring />} />
          <Route path="/crm/notifications" element={<RealTimeNotifications />} />

          {/* ERP Routes */}
          <Route path="/erp" element={<ERPOverview />} />
          <Route path="/erp/overview" element={<ERPOverview />} />
          <Route path="/erp/products" element={<ProductsManagement />} />
          <Route path="/erp/orders" element={<OrdersManagement />} />
          <Route path="/erp/invoices" element={<InvoiceManagement />} />
          <Route path="/erp/vendors" element={<VendorManagement />} />
          <Route path="/erp/inventory" element={<InventoryManagement />} />
          <Route path="/erp/manufacturing" element={<ManufacturingManagement />} />
          <Route path="/erp/procurement" element={<ProcurementManagement />} />
          <Route path="/erp/customers" element={<CustomerManagement />} />
          <Route path="/erp/financial" element={<FinancialManagement />} />
          <Route path="/erp/logistics" element={<LogisticsManagement />} />
          <Route path="/erp/quality" element={<QualityManagement />} />
          <Route path="/erp/analytics" element={<ERPAdvancedAnalytics />} />

          {/* HR Routes */}
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/employees" element={<EmployeeManagement />} />
          <Route path="/hr/attendance" element={<AttendanceManagement />} />
          <Route path="/hr/leave" element={<LeaveManagement />} />
          <Route path="/hr/payroll" element={<PayrollManagement />} />
          <Route path="/hr/performance" element={<PerformanceManagement />} />
          <Route path="/hr/recruitment" element={<RecruitmentManagement />} />
          <Route path="/hr/reports" element={<HRReports />} />
          <Route path="/hr/training" element={<TrainingManagement />} />
          <Route path="/hr/self-service" element={<EmployeeSelfService />} />
          <Route path="/hr/onboarding" element={<OnboardingManagement />} />
          <Route path="/hr/offboarding" element={<OffboardingManagement />} />
          <Route path="/hr/benefits" element={<BenefitsAdministration />} />
          <Route path="/hr/workflow" element={<WorkflowAutomation />} />
          <Route path="/hr/security" element={<SecurityManagement />} />
          
                      {/* Advanced Analytics Routes */}
            <Route path="/hr/predictive-analytics" element={<PredictiveAnalytics />} />
            <Route path="/business-intelligence/advanced" element={<AdvancedBusinessIntelligence />} />
            <Route path="/mobile/features" element={<EnhancedMobileFeatures />} />
            <Route path="/reports/advanced" element={<AdvancedReporting />} />
            <Route path="/integrations/advanced" element={<AdditionalThirdPartyIntegrations />} />

            {/* Low Priority Features - Future Enhancements */}
            <Route path="/blockchain/integration" element={<BlockchainIntegration />} />
            <Route path="/iot/connectivity" element={<IoTConnectivity />} />
            <Route path="/internationalization/languages" element={<MultiLanguageSupport />} />
            <Route path="/cloud/deployment" element={<CloudDeployment />} />
            <Route path="/security/advanced" element={<AdvancedSecurity />} />

          {/* IT Asset Portal Routes */}
          <Route path="/assets" element={<ITAssetDashboard />} />
          <Route path="/assets/dashboard" element={<ITAssetDashboard />} />
          <Route path="/assets/management" element={<AssetManagement />} />
          <Route path="/assets/tracking" element={<AssetTracking />} />
          <Route path="/assets/maintenance" element={<MaintenanceManagement />} />
          <Route path="/assets/software" element={<SoftwareLicenses />} />
          <Route path="/assets/inventory" element={<ITInventory />} />
          <Route path="/assets/reports" element={<AssetReports />} />
          <Route path="/assets/system" element={<SystemManagement />} />
          <Route path="/assets/access" element={<AccessManagement />} />
          <Route path="/assets/support" element={<SupportTickets />} />

          {/* GST & Indian Compliance */}
          <Route path="/gst" element={<GSTInvoice />} />
          <Route path="/gst/invoice" element={<GSTInvoice />} />

          {/* Common Routes */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/business-intelligence" element={<BusinessIntelligence />} />
          <Route path="/business-intelligence/reports" element={<BusinessIntelligence />} />
          <Route path="/business-intelligence/kpis" element={<BusinessIntelligence />} />
          <Route path="/business-intelligence/predictive" element={<BusinessIntelligence />} />
          <Route path="/automation" element={<AutomationHub />} />
          <Route path="/files" element={<FileManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/pricing" element={<Pricing />} />



          {/* Catch-all route for 404 */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ModuleProvider>
        <HashRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <Routes>
            {/* All routes go directly to main app */}
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </HashRouter>
      </ModuleProvider>
    </ThemeProvider>
  );
}
