from django.contrib import admin
from django.urls import path, include
from api.views import health

urlpatterns = [
    path("", health),
    path("api/", include("api.urls")),
    path("admin/", admin.site.urls),
]
