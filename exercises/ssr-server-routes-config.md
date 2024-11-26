# Angular Server Side Rendering - Server Routes Config
In the latest version of Angular, we can configure the routes to render on the server or on the client based on our needs.

## 1. Create a Server Routes Config file

Create a file called `app.routes.server.ts` in the `src/app` folder.

Create a configuration object that contains an array of `ServerRoute` objects.


<details>
  <summary>serverRoutes Config</summary>

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [];
```

</details>

### 2. Enable Server Route Configuration in the server providers
Go to `src/app/app.config.server.ts` and add the `serverRoutes` configuration using `provideServerRoutesConfig` provider function.


<details>
  <summary>serverRoutes Config</summary>

```diff
+ import { provideServerRoutesConfig } from '@angular/ssr';
+ import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
+    provideServerRoutesConfig(serverRoutes),
  ],
};
```

</details>

### 3. Configure a route to render on the client
The `my-movies` route doesn't need to be rendered on the server, so we can configure it to render on the client.

<details>
  <summary>Solution</summary>

```diff
export const serverRoutes: ServerRoute[] = [
+  {
+    path: 'my-movies',
+    renderMode: RenderMode.Client,
+  },
];
```

</details>

### 4. Configure a route to render on the server
The `list/:category` route needs to be rendered on the server, so we can configure it to render on the server.

<details>
  <summary>Solution</summary>

```diff
export const serverRoutes: ServerRoute[] = [
  {
    path: 'my-movies',
    renderMode: RenderMode.Client,
  },
+  {
+    path: 'list/:category',
+    renderMode: RenderMode.Server,
+  },
];
```

</details>

### 5. Render all the other routes on the client
We can grab all the other routes using the `**` wildcard and configure them to render on the client.

<details>
  <summary>Solution</summary>

```diff
export const serverRoutes: ServerRoute[] = [
  {
    path: 'my-movies',
    renderMode: RenderMode.Client,
  },
  {
    path: 'list/:category',
    renderMode: RenderMode.Server,
  },
+  {
+    path: '**',
+    renderMode: RenderMode.Client,
+  },
];
```

</details>

## 6. Run the application and check the rendered HTML
After running the application, you should see that the `my-movies` route is rendered on the client and the `list/:category` route is rendered on the server.

Great job 👏! You have learned how to configure the routes to render on the server or on the client based on your needs.
