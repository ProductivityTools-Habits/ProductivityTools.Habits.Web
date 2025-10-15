import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'habit-edit/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return empty array since habit IDs are dynamic and fetched from API
      // This allows the route to work at runtime without prerendering specific IDs
      return [];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
