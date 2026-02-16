import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        hdr = request.headers.get("Authorization","")
        if not hdr.startswith("Bearer "):
            return None
        token = hdr.split(" ",1)[1].strip()
        if not settings.SUPABASE_JWT_SECRET:
            raise exceptions.AuthenticationFailed("SUPABASE_JWT_SECRET not configured")
        try:
            payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
        except Exception:
            raise exceptions.AuthenticationFailed("Invalid token")
        email = payload.get("email") or payload.get("user_metadata", {}).get("email") or ""
        user = type("SupabaseUser", (), {"is_authenticated": True, "email": email, "payload": payload})
        return (user, token)
