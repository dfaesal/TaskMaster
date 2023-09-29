from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['In Progress', 'Completed', 'On Hold'], required=False)
    priority = serializers.ChoiceField(choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ], required=False)
    username = serializers.CharField(required=False)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']