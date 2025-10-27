# Pitch Deck

Pitch Deck lets you compose and present slide decks entirely inside the WordPress block editor. Insert the **Pitch Deck** block, add as many **Slide** blocks as you need, and present with keyboard, touch, autoplay, and fullscreen controls.

## Features

- **Block-first authoring** – slides are ordinary blocks, so columns, media, embeds, and theme typography all work out of the box.
- **Polished presentation layer** – navigation buttons, progress bar, slide counter, optional autoplay with looping, fullscreen mode, and swipe gestures.
- **Single canonical stylesheet** – `assets/css/style.css` loads for both editor and front end via `enqueue_block_assets`, keeping design consistent.
- **Shortcode support** – render any pitch deck post with `[pitch_deck id="123"]`.

## Usage

1. Install the plugin in `wp-content/plugins/pitch-deck` and activate it.
2. Create or edit a post and add the **Pitch Deck** block.
3. Use the block toolbar or sidebar button to add slides. Each slide can contain any combination of core blocks.
4. Configure autoplay, progress, counter, and navigation options from the inspector.
5. Publish and present. Keyboard arrows/space navigate slides, `Esc` exits fullscreen, and touch devices support horizontal swipe.

## Development

- Styles live in `assets/css/style.css` and must satisfy the breakpoints defined in the WordPress integration doctrine (≤600px, 601–1024px, ≥1025px).
- Blocks are registered in `assets/js/blocks.js` and share the canonical stylesheet for both runtime and editor contexts.
- Front-end behaviour is handled by `assets/js/frontend.js`.
- Run `phpcs --standard=WordPress` and `eslint --ext .js assets/js` to conform to coding standards.

## Shortcode

```
[pitch_deck id="123"]
```

The shortcode renders the saved block content of the post ID provided and enqueues the presentation assets.
