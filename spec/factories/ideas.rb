FactoryBot.define do
  factory :idea do
    content { 'My invention of the year' }
    impact { 1 }
    ease { 1 }
    confidence { 1 }
    association(:user)
  end
end
