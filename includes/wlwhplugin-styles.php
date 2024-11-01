<?php
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

// Load CSS on the frontend
function wlwhplugin_frontend_styles() {

  wp_enqueue_style( 'load-fa', WLWHPLUGIN_URL . 'assets/font-awesome-4.7.0/css/font-awesome.min.css' );
  wp_enqueue_style( 'wlwhplugin-frontend', WLWHPLUGIN_URL . 'frontend/css/wlwhplugin-frontend-style.css', [], 1.0  );
  wp_enqueue_style(
    'wlwhplugin-frontend-wishlist', WLWHPLUGIN_URL . 'frontend/css/page-wishlist.css', [], 1.0  );
}
add_action( 'wp_enqueue_scripts', 'wlwhplugin_frontend_styles', 100 );

// load css for admin screens
function wlwhplugin_admin_styles() {
  wp_enqueue_style(
    'wlwhplugin-admin', WLWHPLUGIN_URL . 'admin/css/metabox.css', [],  1.0
  );
  wp_enqueue_style( 'wp-color-picker' );
}
add_action( 'admin_enqueue_scripts', 'wlwhplugin_admin_styles', 100 );
