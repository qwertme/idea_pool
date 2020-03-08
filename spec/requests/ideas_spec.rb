require 'rails_helper'

RSpec.describe IdeasController, type: :request do
  context 'logged in' do
    let(:user) { FactoryBot.create(:user) }
    let(:login) {
      post login_path, params: { email: user.email, password: 'supersecret' }
      JSON.parse(response.body)
    }
    let(:access_token) { login['jwt'] }

    context '#create' do
      let(:idea_params) { FactoryBot.attributes_for(:idea) }

      before do
        post ideas_path, params: idea_params, headers: { 'x-access-token' => access_token }
      end

      it 'has valid parameters' do
        expect(response.status).to eq 201
        expect(response.body).to eq user.ideas.last.to_json
      end

      context 'invalid parameters' do
        let(:idea_params) { {} }

        it 'returns 400' do
          expect(response.status).to eq 400
        end
      end
    end

    context '#destroy' do
      let(:idea) { FactoryBot.create(:idea, user: user) }

      before do
        idea
      end

      it 'deletes' do
        expect {
          delete idea_path(id: idea.hashid), headers: { 'x-access-token' => access_token }
        }.to change { user.ideas.count }.by -1

        expect(response.status).to eq 204
      end

      context 'cross user' do
        let(:idea) { FactoryBot.create(:idea) }
        it 'does not delete someone else s idea' do
          expect {
            delete idea_path(id: idea.hashid), headers: { 'x-access-token' => access_token }
          }.to_not change { Idea.count }

          expect(response.status).to eq 404
        end
      end
    end

    context '#index' do
      let!(:ideas) { FactoryBot.create_list(:idea, 11, user: user) }

      it 'lists first page' do
        get ideas_path, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 200
        expect(response.body).to eq ideas[0..9].to_json
      end

      it 'lists next page' do
        get ideas_path, params: { page: 2 }, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 200
        expect(response.body).to eq ideas[10..11].to_json
      end
    end

    context '#udpate' do
      let(:idea) { FactoryBot.create(:idea, user: user) }

      it 'has valid parameters' do
        put idea_path(id: idea.hashid), params: {content: 'updated', impact: idea.impact + 1, ease: idea.ease + 1, confidence: idea.confidence + 1 }, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 200
        expect(response.body).to eq idea.reload.to_json
      end

      it 'has invalid parameters' do
        put idea_path(id: idea.hashid), params: { impact: 100 }, headers: { 'x-access-token' => access_token }

        expect(response.status).to eq 400
      end

      context 'cross user' do
        let(:idea) { FactoryBot.create(:idea) }
        it 'does not delete someone else s idea' do
          put idea_path(id: idea.hashid), params: { content: 'updated' }, headers: { 'x-access-token' => access_token }

          expect(response.status).to eq 404
        end
      end
    end
  end

  it 'cannot create' do
    post ideas_path
    expect(response.status).to eq 401
  end

  it 'cannot delete' do
    delete idea_path(id: 'A')
    expect(response.status).to eq 401
  end

  it 'cannot list' do
    get ideas_path
    expect(response.status).to eq 401
  end

  it 'cannot update' do
    put idea_path(id: 'A')
    expect(response.status).to eq 401
  end
end
