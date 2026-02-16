from django.db import models

class Page(models.Model):
    slug = models.SlugField(max_length=120)
    title = models.CharField(max_length=200, default="")
    locale = models.CharField(max_length=5, default="ar")
    content_json = models.JSONField(default=dict, blank=True)
    html = models.TextField(blank=True, default="")
    css = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("slug","locale")

class SiteSetting(models.Model):
    whatsapp_phone = models.CharField(max_length=50, blank=True, default="")
    instagram = models.CharField(max_length=200, blank=True, default="")
    facebook = models.CharField(max_length=200, blank=True, default="")
    telegram = models.CharField(max_length=200, blank=True, default="")
    email = models.CharField(max_length=200, blank=True, default="")
    usd_to_iqd_rate = models.IntegerField(default=1300)
    iqd_round_to = models.IntegerField(default=500)
    updated_at = models.DateTimeField(auto_now=True)

class PricingPlan(models.Model):
    name = models.CharField(max_length=120)
    note = models.CharField(max_length=240, blank=True, default="")
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_iqd_manual = models.IntegerField(null=True, blank=True)
    use_manual_iqd = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

class Course(models.Model):
    slug = models.SlugField(max_length=160, unique=True)
    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True, default="")
    short_ar = models.CharField(max_length=260, blank=True, default="")
    short_en = models.CharField(max_length=260, blank=True, default="")
    description_ar = models.TextField(blank=True, default="")
    description_en = models.TextField(blank=True, default="")
    thumbnail_url = models.TextField(blank=True, default="")
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_iqd_manual = models.IntegerField(null=True, blank=True)
    use_manual_iqd = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    featured_order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)

class CourseSection(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="sections")
    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True, default="")
    order = models.IntegerField(default=0)

class Lesson(models.Model):
    section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name="lessons")
    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True, default="")
    order = models.IntegerField(default=0)
    is_preview = models.BooleanField(default=False)
    video_url = models.TextField(blank=True, default="")

class AccessGrant(models.Model):
    user_email = models.EmailField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivationCode(models.Model):
    code = models.CharField(max_length=40, unique=True)
    user_email = models.EmailField()
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    plan = models.ForeignKey(PricingPlan, on_delete=models.SET_NULL, null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.EmailField(blank=True, default="")

class Comment(models.Model):
    target_type = models.CharField(max_length=20)
    target_slug = models.CharField(max_length=160)
    user_email = models.EmailField(blank=True, default="")
    content = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
