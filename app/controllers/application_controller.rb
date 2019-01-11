class ApplicationController < ActionController::Base
  include JWTSessions::RailsAuthorization
  rescue_from JWTSessions::Errors::Unauthorized, with: :not_authorized

  skip_before_action :verify_authenticity_token

  def create_session(user:)
    session = JWTSessions::Session.new(payload: user.to_payload, refresh_payload: user.to_payload)
    tokens = session.login
    { jwt: tokens[:access], refresh_token: tokens[:refresh] }
  end

  private

  def not_authorized
    render json: { error: 'Not authorized' }, status: :unauthorized
  end

  def authorize_refresh_request!
    request.headers['X-Refresh-Token'] = params[:refresh_token]
    super
  end

  def current_user
    @current_user ||= User.find(payload['id'])
  end
end
