class LoginController < ApplicationController
  before_action :authorize_refresh_request!, only: [:refresh, :destroy]

  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      render json: create_session(user: user), status: 201
    else
      render json: {}, status: 400
    end
  end

  def refresh
    render json: refresh_session(user: current_user, token: found_token), status: 200
  end

  def destroy
    destroy_session(token: found_token)
  end

  private

  def refresh_session(user:, token:)
    session = JWTSessions::Session.new(payload: user.to_payload)
    tokens = session.refresh(token)
    { jwt: tokens[:access] }
  end

  def destroy_session(token:)
    session = JWTSessions::Session.new
    session.flush_by_token(token)
  end

end
