<?php
/**
 * Test data -- Post
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment;

/**
 * Test data -- Post
 */
class Data_Post {
	/**
	 * Post
	 *
	 * @var WP_Post
	 */
	public $post_main;

	/**
	 * Post
	 *
	 * @var WP_Post
	 */
	public $post_past;

	/**
	 * Constructor
	 */
	public function __construct( $factory ) {
		// Create Posts.
		$this->post_main = $factory->post->create_and_get(
			array(
				'post_title'   => '훈민정음',
				'post_content' => '<h2>훈민정음</h2>나랏말싸미 듕귁에 달아 문짜와로 서르 사맛디 아니할쌔 이런젼차로 어린백성이 니르고져 홇배이셔도 마참내 제 뜨들 시러 펴디 몯핧노미 하니라 내 이를 위하야 어엿비 너겨 새로 스믈여듧짱랄 맹가노니 사람마다 해여 수븨 니겨 날로 쑤메 뼌한킈 하고져 핧 싸라미니라',
			)
		);

		$this->post_past = $factory->post->create_and_get(
			array(
				'post_title'   => 'MA GIRLS',
				'post_content' => '나는 너의 용기야 I got yo back 너는 더는 두려워 않아도 돼 니가 느끼는 슬픔과 불안함은 모조리 다 내가 들이마셔 버릴 테니까 넌 마음 놔도 돼',
				'post_date'    => '1997-01-02',
			)
		);

		$attachment = new Data_Attachment( $factory );
		$taxonomy   = new Data_Taxonomy();

		// Assign Tags.
		wp_set_post_terms(
			$this->post_main->ID,
			array( $taxonomy->tag_wordpress->term_id ),
			'post_tag',
			true,
		);
		wp_set_post_terms(
			$this->post_past->ID,
			array( $taxonomy->tag_react->term_id ),
			'post_tag',
			true,
		);

		// Assign Category
		wp_set_post_terms(
			$this->post_main->ID,
			array( $taxonomy->category_blog->term_id ),
			'category',
			true,
		);
		wp_set_post_terms(
			$this->post_past->ID,
			array( $taxonomy->category_blog->term_id ),
			'category',
			true,
		);

		// Assign Series
		wp_set_post_terms(
			$this->post_main->ID,
			array( $taxonomy->series_lyrics->term_id ),
			'series',
			true,
		);
		wp_set_post_terms(
			$this->post_past->ID,
			array( $taxonomy->series_lyrics->term_id ),
			'series',
			true,
		);

		// Assign Meta
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'List' )->get_id(),
			$attachment->attachment_01->ID
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Icon' )->get_id(),
			$attachment->attachment_01->ID
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Title' )->get_id(),
			$attachment->attachment_01->ID
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Background' )->get_id(),
			$attachment->attachment_01->ID
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Thumbnail' )->get_id(),
			$attachment->attachment_01->ID
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Use Background Color' )->get_id(),
			true
		);
		update_post_meta(
			$this->post_main->ID,
			Attachment::get_instance( 'Background Color' )->get_id(),
			'#970000'
		);

		$this->post_main = get_post( $this->post_main->ID );
		$this->post_past = get_post( $this->post_past->ID );
	}
}
