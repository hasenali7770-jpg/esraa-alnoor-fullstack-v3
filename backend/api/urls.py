from django.urls import path
from . import views

urlpatterns = [
  path("health/", views.health),

  path("settings/public/", views.settings_public),
  path("admin/me/", views.admin_me),

  path("pages/by-slug/<slug:slug>/", views.page_by_slug),

  path("courses/", views.courses_list),
  path("courses/<slug:slug>/", views.course_detail),

  path("pricing/", views.pricing_list),

  path("comments/", views.comments_list),
  path("comments/create/", views.comments_create),

  path("activation/redeem/", views.redeem_activation),

  path("pages/admin/list/", views.pages_admin_list),
  path("pages/admin/create/", views.pages_admin_create),
  path("pages/admin/upsert/", views.pages_admin_upsert),

  path("activation/admin/generate/", views.activation_generate),

  path("admin/settings/", views.admin_settings),
  path("admin/settings/update/", views.admin_settings_update),
]
