<?php
/**
 * 2D Tag Cloud - Main Class
 *
 * @package sujin-2d-tag-cloud
 * @author Sujin 수진 Choi
 * @version 6.0.0
 */

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

class SJ2DTAG_main {
	private static function convert_css_style( $options ) {
		foreach( $options as &$color ) {
			if( !$color['bgcolor'] ) $color['bgcolor'] = 'transparent';

			$padding2 = $color['padding'] + 2;
			if ( $color['padding'] ) $color['padding'] = $color['padding'] . 'px ' . $padding2 . 'px';
		}

		return $options;
	}

	private static function print_css( $set ) {
		$tag_config = SJ2DTAG_options::get_option( $set );

		if ( $set === false ) {
			$set = 'default';
			$tag_config = SJ2DTAG_options::$default_option;
		}

		# initialize;
		$style = 'margin-right:' . $tag_config['margin_right'] . 'px !important; ';
		$style.= 'margin-bottom:' . $tag_config['margin_bottom'] . 'px !important; ';
		$style.= 'display:inline-block !important; ';
		$style.= 'line-height:' . $tag_config['line_height'] . $tag_config['line_height_unit'] . ' !important; ';
		$style.= 'text-decoration:none !important; ';
		$style.= 'border:none !important; ';
		$style.= 'transition: all 0.5s !important; ';

		$underline = ( $tag_config['underline'] ) ? 'text-decoration:underline !important;' : '';

		$output = 'body .sj_tagcloud_set_' . $set . ' a {' . $style . '}';

		for( $i=1; $i <= count( $tag_config['tag_config'] ); $i++ ) {
			$style_color = $style_size = $style_color_over = '';

			foreach( $tag_config['tag_config'][$i] as &$css_value ) {
				if ( !$css_value ) $css_value = 'inherit';
			}

			$style_size = 'font-size:' . $tag_config['tag_config'][$i]['size'] . 'px !important; ';
			$style_color = 'color:' . $tag_config['tag_config'][$i]['color'] . ' !important; ';
			$style_color.= 'background-color:' . $tag_config['tag_config'][$i]['bgcolor'] . ' !important; ';
			$style_color.= 'border-radius:' . $tag_config['tag_config'][$i]['radius'] . 'px !important; ';
			$style_color.= 'padding:' . $tag_config['tag_config'][$i]['padding'] . 'px !important; ';

			$style_color_over = 'color:' . $tag_config['tag_config'][$i]['color_over'] . ' !important;';
			$style_color_over.= 'background-color:' . $tag_config['tag_config'][$i]['bgcolor_over'] . ' !important;';


			$output.= 'body .sj_tagcloud_set_' . $set . ' a.size_' . $i . ' {' . $style_size . '}';
			$output.= 'body .sj_tagcloud_set_' . $set . ' a.color_' . $i . ' {' . $style_color . '}';
			$output.= 'body .sj_tagcloud_set_' . $set . ' a.color_' . $i . ':hover {' . $style_color_over . ' ' . $underline . '}';
		}

		return $output;
	}

	public static function get_tagcloud( $options ) {
		$set = $options['set'];

		$tag_config = SJ2DTAG_options::get_option( $set );

		if ( $set === false ) {
			$set = 'default';
			$tag_config = SJ2DTAG_options::$default_option;
		}

		$cache = get_option( 'SJ_2DTAG_CACHE' );
		if ( !$cache ) $cache = array();

		if ( isset( $cache[$set] ) ) return $cache[$set];

		$tags_count = SJ2DTAG_database::get_tags_count( $options['number'] );
		$tags_hit = SJ2DTAG_database::get_tags_hit( $options['number'] );

		$tags = array();

		# 히트와 뷰를 한 개씩 섞는다
		$k = 0;
		for ($i=0; $i<$options['number']; $i++) {
			if (isset($tags_count[$i])) {
				$tags[$tags_count[$i]->term_id] = $tags_count[$i];
				if (!isset($tags[$tags_count[$i]->term_id])) {
					$k++;
					if ( $k == $options['number'] ) break;
				}
			}

			if ( $options['sort'] == 'intersection' ) {
				$j = $options['number'] - $i;
			} else {
				$j = $i;
			}

			if (isset($tags_hit[$j])) {
				$tags[$tags_hit[$j]->term_id] = $tags_hit[$j];
				if (!isset($tags[$tags_hit[$j]->term_id])) {
					$k++;
					if ($k == $options['number']) break;
				}
			}
		}

		$tags = array_slice( $tags, 0, $options['number'] );

		# 한 자리에 몰아넣는 배열을 만든다, 민/맥스도 뽑고 각각의 녀석에게 스타일도 부여하기 위해
		$hit = $count = $tags_out = array();
		foreach ($tags as $tag) {
			$hit[$tag->term_id] = $tag->post_hit;
			$count[$tag->term_id] = $tag->post_count;
		}

		# 값으로 정렬
		asort( $count );
		asort( $hit );

		# 한 단계에 몇 개의 태그가 들어가는지...
		$tag_step = count( $tags ) / count( $tag_config['tag_config'] );

		# 두바퀴만 더 돌려 카운트와 히트를 스텝에 맞는 값으로 변환한다
		$i = 0;
		$prev_value = -1;
		$prev_chanded = -1;

		foreach ( $count as $key => &$value ) {
			if ( $prev_value == $value ) {
				$value = $prev_chanded;
			} else {
				$prev_value = $value;
				$value = $prev_chanded = floor( $i / $tag_step ) + 1; // 0,1,2 대신 1,2,3을 사용했으니 편의상 +1
			}

			$i++;
		}

		$i = 0;
		$prev_value = -1;
		$prev_chanded = -1;

		foreach ( $hit as $key => &$value ) {
			if ( $prev_value == $value ) {
				$value = $prev_chanded;
			} else {
				$prev_value = $value;
				$value = $prev_chanded = floor( $i / $tag_step ) + 1; // 0,1,2 대신 1,2,3을 사용했으니 편의상 +1
			}

			$i++;
		}

		if ( $options['sort'] == 'name' || $options['sort'] == 'alphabetical') {
			$new_tag = array();

			foreach ($tags as $tag) {
				$new_tag[strtolower( $tag->tag_name )] = $tag;
			}

			ksort( $new_tag );
			$tags = $new_tag;
		}

		# 준비는 끝났다 +_+ 이제 녀석들을 만들어보자
		$i = 0;
		$tags_out = array();
		foreach ($tags as $tag) {
			$link = get_tag_link($tag->term_id);

			if ($tag_config['tag_method'] == 'click-color') {
				$tag_size = $count[$tag->term_id];
				$tag_color = $hit[$tag->term_id] ? $hit[$tag->term_id] : 1;
			} else {
				$tag_color = $count[$tag->term_id];
				$tag_size = $hit[$tag->term_id] ? $hit[$tag->term_id] : 1;
			}

			$tags_out[] = '<a id="sj_tag_' . $i . '" class="size_' . $tag_size . ' color_' . $tag_color . '" href="' . $link . '">' . $tag->tag_name . '</a>';
			$i++;
		}

		$output = '<div class="tag_cloud sj_tagcloud_set_' . $set . '">';
		$output.= implode( $options['separator'], $tags_out);
		$output.= '</div>';
		$output.= '<style>';
		$output.= self::print_css( $set );
		$output.= '</style>';

		$cache[$set] = $output;

		update_option( 'SJ_2DTAG_CACHE', $cache );

		return $output;
	}
}
