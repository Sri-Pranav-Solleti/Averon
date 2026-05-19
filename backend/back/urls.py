from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


urlpatterns = [
    path('fruits/', fruitview.as_view()),
    path('register/', Userview.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path("users/", UserListView.as_view()),
    path('generate/',TicketView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("movies/",MovieList.as_view()),
    path("dates/",DateList.as_view()),
    path("theatres/",TheatreList.as_view()),
    path("screens/",ScreenList.as_view()),
    path("shows/",ShowList.as_view()),
    path("bookticket/",BookTicket.as_view()),
    path("googlelogin/",GoogleLoginView.as_view()),
]





