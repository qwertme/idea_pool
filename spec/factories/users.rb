FactoryBot.define do
  factory :user do
    name { 'Jack User'}
    sequence(:email) { |n| "jack#{n}@mailinator.com" }
    password { 'supersecret' }
    password_confirmation { 'supersecret' }
  end
end
