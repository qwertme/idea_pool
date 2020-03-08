require 'rails_helper'

RSpec::Matchers.define :expire_in do |timeout|
  match do |token|
    decoded = JWTSessions::Token.decode(token).first
    decoded['exp'].to_i <= (Time.now + timeout).to_i
  end
end

RSpec::Matchers.define :match_token_key_value do |key, value|
  match do |token|
    decoded = JWTSessions::Token.decode(token).first
    decoded[key] == value
  end
end

RSpec.describe UsersController, type: :controller do
  let(:body) { JSON.parse(response.body)}

  context '#create' do
    let(:user_parameters) { { name: 'Jack', email: 'jack@mailinator.com', password: 'supersecret', password_confirmation: 'supersecret' } }
    let(:last_user) { User.last }
    let(:last_user_payload) { last_user.to_payload }
    let(:body) { JSON.parse(response.body) }

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
      expect(body).to have_key('jwt')
      expect(body).to have_key('refresh_token')
      expect(body['jwt']).to expire_in(10.minutes)
      expect(body['refresh_token']).to expire_in(10.minutes)
      expect(body['jwt']).to match_token_key_value('email', last_user_payload['email'])
      expect(body['jwt']).to match_token_key_value('name', last_user_payload['name'])
      expect(body['jwt']).to match_token_key_value('id', last_user_payload['id'])
    end

    context 'wrong input' do
      let(:user_parameters) { {} }
      it 'responds 400' do
        expect(response.status).to eq 400
      end
    end
  end

end
