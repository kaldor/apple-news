(function ($) {

	$(document).ready(function () {
		appleNewsSelectInit();
		appleNewsSettingsSortInit( '#meta-component-order-sort', 'meta_component_order' );
		appleNewsColorPickerInit();
		appleNewsPreviewInit();
	});

	function appleNewsFontSelectTemplate( font ) {
		var $fontOption = $( '<span>' )
			.attr( 'style', 'font-family: ' + font.text )
			.text( font.text );

		return $fontOption;
	}

	function appleNewsSelectInit() {
		// Only show fonts on Macs since they're system fonts
		if ( appleNewsSupportsMacFeatures() ) {
			$( '.select2.standard' ).select2();
			$( '.select2.font' ).select2({
				templateResult: appleNewsFontSelectTemplate,
				templateSelection: appleNewsFontSelectTemplate
			});
		} else {
			$( '.select2' ).select2();
			$( 'span.select2' ).after(
				$( '<div>' )
					.addClass( 'font-notice' )
					.text( appleNewsSettings.fontNotice )
			)
		}
	}

	function appleNewsSettingsSortInit( selector, key ) {
		$( selector ).sortable( {
			'stop' : function( event, ui ) {
				appleNewsSettingsSortUpdate( $( this ), key );
			},
		} );
   	$( selector ).disableSelection();
   	appleNewsSettingsSortUpdate( $( selector ), key );
	}

	function appleNewsSettingsSortUpdate( $sortableElement, keyPrefix ) {
		// Build the key for field
		var key = keyPrefix + '[]';

		// Remove any current values
		$( 'input[name="' + key + '"]' ).remove();

		// Create a hidden form field with the values of the sortable element
		var values = $sortableElement.sortable( 'toArray' );
		if ( values.length > 0 ) {
			$.each( values.reverse(), function( index, value ) {
				$hidden = $( '<input>' )
					.attr( 'type', 'hidden' )
					.attr( 'name', key )
					.attr( 'value', value );

				$sortableElement.after( $hidden );
			} );
		}

		// Update the preview
		appleNewsUpdatePreview();
	}

	function appleNewsColorPickerInit() {
		$( '.apple-news-color-picker' ).iris({
			palettes: true,
			width: 320,
			change: appleNewsUpdatePreview
		});

		$( '.apple-news-color-picker' ).on( 'click', function() {
			$( '.apple-news-color-picker' ).iris( 'hide' );
			$( this ).iris( 'show' );
		});
	}

	function appleNewsSupportsMacFeatures() {
		if ( 'MacIntel' === navigator.platform ) {
			return true;
		} else {
			return false;
		}
	}

	function appleNewsPreviewInit() {
		// Do an initial update
		appleNewsUpdatePreview();

		// Ensure all further updates also affect the preview
		$( '#apple-news-settings-form :input' ).on( 'change', appleNewsUpdatePreview );

		// Show the preview
		$( '.apple-news-settings-preview' ).show();
	}

	function appleNewsUpdatePreview() {
		console.log( 'updating preview' );

		// Create a map of the form values to the preview elements
		// Layout spacing
		appleNewsSetCSS( '.apple-news-settings-preview', 'layout_margin', 'padding-left', 'pt', .1 );
		appleNewsSetCSS( '.apple-news-settings-preview', 'layout_margin', 'padding-right', 'pt', .1 );

		// Body
		appleNewsSetCSS( '.apple-news-settings-preview p', 'body_font', 'font-family', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview p', 'body_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview p', 'body_color', 'color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview a', 'body_link_color', 'color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview', 'body_background_color', 'background-color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview p', 'body_orientation', 'text-align', null, null );

		// Dropcap
		appleNewsSetCSS( '.apple-news-settings-preview .apple-news-dropcap', 'dropcap_color', 'color', null, null );
		var bodySize = $( '#body_size' ).val();
		var bodyLineHeight = $( '#body_line_height' ).val();
		var dropcapSize = bodySize;
		var dropcapLineHeight = bodyLineHeight;

		if ( 'yes' === $( '#initial_dropcap' ).val() ) {
			dropcapSize = bodySize * 6;
			dropcapLineHeight = bodySize * 5;
			$( '.apple-news-settings-preview .apple-news-dropcap' ).addClass( 'apple-news-dropcap-enabled' );
		} else {
			$( '.apple-news-settings-preview .apple-news-dropcap' ).removeClass( 'apple-news-dropcap-enabled' );
		}
		$( '.apple-news-settings-preview .apple-news-dropcap' ).css( 'font-size', dropcapSize + 'pt' );
		$( '.apple-news-settings-preview .apple-news-dropcap' ).css( 'line-height', dropcapLineHeight + 'pt' );

		// Byline
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-byline', 'byline_font', 'font-family', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-byline', 'byline_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-byline', 'byline_color', 'color', null, null );
		// TODO: function to set byline format, maybe undo changes to class-export.php?

		// Headings
		appleNewsSetCSS( '.apple-news-settings-preview :header', 'header_font', 'font-family', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview :header', 'header_color', 'color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview h1', 'header1_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview h2', 'header2_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview h3', 'header3_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview h4', 'header4_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview h5', 'header5_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview h6', 'header6_size', 'font-size', 'pt', null );

		// Pull quote
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_font', 'font-family', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_size', 'font-size', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_color', 'color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_transform', 'text-transform', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_border_color', 'border-left-color', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_border_style', 'border-left-style', null, null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_border_width', 'border-left-width', 'pt', null );

		// Gallery
		// TODO: probably will skip?

		// Advertisement
		// TODO: probably will skip?

		// Component order
		// TODO: create a function to move elements

		// Line heights
		appleNewsSetCSS( '.apple-news-settings-preview p', 'body_line_height', 'line-height', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview :header', 'header_line_height', 'line-height', 'pt', null );
		appleNewsSetCSS( '.apple-news-settings-preview div.apple-news-pull-quote', 'pullquote_line_height', 'line-height', 'pt', null );
	}

	function appleNewsSetCSS( displayElement, formElement, property, units, scale ) {
		// Get the form value
		var value = $( '#' + formElement ).val();

		// If the value is 'none', make it empty
		if ( 'none' === value ) {
			value = '';
		}

		// Add units if set and we got a value
		if ( units && value ) {
			value = value + units;
		}

		// Some values need to be scaled
		if ( scale && value ) {
			value = parseInt( value ) * scale;
		}

		$( displayElement ).css( property, value );
	}

}( jQuery ) );
