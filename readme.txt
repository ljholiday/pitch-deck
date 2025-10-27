=== Pitch Deck ===
Contributors: yourname
Tags: presentation, slides, pitch deck, block editor
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 2.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Compose slide decks directly inside Gutenberg and present them with autoplay, progress indicators, and fullscreen mode.

== Description ==

Pitch Deck replaces the old slide CPT approach with a modern block-first workflow:

* Insert one **Pitch Deck** block to scaffold a deck.
* Add **Slide** inner blocks; each slide can contain any core blocks, columns, images, embeds, or buttons.
* Configure navigation, progress, counters, and autoplay from the inspector.
* Present on the front end with keyboard, touch, and fullscreen support. Autoplay pauses as soon as viewers interact.
* Render saved decks anywhere with `[pitch_deck id="123"]`.

The plugin ships with a single canonical stylesheet (`assets/css/style.css`) that loads for both editor and runtime via `enqueue_block_assets`, keeping layouts consistent.

== Installation ==

1. Upload the `pitch-deck` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** screen.
3. Create or edit a post, insert the **Pitch Deck** block, and start composing slides.

== Frequently Asked Questions ==

= How do I add more slides? =

Select the Pitch Deck block and use either the block toolbar buttons or the “Add slide” button inside the block preview.

= Can I autoplay slides? =

Yes. Enable autoplay in the inspector and adjust the delay and loop options. Visitors can pause or resume playback from the control bar.

= Does the shortcode still work? =

Use `[pitch_deck id="123"]` where `123` is the post ID containing the Pitch Deck block. The shortcode renders the same block output and enqueues assets automatically.

== Changelog ==

= 2.0.0 =
* Rebuilt from scratch as a block-based experience.
* Added fullscreen, swipe gestures, autoplay with loop controls, progress bar, and counter.
* Unified styling with a single `style.css` shared between editor and front end.

== Upgrade Notice ==

= 2.0.0 =
Existing decks should be recreated using the new Pitch Deck block to take advantage of the updated workflow.
