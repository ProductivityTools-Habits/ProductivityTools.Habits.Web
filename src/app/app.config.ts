import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(), provideApollo(() => {
      const httpLink = inject(HttpLink);
      const authService = inject(AuthService);

      // Create auth link to add Bearer token to headers
      const authLink = setContext(async (_, { headers }) => {
        // Get the authentication token from Firebase
        const token = await authService.getIdToken();
        
        // Return the headers with authorization token
        if (token) {
          return {
            headers: {
              ...headers,
              Authorization: `Bearer ${token}`,
            }
          };
        }
        
        // Return headers without token if user not authenticated
        return { headers };
      });

      // Create HTTP link
      const http = httpLink.create({
        //uri: 'http://localhost:8080/graphql',
        uri: 'https://habit.productivitytools.top/graphql'
      });

      return {
        link: authLink.concat(http),
        cache: new InMemoryCache(),
      };
    })
  ]
};
