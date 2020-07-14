# frozen_string_literal: true

class SessionsController < DeviseTokenAuth::SessionsController
  wrap_parameters format: []
end
