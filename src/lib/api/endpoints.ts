const withId = (basePath: string, id: string | number): string =>
  `${basePath}/${id}`;

export const apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
  },
  users: {
    list: "/api/users",
    detail: (id: string | number) => withId("/api/users", id),
  },
  resources: {
    list: (resource: string) => `/api/${resource}`,
    detail: (resource: string, id: string | number) =>
      withId(`/api/${resource}`, id),
  },
};
