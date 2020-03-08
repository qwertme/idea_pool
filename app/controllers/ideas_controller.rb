class IdeasController < ApplicationController
  before_action :authorize_access_request!
  before_action :load_idea, only: [:destroy, :update]

  MAX_PAGES = 10

  def create
    idea = current_user.ideas.new(idea_params)
    if idea.save
      render json: idea, status: 201
    else
      head 400
    end
  end

  def destroy
    @idea.destroy
    head 204
  end

  def index
    render json: current_user.ideas.page(params[:page]).per(MAX_PAGES), status: 200
  end

  def update
    if @idea.update(idea_params)
      render json: @idea, status: 200
    else
      head 400
    end
  end

  private

  def idea_params
    params.permit(:content, :impact, :ease, :confidence)
  end

  def load_idea
    @idea = current_user.ideas.find_by_hashid(params[:id])
    unless @idea
      head 404
      return false
    end
  end
end
