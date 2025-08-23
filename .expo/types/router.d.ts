/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/chat`; params?: Router.UnknownInputParams; } | { pathname: `/check`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/register`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/forgetpassword`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/chat`; params?: Router.UnknownOutputParams; } | { pathname: `/check`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/login`; params?: Router.UnknownOutputParams; } | { pathname: `/register`; params?: Router.UnknownOutputParams; } | { pathname: `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `/forgetpassword`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/chat${`?${string}` | `#${string}` | ''}` | `/check${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `/register${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `/forgetpassword${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/chat`; params?: Router.UnknownInputParams; } | { pathname: `/check`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/register`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/forgetpassword`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
