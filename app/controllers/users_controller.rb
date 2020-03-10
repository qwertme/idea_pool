class UsersController < ApplicationController
  before_action :authorize_access_request!, except: [:create]

  def create
    user = User.new(user_params)
    if user.save
      render json: create_session(user: user), status:201
    else
      render json:{}, status: 400
    end
  end

  def show
    render json: { email: current_user.email, name: current_user.name, avatar_url: current_user.avatar_url }, status: 200
  end

  def destroy
    current_user.destroy
    head :no_content
  end

  private

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
