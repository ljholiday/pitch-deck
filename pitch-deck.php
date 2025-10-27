<?php
/**
 * Plugin Name: Pitch Deck
 * Plugin URI:  https://example.com/pitch-deck
 * Description: Build and present slide decks directly inside the block editor.
 * Version:     2.0.0
 * Author:      Pitch Deck Contributors
 * Author URI:  https://example.com
 * License:     GPL-2.0-or-later
 * Text Domain: pitch-deck
 *
 * @package PitchDeck
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PITCH_DECK_VERSION', '2.0.0' );
define( 'PITCH_DECK_PATH', plugin_dir_path( __FILE__ ) );
define( 'PITCH_DECK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Main plugin bootstrap.
 */
final class Pitch_Deck_Plugin {

	/**
	 * Boot the plugin.
	 *
	 * @return void
	 */
	public static function init() {
		$instance = new self();
		$instance->setup_hooks();
	}

	/**
	 * Register WordPress hooks.
	 *
	 * @return void
	 */
	private function setup_hooks() {
		add_action( 'init', array( $this, 'register_assets' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_shortcode' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_canonical_stylesheet' ) );
	}

	/**
	 * Register scripts and styles.
	 *
	 * @return void
	 */
	public function register_assets() {
		wp_register_style(
			'pitch-deck-style',
			PITCH_DECK_URL . 'assets/css/style.css',
			array(),
			filemtime( PITCH_DECK_PATH . 'assets/css/style.css' )
		);

		wp_register_script(
			'pitch-deck-blocks',
			PITCH_DECK_URL . 'assets/js/blocks.js',
			array( 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-components', 'wp-block-editor', 'wp-data' ),
			filemtime( PITCH_DECK_PATH . 'assets/js/blocks.js' ),
			true
		);

		wp_register_script(
			'pitch-deck-frontend',
			PITCH_DECK_URL . 'assets/js/frontend.js',
			array(),
			filemtime( PITCH_DECK_PATH . 'assets/js/frontend.js' ),
			true
		);
	}

	/**
	 * Register the deck and slide blocks.
	 *
	 * @return void
	 */
	public function register_blocks() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			'pitch-deck/deck',
			array(
				'editor_script' => 'pitch-deck-blocks',
				'style'         => 'pitch-deck-style',
				'editor_style'  => 'pitch-deck-style',
				'script'        => 'pitch-deck-frontend',
			)
		);

		register_block_type(
			'pitch-deck/slide',
			array(
				'editor_script' => 'pitch-deck-blocks',
				'style'         => 'pitch-deck-style',
				'editor_style'  => 'pitch-deck-style',
			)
		);
	}

	/**
	 * Shortcode output for saved decks.
	 *
	 * @return void
	 */
	public function register_shortcode() {
		add_shortcode( 'pitch_deck', array( $this, 'render_shortcode' ) );
	}

	/**
	 * Enqueue the canonical stylesheet for editor and front end.
	 *
	 * @return void
	 */
	public function enqueue_canonical_stylesheet() {
		wp_enqueue_style( 'pitch-deck-style' );
	}

	/**
	 * Render the pitch deck shortcode.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function render_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'id' => 0,
			),
			$atts,
			'pitch_deck'
		);

		$post_id = absint( $atts['id'] );

		if ( ! $post_id ) {
			return '<p>' . esc_html__( 'Please supply a pitch deck post ID.', 'pitch-deck' ) . '</p>';
		}

		$deck_post = get_post( $post_id );

		if ( ! $deck_post || 'publish' !== $deck_post->post_status ) {
			return '<p>' . esc_html__( 'Pitch deck not found.', 'pitch-deck' ) . '</p>';
		}

		wp_enqueue_script( 'pitch-deck-frontend' );
		wp_enqueue_style( 'pitch-deck-style' );

		return apply_filters( 'the_content', $deck_post->post_content );
	}
}

Pitch_Deck_Plugin::init();
