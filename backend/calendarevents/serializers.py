from rest_framework import serializers
from .models import CalendarEvent, UserEventStatus

class UserEventStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEventStatus
        fields = '__all__' 

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        exclude = ['user']
