$(function(){
  $('.micropost').on('click', '.toggle-comments', function(event) {
    event.preventDefault();
    var $comments = $(event.currentTarget).siblings('.comments').first();
    $comments.toggleClass('comments-hidden');
  });
});
