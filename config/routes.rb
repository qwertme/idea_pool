Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :users, only: [:create]
  get 'me', to: 'users#show'

  resource :login, only: [:create, :destroy], controller: 'login', path: 'access-tokens' do
    post :refresh
  end
end
