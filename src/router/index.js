import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

// Route components
const Dashboard = () => import("../views/Dashboard.vue");
const Members = () => import("../views/Members.vue");
const AddMember = () => import("../views/AddMember.vue");
const UpdateMember = () => import("../views/UpdateMember.vue");
const Loans = () => import("../views/Loans.vue");
const AddLoan = () => import("../views/AddLoan.vue");
const UpdateLoan = () => import("../views/UpdateLoan.vue");
const Payments = () => import("../views/Payments.vue");
const AddPayment = () => import("../views/AddPayment.vue");
const Disbursements = () => import("../views/Disbursements.vue");
const NewDisbursement = () => import("../views/NewDisbursement.vue");
const Notifications = () => import("../views/Notifications.vue");
const Settings = () => import("../views/Settings.vue");
const Login = () => import("../views/Login.vue");
const NotFound = () => import("../views/NotFound.vue");

// Define routes
const routes = [
  // Public routes
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requiresAuth: false,
      title: "Login",
    },
  },

  // Protected routes
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: "Dashboard",
    },
  },
  {
    path: "/members",
    name: "members",
    component: Members,
    meta: {
      requiresAuth: true,
      title: "Members",
      permissions: ["read_members"],
    },
  },
  {
    path: "/new-member",
    name: "new-member",
    component: AddMember,
    meta: {
      requiresAuth: true,
      title: "New Member",
      permissions: ["create_member"],
    },
  },
  {
    path: "/update-member/:id",
    name: "update-member",
    component: UpdateMember,
    meta: {
      requiresAuth: true,
      title: "Update Member",
      permissions: ["update_member"],
    },
  },
  {
    path: "/loans",
    name: "loans",
    component: Loans,
    meta: {
      requiresAuth: true,
      title: "Loans",
      permissions: ["read_loans"],
    },
  },
  {
    path: "/new-loan",
    name: "new-loan",
    component: AddLoan,
    meta: {
      requiresAuth: true,
      title: "New Loan",
      permissions: ["create_loan"],
    },
  },
  {
    path: "/update-loan/:id",
    name: "update-loan",
    component: UpdateLoan,
    meta: {
      requiresAuth: true,
      title: "Update Loan",
      permissions: ["update_loan"],
    },
  },
  {
    path: "/payments",
    name: "payments",
    component: Payments,
    meta: {
      requiresAuth: true,
      title: "Payments",
      permissions: ["read_payments"],
    },
  },
  {
    path: "/add-payment",
    name: "add-payment",
    component: AddPayment,
    meta: {
      requiresAuth: true,
      title: "Payments",
      permissions: ["create_payments"],
    },
  },
  {
    path: "/disbursements",
    name: "disbursements",
    component: Disbursements,
    meta: {
      requiresAuth: true,
      title: "Disbursements",
      permissions: ["read_disbursements"],
    },
  },
  {
    path: "/new-disbursement",
    name: "new-disbursement",
    component: NewDisbursement,
    meta: {
      requiresAuth: true,
      title: "Disbursements",
      permissions: ["create_disbursements"],
    },
  },
  {
    path: "/notifications",
    name: "notifications",
    component: Notifications,
    meta: {
      requiresAuth: true,
      title: "Notifications",
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: {
      requiresAuth: true,
      title: "Settings",
      permissions: ["read_settings"],
    },
  },

  // Catch-all / 404 route
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      requiresAuth: false,
      title: "Page Not Found",
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication for protected routes
router.beforeEach(async (to, from, next) => {
  // Update page title
  document.title = `${to.meta.title || "FamSave"} - Family Savings`;

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Verify authentication status
    const isAuthenticated = store.getters.isAuthenticated;

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Check permissions if specified in route meta
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      // This is a simplified permission check assuming permissions are stored in user info
      // You might need to implement a more sophisticated check based on your backend
      const userRole = store.getters.userRole;
      const isAdmin = store.getters.isAdmin;

      // For simplicity, we assume admins have access to everything
      if (!isAdmin) {
        // For non-admins, you could implement a more detailed permission check
        // based on your backend permission system
        next({ name: "dashboard" });
        return;
      }
    }

    // Authentication and permission checks passed
    next();
  } else {
    // Route doesn't require authentication
    // If already logged in and going to login page, redirect to dashboard
    if (to.name === "login" && store.getters.isAuthenticated) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  }
});

export default router;
