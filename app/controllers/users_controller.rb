class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      render json: create_session(user: user), status:201
    else
      render json:{}, status: 400
    end
  end

  private

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
