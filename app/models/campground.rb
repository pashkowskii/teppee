# frozen_string_literal: true

class Campground < ApplicationRecord
  belongs_to :user
  has_one :location
  has_one_attached :image

  accepts_nested_attributes_for :location, allow_destroy: true

  self.per_page = 20
end
