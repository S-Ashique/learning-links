from django.urls import path
from user.views import *
from school.views import UserGetSchool, UserAllSchools

urlpatterns = [
    path('', UserAllSchools, name='user-all-schools'),
    path('school/<int:id>/', UserGetSchool, name='user-get-school'),

]
