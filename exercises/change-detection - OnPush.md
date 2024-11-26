# ChangeDetectionStrategy OnPush Exercises

In this exercise we will focus on basic runtime optimizations in angular applications by using our knowledge about
the `ChangeDetection` system in angular.

As we have seen by introducing the `dirty-check` component: our application is heavily over-checking our components.

The goal of this exercise is to give you a deep understanding of the `ChangeDetection` system in angular. We will learn
how to optimize our applications runtime performance by using `ChangeDetectionStrategy.OnPush`.

## 0. Using `ChangeDetectionStrategy.OnPush` disclaimer

By default, all components are using `ChangeDetectionStrategy.Default`.
This means a component will be checked (template bindings will be re-evaluated) every time any action happens on the page.
This can cause severe performance issues.

You should aim to use `ChangeDetectionStrategy.OnPush` in all your components.

### 1. MovieCardComponent: OnPush

Let's start by introducing `ChangeDetectionStrategy.OnPush` to a `Leaf` component, as this is the safest way to migrate.
This will also help to get a deeper understanding of rendering cycles in the context of the `ComponentTree`.

* add the `<dirty-check />` component to the `MovieCardComponent`s template (if not done before)
* serve the application & note the initial values
* interact with the app and observe the counter in the `MovieCardComponent`
* apply `ChangeDetectionStrategy.OnPush` to `MovieCardComponent`
* serve the application again and observe how the dirty check amount is decreasing ;)
* observe how only the hovered movie cards counter is increasing but not the others

<details>
    <summary>MovieCardComponent OnPush</summary>

```html
<!-- movie-card.component.html -->

<div class="movie-card">
  <dirty-check />
  <!-- other template -->
</div>
```

```ts
// movie-card.component.ts
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  /* */
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent {}
```

</details>

### 2. AppComponent

Let's do one more simple but significant change and make our `AppComponent` use `ChangeDetectionStrategy.OnPush` changeDetection.

> [!WARNING]
> It is typically **bad practice** to introduce ChangeDetectionStrategy.OnPush on the root component in an early stage
> of this migration.
> It **WILL MOST PROBABLY ;-)** lead to very unknown side effects across your whole application.

<details>
    <summary>Use ChangeDetection OnPush</summary>

```typescript
// app.component.ts

@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <dirty-check />
      <router-outlet />
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

</details>

Serve the application, note how the counter will still increase on any interaction, but the amount it increases is
way lower than before. This is because the Component now only re-renders when being on a dirty-path.

> [!NOTICE]
> **REMEMBER** the bug where you have to just _click or hover something_ in the app until your changes are displayed
> on the screen? Well, you've just introduced it 🥳🥳🥳. If you face an empty screen, just interact with the page - your movies will
> be rendered afterwards.

> [!NOTICE]
> We will fix this issue in the next exercise, so don't worry.

### 3. BONUS: more ChangeDetectionStrategy.OnPush

> [!NOTE]
> This is a bonus exercise, you don't need to complete

Try to think about other components that would benefit from the `OnPush` `ChangeDetectionStrategy` and apply it.
Make sure to first use the `<dirty-check />` component in order to measure the improvement.

Feel free to ask questions if anything unexpected happens.

### 4. BONUS: Schematics Pro Tip

> [!NOTE]
> This is a bonus exercise, you don't need to complete

You can generate components with `OnPush` by default if you add next content to `angular.json` schematics:

<details>
    <summary>setup schematics to add OnPush automatically</summary>

```json
{
  "schematics": {
    "@schematics/angular:component": {
      // other stuff is here as well
      "changeDetection": "OnPush"
    }
  }
}
```

</details>

