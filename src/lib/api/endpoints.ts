const withApiPath = (path: string): string =>
  `/api/${path.replace(/^\/+/, "")}`;

const withId = (basePath: string, id: string | number): string =>
  `${basePath}/${id}`;

const withAuthPath = (path: string): string =>
  `${withApiPath("auth")}/${path.replace(/^\/+/, "")}`;

export const apiEndpoints = {
  health: withApiPath("health"),
  auth: {
    base: withApiPath("auth"),
    nextAuth: {
      csrf: withAuthPath("csrf"),
      session: withAuthPath("session"),
      signIn: withAuthPath("signin"),
      signOut: withAuthPath("signout"),
    },
  },
  resources: {
    list: (resource: string) => withApiPath(resource),
    detail: (resource: string, id: string | number) =>
      withId(withApiPath(resource), id),
  },
};
