if ENV['REDIS_URL'].nil?
  JWTSessions.token_store = :memory
else
  JWTSessions.token_store = :redis, { redis_url: ENV['REDIS_URL'] }
end

JWTSessions.algorithm = 'HS256'
JWTSessions.encryption_key = Rails.application.credentials.secret_jwt_encryption_key

JWTSessions.access_exp_time = 600
JWTSessions.refresh_exp_time = 600
JWTSessions.access_header = 'x-access-token'