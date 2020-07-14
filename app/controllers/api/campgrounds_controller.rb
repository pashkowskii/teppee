# frozen_string_literal: true

class Api::CampgroundsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_campground, only: %i[show update destroy]

  def index
    @campgrounds = Campground
                   .where(user: current_user)
                   .paginate(page: params[:page])
                   .order('created_at DESC')

    render json: ActiveModelSerializers::SerializableResource
      .new(@campgrounds.with_attached_image, adapter: :json)
      .as_json, status: :ok
  end

  def show
    if @campground.user != current_user
      render json: { success: false, errors: ['You don\'t have the campgrounds'] },
             status: :not_found
      return
    end

    render json: ActiveModelSerializers::SerializableResource
      .new(@campground, adapter: :json)
      .as_json, status: :ok
  end

  def create
    @campground = Campground.new(campground_params)
    @campground.user = current_user

    if CreateCampground.new(@campground, campground_params).call
      render json: @campground, status: :created
    else
      render json: @campground.errors, status: :unprocessable_entity
    end
  end

  def update
    if @campground.user != current_user
      render json: {
        success: false,
        errors: ['You don\'t have the campground']
      },
             status: :not_found
      return
    end

    if UpdateCampground.new(@campground, campground_params).call
      render json: @campground, status: :ok
    else
      render json: @campground.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @campground.user != current_user
      render json: {
        success: false,
        errors: ['You don\'t have the campground']
      },
             status: :not_found
      return
    end

    @campground.destroy
    head :no_content
  end

  private

  def set_campground
    @campground = Campground.find(params[:id])
  end

  def campground_params
    params
      .permit(:title, :description,
              :image, location_attributes: %i[longitude latitude])
  end
end
