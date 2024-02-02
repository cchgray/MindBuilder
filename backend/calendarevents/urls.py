from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet, UserEventStatusViewSet, delete_group 

router = DefaultRouter()
router.register(r'calendarevents', CalendarEventViewSet)
router.register(r'usereventstatuses', UserEventStatusViewSet, basename='usereventstatus') 

urlpatterns = [
    path('', include(router.urls)),
    path('delete-group/<int:group_id>/', delete_group, name='delete_group'),
]