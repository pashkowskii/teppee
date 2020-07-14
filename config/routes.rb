# frozen_string_literal: true

Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth',
                                      defaults: { format: 'json' },
                                      controllers: { sessions: 'sessions' }

  namespace :api, defaults: { format: :json } do
    resources :campgrounds
  end

  get '/campgrounds'          => 'home#index'
  get '/campgrounds/new'      => 'home#index'
  get '/campgrounds/:id/edit' => 'home#index'
  get '/campgrounds/:id'      => 'home#index'

  get '/signup'               => 'home#index'
  get '/login'                => 'home#index'

  root 'home#index'
end
