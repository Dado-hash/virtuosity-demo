// Type definitions for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (config?: {
              prompt?: 'none' | 'consent' | 'select_account';
            }) => void;
          };
          revoke: (accessToken: string, callback?: () => void) => void;
        };
      };
    };
    gapi: {
      load: (
        libraries: string,
        config: {
          callback?: () => void;
          onerror?: (error: any) => void;
        }
      ) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs?: string[];
        }) => Promise<void>;
        request: (config: {
          path: string;
          method?: string;
          params?: Record<string, any>;
          body?: any;
        }) => Promise<{
          result: any;
        }>;
        setToken: (token: {
          access_token: string;
        }) => void;
      };
    };
  }
}

export {};
