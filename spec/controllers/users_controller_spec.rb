require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user_parameters) { { name: 'Jack', email: 'jack@mailinator.com', password: 'supersecret', password_confirmation: 'supersecret' } }
  context '#create' do
    let(:last_user) { User.last }

    before do
      post :create, params: user_parameters
    end

    it 'creates' do
      expect(last_user.name).to eq 'Jack'
      expect(last_user.email).to eq 'jack@mailinator.com'
      expect(last_user.authenticate('supersecret')).to be_truthy
    end

    it 'responds' do
      expect(response.status).to eq 201
      expect(response.content_type).to eq 'application/json; charset=utf-8'
    end

    context 'wrong input' do
      let(:user_parameters) { {} }
      it 'responds 400' do
        expect(response.status).to eq 400
      end
    end
  end
end
