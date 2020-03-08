require 'rails_helper'

RSpec.describe Idea, type: :model do
  subject(:idea) { FactoryBot.create(:idea, ease: 7, confidence: 8, impact: 4) }

  it { is_expected.to belong_to(:user) }
  it { is_expected.to validate_presence_of(:content) }
  it { is_expected.to validate_length_of(:content).is_at_most(255) }
  it { is_expected.to validate_presence_of(:impact) }
  it { is_expected.to validate_numericality_of(:impact).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(10) }
  it { is_expected.to validate_presence_of(:ease) }
  it { is_expected.to validate_numericality_of(:ease).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(10) }
  it { is_expected.to validate_presence_of(:confidence) }
  it { is_expected.to validate_numericality_of(:confidence).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(10) }

  context '#average_score' do
    it 'calculates' do
      expect(subject.average_score).to be_within(0.1).of((idea.ease + idea.confidence + idea.impact)/3.0)
    end
  end

  context '#as_json' do
    let(:attributes_for_json) { { 'id' => subject.hashid,
                                  'content' =>  subject.content,
                                  'impact' => subject.impact,
                                  'ease' => subject.ease,
                                  'confidence' => subject.confidence,
                                  'average_score' => subject.average_score,
                                  'created_at' => subject.created_at.to_i } }

    it { expect(subject.as_json).to eq attributes_for_json }
  end
end
