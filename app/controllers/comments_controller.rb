class CommentsController < ApplicationController

  def create
    @micropost = Micropost.find(params[:micropost_id])
    @comment = @micropost.comments.create(params[:comment])
    if @comment.save
      redirect_to micropost_path(@micropost)
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:commenter, :body)
  end

end
