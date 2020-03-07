JWTSessions.token_store = :memory

JWTSessions.algorithm = 'HS256'
JWTSessions.encryption_key = Rails.application.credentials.secret_jwt_encryption_key

JWTSessions.access_exp_time = 600
JWTSessions.refresh_exp_time = 600