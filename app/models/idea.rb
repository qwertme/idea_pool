class Idea < ApplicationRecord
  include Hashid::Rails

  belongs_to :user

  default_scope -> { order(:average_score)}

  validates :content, presence: true, length: { maximum: 255 }
  validates :impact, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  validates :ease, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  validates :confidence, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }

  before_save :calculate_average_score

  def as_json(option = nil)
    { 'id' => self.hashid,
      'content' =>  self.content,
      'impact' => self.impact,
      'ease' => self.ease,
      'confidence' => self.confidence,
      'average_score' => self.average_score,
      'created_at' => self.created_at.to_i }
  end

  private

  def calculate_average_score
    self.average_score = (self.impact + self.ease + self.confidence) / 3.0
  end
end
