class Comment < ActiveRecord::Base
  attr_accessible :body, :commenter
  validates :body, presence: true, length: { maximum: 170, minimum: 1 }
  belongs_to :micropost
end
