# frozen_string_literal: true

class CreateCampground
  def initialize(campground, params)
    @campground = campground
    @params = params
  end

  def call
    if @params[:image] && !file?(@params[:image])
      delete_image if @campground.image.attached?
      @params.delete(:image)
    end

    @campground.save
  end

  private

  def file?(param)
    param.is_a?(ActionDispatch::Http::UploadedFile)
  end

  def delete_image
    @campground.image.purge
  end
end
