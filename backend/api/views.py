from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import secrets

from .models import Page, Course, Comment, PricingPlan, ActivationCode, AccessGrant
from .serializers import PageSerializer, CourseListSerializer, CourseDetailSerializer, CommentSerializer, SettingsSerializer, PricingSerializer, ActivationSerializer
from .utils import format_price, get_settings
from .permissions import IsAdminEmail
from django.conf import settings

@api_view(["GET"])
def health(_):
    return Response({"ok": True})

@api_view(["GET"])
def settings_public(_):
    s = get_settings()
    return Response(SettingsSerializer(s).data)

@api_view(["GET"])
def admin_me(request):
    email = (getattr(request.user, "email", "") or "").lower()
    return Response({"email": email, "is_admin": email in settings.ADMIN_EMAILS})

@api_view(["GET"])
def page_by_slug(request, slug):
    lang = request.GET.get("lang","ar")
    page = Page.objects.filter(slug=slug, locale=lang).first()
    if not page:
        return Response({"slug": slug, "locale": lang, "html": None, "content_json": {}}, status=200)
    return Response(PageSerializer(page).data)

@api_view(["GET"])
def courses_list(request):
    lang = request.GET.get("lang","ar")
    currency = request.GET.get("currency","USD")
    qs = Course.objects.filter(is_published=True).order_by("-is_featured","featured_order","id")
    data = CourseListSerializer(qs, many=True, context={"lang":lang}).data
    for item, obj in zip(data, qs):
        item["price_display"] = format_price(obj.price_usd, obj.price_iqd_manual, obj.use_manual_iqd, currency)
    return Response({"results": data})

@api_view(["GET"])
def course_detail(request, slug):
    lang = request.GET.get("lang","ar")
    currency = request.GET.get("currency","USD")
    course = get_object_or_404(Course, slug=slug, is_published=True)
    data = CourseDetailSerializer(course, context={"lang":lang}).data
    data["price_display"] = format_price(course.price_usd, course.price_iqd_manual, course.use_manual_iqd, currency)
    email = (getattr(request.user, "email", "") or "").lower()
    data["has_access"] = bool(email) and AccessGrant.objects.filter(user_email=email, course=course).exists()
    return Response(data)

@api_view(["GET"])
def pricing_list(request):
    currency = request.GET.get("currency","USD")
    qs = PricingPlan.objects.filter(is_active=True).order_by("id")
    data = PricingSerializer(qs, many=True).data
    for item, obj in zip(data, qs):
        item["price_display"] = format_price(obj.price_usd, obj.price_iqd_manual, obj.use_manual_iqd, currency)
    return Response({"results": data})

@api_view(["GET"])
def comments_list(request):
    target_type = request.GET.get("target_type","home")
    slug = request.GET.get("slug","home")
    qs = Comment.objects.filter(target_type=target_type, target_slug=slug, is_approved=True).order_by("-created_at")[:100]
    return Response({"results": CommentSerializer(qs, many=True).data})

@api_view(["POST"])
def comments_create(request):
    if not getattr(request.user, "is_authenticated", False):
        return Response({"detail":"auth required"}, status=401)
    email = getattr(request.user, "email", "") or ""
    payload = request.data or {}
    c = Comment.objects.create(
        target_type=payload.get("target_type","home"),
        target_slug=payload.get("target_slug","home"),
        user_email=email,
        content=(payload.get("content","") or "").strip(),
        is_approved=True,
    )
    return Response(CommentSerializer(c).data, status=201)

@api_view(["POST"])
def redeem_activation(request):
    if not getattr(request.user, "is_authenticated", False):
        return Response({"detail":"auth required"}, status=401)
    email = (getattr(request.user, "email", "") or "").lower()
    code = (request.data or {}).get("code","").strip()
    obj = ActivationCode.objects.filter(code=code).first()
    if not obj:
        return Response({"detail":"invalid code"}, status=400)
    if obj.used_at:
        return Response({"detail":"code already used"}, status=400)
    if obj.expires_at and obj.expires_at < timezone.now():
        return Response({"detail":"code expired"}, status=400)
    if obj.user_email.lower() != email:
        return Response({"detail":"email mismatch"}, status=400)
    if obj.course:
        AccessGrant.objects.get_or_create(user_email=email, course=obj.course)
    if obj.plan:
        AccessGrant.objects.get_or_create(user_email=email, plan=obj.plan)
    obj.used_at = timezone.now()
    obj.save(update_fields=["used_at"])
    return Response({"message":"تم التفعيل ✅"})

# ----- Admin -----
@api_view(["GET"])
@permission_classes([IsAdminEmail])
def pages_admin_list(_request):
    qs = Page.objects.order_by("slug","locale")
    return Response({"results": PageSerializer(qs, many=True).data})

@api_view(["POST"])
@permission_classes([IsAdminEmail])
def pages_admin_create(request):
    slug = (request.data or {}).get("slug","").strip()
    title = (request.data or {}).get("title","").strip()
    if not slug:
        return Response({"detail":"slug required"}, status=400)
    for locale in ["ar","en"]:
        Page.objects.get_or_create(slug=slug, locale=locale, defaults={"title": title or slug})
    return Response({"ok": True})

@api_view(["POST"])
@permission_classes([IsAdminEmail])
def pages_admin_upsert(request):
    data = request.data or {}
    slug = data.get("slug")
    locale = data.get("locale","ar")
    page, _ = Page.objects.get_or_create(slug=slug, locale=locale, defaults={"title": data.get("title", slug)})
    page.title = data.get("title", page.title)
    page.content_json = data.get("content_json") or {}
    page.html = (data.get("html") or "") + "<style>" + (data.get("css") or "") + "</style>"
    page.css = data.get("css") or ""
    page.save()
    return Response(PageSerializer(page).data)

@api_view(["POST"])
@permission_classes([IsAdminEmail])
def activation_generate(request):
    payload = request.data or {}
    email = (payload.get("user_email") or "").strip().lower()
    if not email:
        return Response({"detail":"user_email required"}, status=400)
    course_slug = (payload.get("course_slug") or "").strip()
    course = Course.objects.filter(slug=course_slug).first() if course_slug else None
    code = "ALN-" + secrets.token_hex(4).upper()
    obj = ActivationCode.objects.create(code=code, user_email=email, course=course, created_by=getattr(request.user,"email",""))
    return Response(ActivationSerializer(obj).data, status=201)

@api_view(["GET"])
@permission_classes([IsAdminEmail])
def admin_settings(_request):
    s = get_settings()
    return Response(SettingsSerializer(s).data)

@api_view(["POST"])
@permission_classes([IsAdminEmail])
def admin_settings_update(request):
    s = get_settings()
    for f in ["whatsapp_phone","instagram","facebook","telegram","email","usd_to_iqd_rate","iqd_round_to"]:
        if f in request.data:
            setattr(s, f, request.data.get(f))
    s.save()
    return Response(SettingsSerializer(s).data)
