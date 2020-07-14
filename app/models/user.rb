# frozen_string_literal: true

class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:facebook]

  include DeviseTokenAuth::Concerns::User

  has_many :campgrounds, dependent: :destroy
end
