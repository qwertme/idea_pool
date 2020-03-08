require 'rails_helper'

RSpec.describe LoginController, type: :request do
  let(:password) { 'supersecret'}
  let(:user) { FactoryBot.create(:user, password: 'supersecret', password_confirmation: 'supersecret') }
  let(:login) {
    post login_path, params: { email: user.email, password: password }
    JSON.parse(response.body)
  }
  let(:access_token) { login['jwt'] }
  let(:refresh_token) { login['refresh_token'] }

  context '#create' do
    context 'valid user' do

      before do
        post login_path, params: { email: user.email, password: password }
      end

      context 'wrong password' do
        let(:password) { 'wrong password' }

        it 'fails' do
          expect(response.status).to eq 400
        end
      end

      it_behaves_like 'valid login' do
        let(:email) { user.email }
      end
    end

    it 'no user' do
      post login_path, params: { email: 'nobody@nothere.com', password: 'supersecret' }

      expect(response.status).to eq 400
    end
  end

  context '#refresh' do
    context 'logged in' do
      let(:body) { JSON.parse(response.body) }

      it 'has valid content' do
        post refresh_login_path, params: { refresh_token: refresh_token }, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 200
        expect(response.content_type).to eq 'application/json; charset=utf-8'
        expect(body).to have_key('jwt')
        expect(body['jwt']).to expire_in(10.minutes)
        expect(body['jwt']).to match_token_key_value('id', user.hashid)
        expect(body['jwt']).to match_token_key_value('email', user.email)
        expect(body['jwt']).to match_token_key_value('name', user.name)
      end
    end

    context 'not logged in' do
      it 'unauthorized' do
        post refresh_login_path, params: { refresh_token: '' }

        expect(response.status).to eq 401
      end
    end
  end

  context '#delete' do
    context 'logged in' do
      it 'success' do
        delete login_path, params:{ refresh_token: refresh_token }, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 204

        post refresh_login_path, params: { refresh_token: refresh_token }

        expect(response.status).to eq 401
      end
    end
  end
end
