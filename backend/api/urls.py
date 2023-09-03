from django.contrib import admin
from django.urls import path,include
from api.views import UserRegisterViewSet,BookViewSet,IssueBookViewSet,LoginViewSet,ReturnBookViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,TokenVerifyView
)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path("user/register",UserRegisterViewSet.as_view(),name='register'),
    path("book",BookViewSet.as_view(),name="book"),
    path("issue_book",IssueBookViewSet.as_view(),name="issue"),
    path("user/login",LoginViewSet.as_view(),name="login"),
    path("book/return/<int:id>",ReturnBookViewSet.as_view(),name="return"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
