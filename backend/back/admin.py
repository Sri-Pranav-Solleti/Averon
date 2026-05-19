from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *




@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Role Info", {"fields": ("role",)}),
    )

    list_display = ("username", "email", "role", "is_staff")

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("movie_name", "screen_no", "date", "time")
    list_filter = ("movie_name", "screen_no", "date", "time")
    search_fields = ("movie_name",)


admin.site.register(Fruit)




