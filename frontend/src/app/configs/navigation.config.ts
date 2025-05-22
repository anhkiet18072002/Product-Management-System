import { PAGE_ROUTES } from "@/app/configs/route.config";
import {
  NavigationGroupType,
  NavigationType,
} from "@/app/types/navigation.type";

export const LEFT_NAVIGATION: NavigationType[] | NavigationGroupType[] = [
  {
    kind: "header",
    title: "Dashboard",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    route: PAGE_ROUTES.ADMIN.DASHBOARD,
  },
  {
    kind: "header",
    title: "Management",
  },
  {
    segment: "product",
    title: "Product",
    route: PAGE_ROUTES.ADMIN.PRODUCT.INDEX,
    children: [
      {
        segment: "product.add",
        title: "Add a new Product",
        route: PAGE_ROUTES.ADMIN.PRODUCT.ADD,
      },
      {
        segment: "product.add",
        title: "Edit a Product",
        route: PAGE_ROUTES.ADMIN.PRODUCT.EDIT,
      },
    ],
  },
];
