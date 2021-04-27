<?php
/**
 * Simple Post RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{Attachment, Input, Checkbox};

/**
 * Simple Post RESTful API Item
 */
class Simple_Post extends Items {
	/**
	 * Post ID
	 *
	 * @var int
	 */
	public $id;

	/**
	 * Post slug
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Short description of the post
	 *
	 * @var string
	 */
	public $excerpt;

	/**
	 * Creation date
	 *
	 * @var string
	 */
	public $date;

	/**
	 * Link to the page
	 *
	 * @var string
	 */
	public $link;

	/**
	 * Post title
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Metadata
	 *
	 * @var array
	 */
	public $meta = array();

	/**
	 * Post thumbnail
	 *
	 * @var array
	 */
	public $thumbnail = array();

	/**
	 * Tags
	 *
	 * @var array
	 */
	public $tags = array();

	private const BREAKS      = array( '<br />', '<br/>', '<br>', '&lt;br /&gt;', '&lt;br/&gt;', '&lt;br&gt;' );
	protected const ITEM_NAME = 'simple-post';

	/**
	 * Constructor
	 *
	 * @param      string   $name Name of the instance.
	 * @param      ?WP_Post $post Post object of the menu item.
	 * @uses       Tag
	 * @uses       Images
	 * @uses       Attachment
	 * @uses       Checkbox
	 * @uses       Input
	 * @visibility protected
	 */
	protected function __construct( string $name, ?WP_Post $post = null ) {
		parent::__construct( $name );

		if ( ! $post ) {
			return;
		}

		$this->id    = $post->ID;
		$this->date  = $post->post_date;
		$this->link  = get_permalink( $post );
		$this->title = $post->post_title;
		$this->slug  = $post->post_name;

		// Excerpt.
		$this->excerpt = str_replace( self::BREAKS, "\r\n\r\n", $post->post_excerpt );
		$this->excerpt = wpautop( $this->excerpt );

		// Tags.
		$this->tags = wp_get_post_tags( $post->ID );
		foreach ( array_keys( $this->tags ) as $key ) {
			$this->tags[ $key ] = new Tag( $this->tags[ $key ] );
		}

		$list       = Attachment::get_instance( 'List' )->get( $post->ID ) ?: -1;
		$icon       = Attachment::get_instance( 'Icon' )->get( $post->ID ) ?: -1;
		$title      = Attachment::get_instance( 'Title' )->get( $post->ID ) ?: -1;
		$background = Attachment::get_instance( 'Background' )->get( $post->ID ) ?: -1;
		$thumbnail  = Attachment::get_instance( 'Thumbnail' )->get( $post->ID ) ?: -1;

		$this->meta = array(
			'list'               => new Images( $list ),
			'icon'               => new Images( $icon ),
			'title'              => new Images( $title ),
			'background'         => new Images( $background ),
			'thumbnail'          => new Images( $thumbnail ),
			'useBackgroundColor' => Checkbox::get_instance( 'Use Background Color' )->get( $post->ID ) ?? false,
			'backgroundColor'    => Input::get_instance( 'Background Color' )->get( $post->ID ) ?: '',
		);

		$this->thumbnail = new Images( get_post_thumbnail_id( $post->ID ) ?: -1 );
	}
}
