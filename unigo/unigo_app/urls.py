from django.urls import path
from . import views
from django.urls import path
from . import views

app_name = "unigo_app"

urlpatterns = [
    path("", views.home, name="home"),
    path("home/", views.home, name="home_redirect"),
    path("chat/", views.chat, name="chat"),
    path("api/chat", views.chat_api, name="chat_api"),
    path("api/onboarding", views.onboarding_api, name="onboarding_api"),
    path("setting/", views.setting, name="setting"),
]
