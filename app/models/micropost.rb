class Micropost < ActiveRecord::Base
  attr_accessible :category, :content, :latitude, :longitude, :vote_up, :address

  belongs_to :user
  has_many :comments
  accepts_nested_attributes_for :comments

  validates :content, presence: true, length: { maximum: 170 }
  validates :category, presence: true
  validates :user_id, presence: true

  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode

  acts_as_voteable

  default_scope order: 'microposts.created_at DESC'
end
