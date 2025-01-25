from django.urls import path
from school.views import AdminAllSchools, AdminGetSchool
from llfadmin.views import *
urlpatterns = [
    path('', AdminDashboard, name='admin-dashboard'),
    path('schools/', AdminAllSchools, name='admin-all-schools'),
    path('school/<int:id>/', AdminGetSchool, name='admin-get-school'),

]
