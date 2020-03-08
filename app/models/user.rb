class User < ApplicationRecord
  include Hashid::Rails

  has_secure_password

  validates :name, presence: true
  validates :email, presence: true
  validates :password, presence: true

  def to_payload
    {
      'email' => email,
      'name' => name,
      'id' => hashid
    }
  end
end
