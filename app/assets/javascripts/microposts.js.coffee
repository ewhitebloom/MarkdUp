$ ->
  $('a.load-more-posts').bind 'inview', (e, visible) ->
    return unless visible

    $.getScript $(this).attr('href')
