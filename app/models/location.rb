# frozen_string_literal: true

class Location < ApplicationRecord
  belongs_to :campground, inverse_of: :location
end
