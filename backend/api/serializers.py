from rest_framework import serializers
from .models import Page, Course, CourseSection, Lesson, Comment, SiteSetting, PricingPlan, ActivationCode

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"

class LessonSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    class Meta:
        model = Lesson
        fields = ["id","title","video_url","is_preview","order"]
    def get_title(self,obj):
        lang = self.context.get("lang","ar")
        return obj.title_ar if lang=="ar" else (obj.title_en or obj.title_ar)

class SectionSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = CourseSection
        fields = ["id","title","order","lessons"]
    def get_title(self,obj):
        lang = self.context.get("lang","ar")
        return obj.title_ar if lang=="ar" else (obj.title_en or obj.title_ar)

class CourseListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = ["id","slug","title","short_description","thumbnail_url","is_featured","featured_order","price_usd","price_iqd_manual","use_manual_iqd"]
    def get_title(self,obj):
        lang = self.context.get("lang","ar")
        return obj.title_ar if lang=="ar" else (obj.title_en or obj.title_ar)
    def get_short_description(self,obj):
        lang = self.context.get("lang","ar")
        return obj.short_ar if lang=="ar" else (obj.short_en or obj.short_ar)

class CourseDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = ["id","slug","title","description","thumbnail_url","price_usd","price_iqd_manual","use_manual_iqd","sections"]
    def get_title(self,obj):
        lang = self.context.get("lang","ar")
        return obj.title_ar if lang=="ar" else (obj.title_en or obj.title_ar)
    def get_description(self,obj):
        lang = self.context.get("lang","ar")
        return obj.description_ar if lang=="ar" else (obj.description_en or obj.description_ar)
    def get_sections(self,obj):
        lang = self.context.get("lang","ar")
        secs = obj.sections.order_by("order").all()
        return SectionSerializer(secs, many=True, context={"lang":lang}).data

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id","target_type","target_slug","user_email","content","created_at","is_approved"]

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = "__all__"

class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = "__all__"

class ActivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivationCode
        fields = "__all__"
