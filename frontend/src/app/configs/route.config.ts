export const PAGE_ROUTES = {
  LOGIN: "/login",
  ADMIN: {
    INDEX: "/admin",
    DASHBOARD: "/admin/dashboard",
    PRODUCT: {
      INDEX: "/admin/product",
      ADD: "/admin/product/add",
      EDIT: "/admin/product/edit",
    },
  },
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: "auth/login",
  },
  PRODUCT: {
    INDEX: "products",
  },
  USER: {
    INDEX: "users",
    EMAIL: "users/email",
  },
  CATEGORY: {
    INDEX: "categories",
  },
  SUBCATEGORY: {
    INDEX: "subcategories",
  },
  PRODUCT_LIKE: {
    INDEX: "product_like",
  },
};

export const PROTECTED_PAGE_ROUTES: string[] = [PAGE_ROUTES.ADMIN.INDEX];
