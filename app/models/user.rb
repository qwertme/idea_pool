class User < ApplicationRecord
  include Hashid::Rails

  has_secure_password

  has_many :ideas, dependent: :destroy

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

  def avatar_url
    gravatar = Digest::MD5::hexdigest(self.email).downcase
    "http://gravatar.com/avatar/#{gravatar}.png?d=mm&s=200"
  end
end
