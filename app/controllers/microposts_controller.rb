class MicropostsController < ApplicationController
  before_action :signed_in_user
  before_action :correct_user, only: [:destroy]
  include SessionsHelper

  def create
    @micropost = current_user.microposts.build(params[:micropost])
    if @micropost.save
     respond_to do |format|
       format.html { redirect_to(@micropost) }
       format.json { render json: @micropost }
     end
   else
    format.json {
      flash.now[:notice]="Post Error. Try Again."
    }
  end
end

def home
  @microposts = Micropost.where(:user_id => current_user.id).paginate(:page => params[:page])
end

def vote_up
 @vote = Vote.new(params[:vote])
 @vote.voteable = Micropost.find(params[:id])
 @vote.voter = current_user
 @vote.vote = true
 @vote.save
 respond_to do |format|
  format.html { redirect_to '/list'}
  format.json { head :ok }
end
end

def votes_for
  @micropost = Micropost.find(params[:id])
  votes = @micropost.votes_for
  respond_to do |format|
    format.html { redirect_to root_path}
    format.json { render json: votes.as_json}
  end
end

def show
   @microposts = Micropost.near([current_user.latitude, current_user.longitude],1)
  respond_to do |format|
    format.html
    format.json { render json: @microposts.as_json(only: [:category, :content, :address, :latitude, :longitude, :created_at, :id])  }
  end
end

def destroy
  @micropost.destroy
  redirect_to root_path
end

private

def correct_user
  @micropost = current_user.microposts.find_by_id(params[:id])
  redirect_to root_path if @micropost.nil?
end

def user_params
 params.require(:user).permit(:category, :content, :latitude, :longitude)
end

end
