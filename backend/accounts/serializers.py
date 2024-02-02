from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CoachAssignment, CoachRequest, TrainingGroup, UserAccount
User = get_user_model()

class CoachRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachRequest
        fields = ('id', 'sender', 'receiver', 'status', 'created_at')

class CoachAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachAssignment
        fields = ('id', 'user', 'coach', 'request')

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'about', 'password')
 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'about')

class CoachAssignmentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    coach = UserSerializer()

    class Meta:
        model = CoachAssignment
        fields = ('user', 'coach')

class TrainingGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingGroup
        fields = ['id', 'name', 'coach', 'about', 'users']  # Include 'users' field

    # Set 'users' field as not required
    users = serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.all(),
        many=True,
        required=False  # Make the field optional
    )