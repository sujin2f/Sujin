/**
 * Contributors : sujin2f
 * Package : 2D Tag Cloud
 * License : GPLv2 or later
 */

jQuery(document).ready(function($){
	postboxes.add_postbox_toggles();

	// 스피너 구동!
	function SJ2DTAG_BindSpinners() {
		if( !$.ui ) return false;
		$( '.jquery-spinner' ).spinner({ min : 0 });
	}

	function SJ2DTAG_BindColorPickers() {
		if( !$.fn.spectrum ) {
			$( '.color_picker' ).unbind();
			$( '.color_picker' ).bind( 'keyup', function() {
				var step = $( this ).attr( 'data-step' );
				SJ2DTAG_SetStep( step );
			});

			return false;
		}

		$( '.sp-replacer.sp-light' ).remove();

		$( '.color_picker' ).spectrum({
			allowEmpty: true,
			showInitial: true,
			showInput: true,
			change: function() {
				var step = $( this ).attr( 'data-step' );
				SJ2DTAG_SetStep( step );
			}
		});
	}

	function SJ2DTAG_BindPublishes() {
		$( '#SJ2DTAG #publish #publish' ).click( function( event ) {
			event.preventDefault();

			if ( !$('#SJ2DTAG #titlewrap #title' ).val() ) {
				alert( 'Please Enter the Title!' );
				return false;
			}

			$( '#SJ2DTAG_Form' ).submit();
		});

		$( '#SJ2DTAG #delete-action .submitdelete' ).click( function( event ) {
			if( !confirm( 'Are you really want to delete this setting?' ) ) {
				event.preventDefault();
			}
		});
	}

	// 스텝 스타일 모두 변경
	function SJ2DTAG_ResetSteps() {
		$( '#SJ2DTAG_tag_config thead th > span' ).each( function() {
			var step = $( this ).attr( 'data-step' );
			SJ2DTAG_SetStep( step );
		});
	}

	// 스텝 스타일 하나 변경
	function SJ2DTAG_SetStep( step ) {
		var color = $( '#color_inp_' + step ).val();
		var bgcolor = $( '#bgcolor_inp_' + step ).val();
		var radius = $( '#radius_inp_' + step ).val();
		var padding = $( '#padding_inp_' + step ).val();
		var size = $( '#size_inp_' + step ).val();

		var style = '';
		style+= 'color:' + color + ';';
		style+= 'background-color:' + bgcolor + ';';
		style+= 'border-radius:' + radius + 'px;';
		style+= 'padding:' + padding + 'px;';
		style+= 'font-size:' + size + 'px;';
		style+= 'transition: all 0.5s;';

		$( '#SJ2DTAG_tag_config thead th span[data-step=' + step + '], .inside a[data-step=' + step + ']' ).attr( 'style', style );
		$( '#SJ2DTAG_tag_config thead th span[data-step=' + step + '], .inside a[data-step=' + step + ']' ).hover( function() {
			var step = $( this ).attr( 'data-step' );

			if( $.fn.spectrum ) {
				var color_over = $( '#color_over_inp_' + step ).spectrum("get");
				var bgcolor_over = $( '#bgcolor_over_inp_' + step ).spectrum("get");

				if ( color_over ) color_over = color_over.toHexString();
				if ( bgcolor_over ) bgcolor_over = bgcolor_over.toHexString();
			} else {
				var color_over = $( '#color_over_inp_' + step ).val();
				var bgcolor_over = $( '#bgcolor_over_inp_' + step ).val();
			}

			if ( color_over )
				$( this ).css( 'color', color_over );

			if ( bgcolor_over )
				$( this ).css({'background-color' : bgcolor_over });

		},
		function() {
			var step = $( this ).attr( 'data-step' );

			if( $.fn.spectrum ) {
				var color = $( '#color_inp_' + step ).spectrum("get");
				var bgcolor = $( '#bgcolor_inp_' + step ).spectrum("get");

				if ( color ) color = color.toHexString();
				if ( bgcolor ) bgcolor = bgcolor.toHexString();
			} else {
				var color = $( '#color_inp_' + step ).val();
				var bgcolor = $( '#bgcolor_inp_' + step ).val();
			}


			if ( color )
				$( this ).css({'color' : color });
			else
				$( this ).css({'color' : 'inherit' });

			if ( bgcolor )
				$( this ).css({'background-color' : bgcolor });
			else
				$( this ).css({'background-color' : 'inherit' });

		});

		SJ2DTAG_SetPreviewAppearance();
	}

	// 프리뷰를 재배열
	function SJ2DTAG_ResetPreview() {
		var count = $('#SJ2DTAG_tag_config thead tr th').length;

		$( '#SJ2DTAG #preview .inside a' ).each( function() {
			var random_number = Math.floor(Math.random() * count) + 1;
			$( this ).attr( 'data-step', random_number );
			SJ2DTAG_SetStep( random_number, $( this ) );
		});

		SJ2DTAG_SetPreviewAppearance();
	}

	// 프리뷰에 메인 세팅 적용
	function SJ2DTAG_SetPreviewAppearance() {
		$( '#SJ2DTAG #preview .inside a' ).css({
			'margin-right' : $( '#SJ2DTAG #margin_right' ).val() + 'px',
			'margin-bottom' : $( '#SJ2DTAG #margin_bottom' ).val() + 'px'
		});

		$( '#SJ2DTAG #preview .inside' ).css({
			'line-height' : $( '#SJ2DTAG #line_height' ).val() + $( '#SJ2DTAG #line_height_unit' ).val(),
		});

		if ( $( '#SJ2DTAG #underline:checked' ).length ) {
			$( '#SJ2DTAG #preview .inside a' ).css('text-decoration', 'underline');
		} else {
			$( '#SJ2DTAG #preview .inside a' ).css('text-decoration', 'none');
		}
	}

	// 메인 세팅 부분에 이벤트 적용
	function SJ2DTAG_BindAppearance() {
		$( '#SJ2DTAG #line_height_unit, #SJ2DTAG #underline' ).unbind();
		$( '#SJ2DTAG #line_height_unit, #SJ2DTAG #underline' ).change( function() {
			SJ2DTAG_SetPreviewAppearance();
		});

		$( '#SJ2DTAG #appearance .ui-spinner-button' ).unbind();
		$( '#SJ2DTAG #appearance .ui-spinner-button' ).click( function() {
			SJ2DTAG_SetPreviewAppearance();
		});

		$( '#SJ2DTAG #appearance .jquery-spinner' ).unbind();
		$( '#SJ2DTAG #appearance .jquery-spinner' ).bind( 'keyup', function() {
			SJ2DTAG_SetPreviewAppearance();
		});
	}

	// 태그 세팅 부분에 이벤트 적용
	function SJ2DTAG_BindTagSettings() {
		$( '#SJ2DTAG_tag_config tbody .ui-spinner-button' ).unbind();
		$( '#SJ2DTAG_tag_config tbody .ui-spinner-button' ).click( function() {
			var step = $( this ).parent().find( '.jquery-spinner' ).attr( 'data-step' );
			SJ2DTAG_SetStep( step );
		});

		$( '#SJ2DTAG_tag_config tbody .jquery-spinner' ).unbind();
		$( '#SJ2DTAG_tag_config tbody .jquery-spinner' ).bind( 'keyup', function() {
			var step = $( this ).attr( 'data-step' );
			SJ2DTAG_SetStep( step );
		});
	}

	// 스텝 추가 부분에 이벤트 적용
	function SJ2DTAG_BindAddSteps() {
		$( '#add_step_prev' ).unbind();
		$( '#add_step_prev' ).click( function( event ) {
			event.preventDefault();

			if( $.ui ) {
				$( 'input.ui-spinner-input' ).spinner( "destroy" );
			}
			$( '#SJ2DTAG_tag_config thead th:first' ).clone().insertBefore( '#SJ2DTAG_tag_config thead th:first' );
			$( '#SJ2DTAG_tag_config tbody tr' ).each( function() {
				var $td = $( this ).find( 'td:first' );
				$td.clone().insertBefore( $td );
			});

			SJ2DTAG_ResetTable();
			return false;
		});

		$( '#add_step_next' ).unbind();
		$( '#add_step_next' ).click( function( event ) {
			event.preventDefault();

			if( $.ui ) {
				$( 'input.ui-spinner-input' ).spinner( "destroy" );
			}
			$( '#SJ2DTAG_tag_config thead th:last' ).clone().insertAfter( '#SJ2DTAG_tag_config thead th:last' );
			$( '#SJ2DTAG_tag_config tbody tr' ).each( function() {
				var $td = $( this ).find( 'td:last' );
				$td.clone().insertAfter( $td );
			});

			SJ2DTAG_ResetTable();
			return false;
		});
	}

	// 스텝 삭제 부분에 이벤트 적용
	function SJ2DTAG_BindRemoveStep() {
		$( '#SJ2DTAG_tag_config thead th .delete_column' ).unbind();
		$( '#SJ2DTAG_tag_config thead th .delete_column' ).click( function( event ) {
			event.preventDefault();

			var step = $( this ).parent().find( 'span:first' ).attr( 'data-step' );

			SJ2DTAG_RemoveStep( step );
			SJ2DTAG_ResetTable();
			return false;
		});
	}

	// 스텝 삭제!
	function SJ2DTAG_RemoveStep( step ) {
		if ( !step ) return false;

		step--;
		$( '#SJ2DTAG_tag_config thead th:eq(' + step + ')' ).remove();
		$( '#SJ2DTAG_tag_config tbody tr' ).each( function() {
			$( this ).find( 'td:eq(' + step + ')' ).remove();
		});
	}

	// 테이블을 초기화한다
	function SJ2DTAG_ResetTable() {
		$( '#SJ2DTAG_tag_config thead th' ).each( function( index ) {
			index++;

			$( this ).attr( 'id', 'tag_step_' + index + '_preview' );
			$( this ).find( 'span:first' ).attr( 'data-step', index );

			var html = $( this ).find( 'span:first' ).html().slice(0, -1) + index;
			$( this ).find( 'span:first' ).html( html );
		});

		$( '#SJ2DTAG_tag_config tbody tr' ).each( function() {
			$( this ).find( 'td' ).each( function( index ) {
				index++;

				var key = $( this ).find( '.color_picker' ).attr( 'data-key' );
				$( this ).find( '.color_picker' ).attr( 'data-step', index );
				$( this ).find( '.color_picker' ).attr( 'id', key + '_inp_' + index );
				$( this ).find( '.color_picker' ).attr( 'name', key + '_inp[' + index + ']' );

				key = $( this ).find( '.jquery-spinner' ).attr( 'data-key' );
				$( this ).find( '.jquery-spinner' ).attr( 'data-step', index );
				$( this ).find( '.jquery-spinner' ).attr( 'id', key + '_inp_' + index );
				$( this ).find( '.jquery-spinner' ).attr( 'name', key + '_inp[' + index + ']' );
			});
		});

		SJ2DTAG_BindSpinners();
		SJ2DTAG_BindColorPickers();
		SJ2DTAG_ResetPreview();
		SJ2DTAG_BindRemoveStep();
		SJ2DTAG_BindTagSettings();
	}

	// 초기화
	function SJ2DTAG_Init() {
		SJ2DTAG_BindSpinners();
		SJ2DTAG_BindColorPickers();
		SJ2DTAG_ResetSteps();
		SJ2DTAG_ResetPreview();
		SJ2DTAG_BindAppearance();
		SJ2DTAG_BindTagSettings();
		SJ2DTAG_BindAddSteps();
		SJ2DTAG_BindRemoveStep();
		SJ2DTAG_BindPublishes();
	}

	SJ2DTAG_Init();
});







