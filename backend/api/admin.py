from django.contrib import admin
from .models import Page, SiteSetting, PricingPlan, Course, CourseSection, Lesson, Comment, ActivationCode, AccessGrant
admin.site.register(Page)
admin.site.register(SiteSetting)
admin.site.register(PricingPlan)
admin.site.register(Course)
admin.site.register(CourseSection)
admin.site.register(Lesson)
admin.site.register(Comment)
admin.site.register(ActivationCode)
admin.site.register(AccessGrant)
