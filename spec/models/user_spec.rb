require 'rails_helper'

RSpec.describe User, type: :model do
  it { is_expected.to have_secure_password }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_presence_of(:password) }

  context '#to_payload' do
    let(:user) { FactoryBot.create(:user) }
    let(:payload) { user.to_payload }

    it 'contains email' do
      expect(payload['email']).to eq user.email
    end

    it 'contains name' do
      expect(payload['name']).to eq user.name
    end

    it 'contains hashed id' do
      expect(payload['id']).to eq user.hashid
    end
  end

  context '#avatar_url' do
    let(:user) { FactoryBot.create(:user) }
    let(:avatar_url) { "http://gravatar.com/avatar/#{Digest::MD5::hexdigest(user.email).downcase}.png?d=mm&s=200" }

    it 'returns gravatar url' do
      expect(user.avatar_url).to eq avatar_url
    end
  end
end
