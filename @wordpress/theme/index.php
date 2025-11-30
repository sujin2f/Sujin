<?php
/**
 * WordPress main template.
 *
 * @package sujinc.com
 * @since   1.0.0
 * @author  Sujin 수진 Choi
 */

// Redirect to @next.
$next = getenv_docker( 'NEXT_ENDPOINT', '' );
if ( ! $next ) {
	return;
}

global $wp;

// Homepage.
if ( count( $wp->query_vars ) === 0 ) {
	header( "Location: {$next}", true, 301 );
	exit();
}

// Post.
if ( array_key_exists( 'name', $wp->query_vars ) ) {
	$slug = $wp->query_vars['name'];
	header( "Location: {$next}/blog/{$slug}", true, 301 );
	exit();
}

// Page.
if ( array_key_exists( 'pagename', $wp->query_vars ) ) {
	$slug = $wp->query_vars['pagename'];
	header( "Location: {$next}/{$slug}", true, 301 );
	exit();
}

// Category.
if ( array_key_exists( 'category_name', $wp->query_vars ) ) {
	$slug = $wp->query_vars['category_name'];
	header( "Location: {$next}/archive/category/{$slug}/page/1", true, 301 );
	exit();
}

// Tag.
if ( array_key_exists( 'tag', $wp->query_vars ) ) {
	$slug = $wp->query_vars['tag'];
	header( "Location: {$next}/archive/tag/{$slug}/page/1", true, 301 );
	exit();
}
